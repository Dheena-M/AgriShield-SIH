import json
import io
import os
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen
from datetime import datetime, timedelta
from pathlib import Path

from fastapi import Depends, FastAPI, File, Form, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from jose import JWTError, jwt
from passlib.hash import bcrypt
from PIL import Image, UnidentifiedImageError
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

ROOT = Path(__file__).resolve().parent.parent


def load_local_env(path: Path) -> None:
    """Load simple KEY=VALUE settings from a local .env file without overwriting real environment variables."""
    if not path.is_file():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        if key:
            os.environ.setdefault(key, value.strip().strip('"').strip("'"))


load_local_env(ROOT / ".env")
sys.path.insert(0, str(Path(__file__).resolve().parent))

from ai import analyze_leaf, cnn_status, crop_simulation, predict_risk
from advisor_models import crop_profiles, crop_recommendations, soil_health, yield_estimate
from catalog import feature_catalog
from db import SessionLocal, UPLOADS, engine
from knowledge import CROPS, DISEASES, DOCTORS, MEDICINES, PRODUCTS, SEEDS, chatbot_reply
from mongo_store import initialize_mongo, mongo_status, record_prediction
from models import (
    Appointment,
    Base,
    CartItem,
    ChatLog,
    ConsultationNote,
    DoctorProfile,
    DoctorVerificationRequest,
    Feedback,
    Message,
    Notification,
    Order,
    Plant,
    Prediction,
    User,
)

SECRET = os.environ.get("AGRISHIELD_SECRET", "agrishield-sih-demo-secret")
ALGO = "HS256"

app = FastAPI(title="AgriShield", version="1.0")
WEATHER_CACHE: dict[tuple[float, float], tuple[datetime, dict]] = {}
FORECAST_CACHE: dict[tuple[float, float], tuple[datetime, dict]] = {}
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def token_for(user: User) -> str:
    return jwt.encode(
        {"sub": str(user.id), "role": user.role, "exp": datetime.utcnow() + timedelta(days=7)},
        SECRET,
        algorithm=ALGO,
    )


def current_user(authorization: str | None = Header(default=None), db: Session = Depends(get_db)) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Login required")
    try:
        payload = jwt.decode(authorization.split()[1], SECRET, algorithms=[ALGO])
        user = db.get(User, int(payload["sub"]))
    except (JWTError, ValueError):
        raise HTTPException(401, "Invalid token")
    if not user:
        raise HTTPException(401, "User not found")
    return user


def optional_user(authorization: str | None = Header(default=None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        return None
    try:
        payload = jwt.decode(authorization.split()[1], SECRET, algorithms=[ALGO])
        return db.get(User, int(payload["sub"]))
    except Exception:
        return None


def notify(db: Session, user_id: int, text: str):
    db.add(Notification(user_id=user_id, text=text))


def validate_image(image_bytes: bytes):
    """Verify that an uploaded file is a decodable image before saving it."""
    try:
        with Image.open(io.BytesIO(image_bytes)) as uploaded:
            uploaded.verify()
    except (UnidentifiedImageError, OSError, ValueError):
        raise HTTPException(400, "Upload a valid leaf image")


def seed(db: Session):
    if db.query(User).count():
        return
    farmer = User(
        name="Ramesh Farmer",
        email="farmer@agrishield.in",
        password_hash=bcrypt.hash("Farmer@123"),
        role="farmer",
        language="mr",
        phone="9876500001",
    )
    db.add(farmer)
    db.flush()
    db.add(
        Plant(
            owner_id=farmer.id,
            plant_name="Kharif tomato",
            crop_type="tomato",
            location="Nashik",
            notes="Yellow patches on lower leaves",
        )
    )
    for d in DOCTORS:
        u = User(
            name=d["name"],
            email=d["email"],
            password_hash=bcrypt.hash("Doctor@123"),
            role="doctor",
            language="en",
            phone="9876500100",
        )
        db.add(u)
        db.flush()
        db.add(
            DoctorProfile(
                user_id=u.id,
                qualification=d["qualification"],
                specialization=d["specialization"],
                experience=d["experience"],
                bio=d["bio"],
                languages=d["languages"],
                fee=d["fee"],
                days=d["days"],
                slots=",".join(d["slots"]),
                verified=True,
            )
        )
    db.commit()


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    initialize_mongo()
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()


@app.post("/api/auth/register")
def register(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form("farmer"),
    language: str = Form("en"),
    phone: str = Form(""),
    db: Session = Depends(get_db),
):
    if role not in ("farmer", "doctor"):
        raise HTTPException(400, "Role must be farmer or doctor")
    if not name.strip() or len(name.strip()) > 120:
        raise HTTPException(400, "Enter a name up to 120 characters")
    if len(password) < 8:
        raise HTTPException(400, "Password must contain at least 8 characters")
    if len(password.encode("utf-8")) > 72:
        raise HTTPException(400, "Password is too long")
    if language not in ("en", "hi", "ta", "mr"):
        raise HTTPException(400, "Unsupported language")
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(400, "Email already registered")
    user = User(
        name=name,
        email=email.lower(),
        password_hash=bcrypt.hash(password),
        role=role,
        language=language,
        phone=phone,
    )
    db.add(user)
    db.flush()
    if role == "doctor":
        db.add(DoctorProfile(user_id=user.id, qualification="Pending profile", specialization="General", verified=False))
    db.commit()
    return {"token": token_for(user), "user": public_user(user)}


@app.post("/api/auth/login")
def login(email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email.lower()).first()
    if not user or not bcrypt.verify(password, user.password_hash):
        raise HTTPException(401, "Invalid email or password")
    return {"token": token_for(user), "user": public_user(user)}


def public_user(user: User):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "language": user.language,
        "phone": user.phone,
    }


@app.get("/api/me")
def me(user: User = Depends(current_user)):
    return public_user(user)


@app.get("/api/doctor-profile/me")
def my_doctor_profile(user: User = Depends(current_user), db: Session = Depends(get_db)):
    if user.role != "doctor":
        raise HTTPException(403, "Doctor profile is only available to doctors")
    profile = db.query(DoctorProfile).filter(DoctorProfile.user_id == user.id).first()
    if not profile:
        raise HTTPException(404, "Doctor profile not found")
    return {"qualification": profile.qualification, "specialization": profile.specialization, "experience": profile.experience, "bio": profile.bio, "languages": profile.languages, "fee": profile.fee, "days": profile.days, "slots": profile.slots, "verified": profile.verified}


@app.put("/api/doctor-profile/me")
def update_doctor_profile(
    qualification: str = Form(...), specialization: str = Form(...), experience: int = Form(0), bio: str = Form(""),
    languages: str = Form("en"), fee: int = Form(199), days: str = Form("Mon,Tue,Wed,Thu,Fri"), slots: str = Form("10:00,15:00"),
    user: User = Depends(current_user), db: Session = Depends(get_db),
):
    if user.role != "doctor":
        raise HTTPException(403, "Only doctors can update a doctor profile")
    if not qualification.strip() or not specialization.strip() or not (0 <= experience <= 70 and 0 <= fee <= 10000):
        raise HTTPException(400, "Enter valid qualification, specialization, experience, and fee")
    profile = db.query(DoctorProfile).filter(DoctorProfile.user_id == user.id).first()
    if not profile:
        profile = DoctorProfile(user_id=user.id)
        db.add(profile)
    profile.qualification, profile.specialization = qualification.strip(), specialization.strip()
    profile.experience, profile.bio = experience, bio.strip()[:1000]
    profile.languages, profile.fee = languages.strip()[:40], fee
    profile.days, profile.slots = days.strip()[:80], slots.strip()[:200]
    db.commit()
    return {"ok": True}

@app.get("/api/doctor-verification/me")
def doctor_verification_status(user: User = Depends(current_user), db: Session = Depends(get_db)):
    if user.role != "doctor":
        raise HTTPException(403, "Doctor verification is only available to doctors")
    profile = db.query(DoctorProfile).filter(DoctorProfile.user_id == user.id).first()
    request = db.query(DoctorVerificationRequest).filter(DoctorVerificationRequest.doctor_id == user.id).order_by(DoctorVerificationRequest.id.desc()).first()
    return {"verified": bool(profile and profile.verified), "status": "verified" if profile and profile.verified else (request.status if request else "not_submitted"), "registration_number": request.registration_number if request else "", "reviewer_note": request.reviewer_note if request else ""}


@app.post("/api/doctor-verification")
def submit_doctor_verification(registration_number: str = Form(...), user: User = Depends(current_user), db: Session = Depends(get_db)):
    if user.role != "doctor":
        raise HTTPException(403, "Doctor verification is only available to doctors")
    registration_number = registration_number.strip()
    if not 4 <= len(registration_number) <= 120:
        raise HTTPException(400, "Enter a valid registration or licence number")
    profile = db.query(DoctorProfile).filter(DoctorProfile.user_id == user.id).first()
    if not profile:
        profile = DoctorProfile(user_id=user.id, qualification="Pending profile", specialization="General", verified=False)
        db.add(profile)
    if profile.verified:
        return {"status": "verified", "message": "Your doctor profile is already verified."}
    db.add(DoctorVerificationRequest(doctor_id=user.id, registration_number=registration_number, status="pending"))
    db.commit()
    return {"status": "pending", "message": "Verification request submitted. Your profile will stay hidden until an administrator approves it."}


@app.patch("/api/admin/doctor-verification/{request_id}")
def review_doctor_verification(
    request_id: int,
    status: str = Form(...),
    reviewer_note: str = Form(""),
    x_admin_key: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    """Approve or reject a doctor only from a protected administrator workflow."""
    expected_key = os.environ.get("ADMIN_VERIFICATION_KEY")
    if not expected_key:
        raise HTTPException(503, "Set ADMIN_VERIFICATION_KEY before using the administrator verification route")
    if x_admin_key != expected_key:
        raise HTTPException(403, "Administrator verification key is required")
    if status not in {"approved", "rejected"}:
        raise HTTPException(400, "Status must be approved or rejected")
    request = db.get(DoctorVerificationRequest, request_id)
    if not request:
        raise HTTPException(404, "Verification request not found")
    profile = db.query(DoctorProfile).filter(DoctorProfile.user_id == request.doctor_id).first()
    if not profile:
        raise HTTPException(404, "Doctor profile not found")
    request.status = status
    request.reviewer_note = reviewer_note.strip()[:1000]
    request.reviewed_at = datetime.utcnow()
    profile.verified = status == "approved"
    db.commit()
    return {"ok": True, "status": status, "doctor_id": request.doctor_id}


@app.get("/api/doctors")
def list_doctors(q: str = "", db: Session = Depends(get_db)):
    rows = db.query(DoctorProfile).filter(DoctorProfile.verified == True).all()  # noqa: E712
    out = []
    for p in rows:
        u = db.get(User, p.user_id)
        blob = f"{u.name} {p.specialization} {p.bio}".lower()
        if q and q.lower() not in blob:
            continue
        out.append(
            {
                "id": u.id,
                "name": u.name,
                "qualification": p.qualification,
                "specialization": p.specialization,
                "experience": p.experience,
                "bio": p.bio,
                "languages": p.languages,
                "fee": p.fee,
                "days": p.days.split(","),
                "slots": p.slots.split(","),
            }
        )
    return out


@app.get("/api/doctors/{doctor_id}/slots")
def doctor_slots(doctor_id: int, date: str, db: Session = Depends(get_db)):
    p = db.query(DoctorProfile).filter(DoctorProfile.user_id == doctor_id).first()
    doctor = db.get(User, doctor_id)
    if not p or not doctor or doctor.role != "doctor" or not p.verified:
        raise HTTPException(404, "Doctor not found")
    try:
        appointment_day = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(400, "Use date format YYYY-MM-DD")
    if appointment_day < datetime.utcnow().date():
        raise HTTPException(400, "Choose a future date")
    if appointment_day.strftime("%a") not in p.days.split(","):
        return {"slots": [], "message": "Doctor is unavailable on this date"}
    taken = {
        a.start_time
        for a in db.query(Appointment).filter(
            Appointment.doctor_id == doctor_id,
            Appointment.date == date,
            Appointment.status.in_(["pending", "confirmed"]),
        )
    }
    return {"slots": [s for s in p.slots.split(",") if s not in taken]}


@app.post("/api/plants")
def add_plant(
    plant_name: str = Form(...),
    crop_type: str = Form(...),
    location: str = Form(""),
    notes: str = Form(""),
    image: UploadFile | None = File(default=None),
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    if user.role != "farmer":
        raise HTTPException(403, "Only farmers add plants")
    if not plant_name.strip() or not crop_type.strip():
        raise HTTPException(400, "Plant name and crop are required")
    image_path = ""
    if image:
        image_bytes = image.file.read()
        filename = (image.filename or "leaf.jpg").lower()
        if len(image_bytes) > 6 * 1024 * 1024:
            raise HTTPException(400, "Image too large")
        if not any(filename.endswith(ext) for ext in (".jpg", ".jpeg", ".png", ".webp", ".bmp")):
            raise HTTPException(400, "Upload a leaf image (jpg/png/webp/bmp)")
        validate_image(image_bytes)
        image_path = f"plant_{user.id}_{datetime.utcnow().timestamp()}_{Path(filename).name}"
        (UPLOADS / image_path).write_bytes(image_bytes)
    p = Plant(
        owner_id=user.id,
        plant_name=plant_name.strip(),
        crop_type=crop_type.strip(),
        location=location.strip(),
        notes=notes.strip(),
        image_path=image_path,
    )
    db.add(p)
    db.commit()
    return {"id": p.id}


@app.get("/api/plants")
def my_plants(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows = db.query(Plant).filter(Plant.owner_id == user.id).all()
    return [
        {
            "id": p.id,
            "plant_name": p.plant_name,
            "crop_type": p.crop_type,
            "location": p.location,
            "notes": p.notes,
            "has_image": bool(p.image_path),
        }
        for p in rows
    ]


@app.post("/api/appointments")
def book(
    doctor_id: int = Form(...),
    date: str = Form(...),
    start_time: str = Form(...),
    reason: str = Form(""),
    plant_id: int | None = Form(default=None),
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    if user.role != "farmer":
        raise HTTPException(403, "Only farmers can book")
    doctor = db.get(User, doctor_id)
    profile = db.query(DoctorProfile).filter(DoctorProfile.user_id == doctor_id).first()
    if not doctor or doctor.role != "doctor" or not profile or not profile.verified:
        raise HTTPException(404, "Verified doctor not found")
    try:
        appointment_day = datetime.strptime(date, "%Y-%m-%d").date()
        datetime.strptime(start_time, "%H:%M")
    except ValueError:
        raise HTTPException(400, "Choose a valid date and time")
    if appointment_day < datetime.utcnow().date():
        raise HTTPException(400, "Choose a future date")
    if appointment_day.strftime("%a") not in profile.days.split(",") or start_time not in profile.slots.split(","):
        raise HTTPException(400, "That doctor is unavailable at the selected time")
    if len(reason.strip()) > 1_000:
        raise HTTPException(400, "Consultation reason is too long")
    if plant_id is not None:
        plant = db.get(Plant, plant_id)
        if not plant or plant.owner_id != user.id:
            raise HTTPException(403, "Choose one of your plants")
    a = Appointment(
        owner_id=user.id,
        doctor_id=doctor_id,
        plant_id=plant_id,
        date=date,
        start_time=start_time,
        status="pending",
        reason=reason,
    )
    db.add(a)
    notify(db, doctor_id, f"New consultation request from {user.name} on {date} {start_time}")
    notify(db, user.id, "Consultation request sent. Waiting for doctor acceptance.")
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "This slot is already booked")
    return {"id": a.id, "status": a.status}


@app.get("/api/appointments/my")
def my_appointments(user: User = Depends(current_user), db: Session = Depends(get_db)):
    if user.role == "doctor":
        rows = db.query(Appointment).filter(Appointment.doctor_id == user.id).all()
    else:
        rows = db.query(Appointment).filter(Appointment.owner_id == user.id).all()
    out = []
    for a in rows:
        owner = db.get(User, a.owner_id)
        doc = db.get(User, a.doctor_id)
        out.append(
            {
                "id": a.id,
                "date": a.date,
                "start_time": a.start_time,
                "status": a.status,
                "reason": a.reason,
                "owner_name": owner.name if owner else "",
                "doctor_name": doc.name if doc else "",
                "owner_id": a.owner_id,
                "doctor_id": a.doctor_id,
            }
        )
    return out


@app.patch("/api/appointments/{aid}/status")
def set_status(aid: int, status: str = Form(...), user: User = Depends(current_user), db: Session = Depends(get_db)):
    a = db.get(Appointment, aid)
    if not a:
        raise HTTPException(404, "Not found")
    if user.role == "doctor":
        if a.doctor_id != user.id:
            raise HTTPException(403, "Not your appointment")
        allowed = {"confirmed", "rejected", "completed", "cancelled"}
    else:
        if a.owner_id != user.id:
            raise HTTPException(403, "Not your appointment")
        allowed = {"cancelled"}
    if status not in allowed:
        raise HTTPException(400, "Invalid status")
    if a.status in ("rejected", "cancelled", "completed"):
        raise HTTPException(409, "This appointment is already closed")
    if status == "completed" and a.status != "confirmed":
        raise HTTPException(400, "Only confirmed appointments can be completed")
    a.status = status
    other = a.owner_id if user.role == "doctor" else a.doctor_id
    notify(db, other, f"Appointment #{a.id} is now {status}")
    db.commit()
    return {"ok": True, "status": status}


@app.get("/api/appointments/{aid}/messages")
def get_messages(aid: int, user: User = Depends(current_user), db: Session = Depends(get_db)):
    a = db.get(Appointment, aid)
    if not a or user.id not in (a.owner_id, a.doctor_id):
        raise HTTPException(403, "Not allowed")
    if a.status not in ("confirmed", "completed"):
        raise HTTPException(400, "Chat opens after the doctor accepts")
    rows = db.query(Message).filter(Message.appointment_id == aid).order_by(Message.id).all()
    return [
        {
            "id": m.id,
            "sender_id": m.sender_id,
            "message": m.message,
            "sent_at": m.sent_at.isoformat(),
        }
        for m in rows
    ]


@app.post("/api/appointments/{aid}/messages")
def post_message(aid: int, message: str = Form(...), user: User = Depends(current_user), db: Session = Depends(get_db)):
    a = db.get(Appointment, aid)
    if not a or user.id not in (a.owner_id, a.doctor_id):
        raise HTTPException(403, "Not allowed")
    if a.status not in ("confirmed", "completed"):
        raise HTTPException(400, "Chat opens after the doctor accepts")
    if not message.strip() or len(message.strip()) > 1_000:
        raise HTTPException(400, "Message must be between 1 and 1000 characters")
    m = Message(appointment_id=aid, sender_id=user.id, message=message.strip())
    db.add(m)
    db.commit()
    return {"id": m.id}


@app.post("/api/appointments/{aid}/notes")
def add_notes(
    aid: int,
    diagnosis: str = Form(""),
    advice: str = Form(""),
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    a = db.get(Appointment, aid)
    if not a or user.role != "doctor" or a.doctor_id != user.id:
        raise HTTPException(403, "Only the assigned doctor can add notes")
    if a.status not in ("confirmed", "completed"):
        raise HTTPException(400, "Notes can be added after acceptance")
    n = ConsultationNote(appointment_id=aid, doctor_id=user.id, diagnosis=diagnosis, advice=advice)
    db.add(n)
    notify(db, a.owner_id, "Doctor added consultation notes")
    db.commit()
    return {"id": n.id}


@app.get("/api/appointments/{aid}/notes")
def get_notes(aid: int, user: User = Depends(current_user), db: Session = Depends(get_db)):
    a = db.get(Appointment, aid)
    if not a or user.id not in (a.owner_id, a.doctor_id):
        raise HTTPException(403, "Not allowed")
    rows = db.query(ConsultationNote).filter(ConsultationNote.appointment_id == aid).all()
    return [{"diagnosis": n.diagnosis, "advice": n.advice, "created_at": n.created_at.isoformat()} for n in rows]


@app.get("/api/notifications")
def notes_list(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows = db.query(Notification).filter(Notification.user_id == user.id).order_by(Notification.id.desc()).limit(30).all()
    return [{"id": n.id, "text": n.text, "created_at": n.created_at.isoformat()} for n in rows]


@app.get("/api/scans")
def scan_history(user: User = Depends(current_user), db: Session = Depends(get_db)):
    """Return only the signed-in farmer's saved leaf-analysis history."""
    if user.role != "farmer":
        raise HTTPException(403, "Scan history is available to farmers")
    rows = db.query(Prediction).filter(Prediction.user_id == user.id).order_by(Prediction.id.desc()).limit(50).all()
    return [{"id": row.id, "crop": row.crop, "disease_key": row.disease_key, "confidence": row.confidence, "risk": row.risk, "created_at": row.created_at.isoformat()} for row in rows]


@app.get("/api/dashboard")
def farmer_dashboard(user: User = Depends(current_user), db: Session = Depends(get_db)):
    """Compact farmer-only summary for the app dashboard."""
    if user.role != "farmer":
        raise HTTPException(403, "Farmer dashboard is available to farmers")
    scans = db.query(Prediction).filter(Prediction.user_id == user.id).order_by(Prediction.id.desc()).limit(5).all()
    appointments = db.query(Appointment).filter(Appointment.owner_id == user.id).order_by(Appointment.id.desc()).limit(5).all()
    orders = db.query(Order).filter(Order.user_id == user.id).order_by(Order.id.desc()).limit(5).all()
    plants = db.query(Plant).filter(Plant.owner_id == user.id).all()
    doctor_names = {u.id: u.name for u in db.query(User).filter(User.role == "doctor").all()}
    return {"counts": {"plants": len(plants), "scans": db.query(Prediction).filter(Prediction.user_id == user.id).count(), "appointments": db.query(Appointment).filter(Appointment.owner_id == user.id).count(), "orders": db.query(Order).filter(Order.user_id == user.id).count()}, "recent_scans": [{"crop": s.crop, "disease_key": s.disease_key, "confidence": s.confidence, "risk": s.risk, "created_at": s.created_at.isoformat()} for s in scans], "appointments": [{"date": a.date, "time": a.start_time, "doctor": doctor_names.get(a.doctor_id, "Plant doctor"), "status": a.status} for a in appointments], "orders": [{"id": o.id, "total": o.total, "status": o.status} for o in orders]}


@app.post("/api/predict")
async def predict(
    crop: str = Form("tomato"),
    file: UploadFile = File(...),
    user: User | None = Depends(optional_user),
    db: Session = Depends(get_db),
):
    data = await file.read()
    if len(data) > 6 * 1024 * 1024:
        raise HTTPException(400, "Image too large")
    name = (file.filename or "").lower()
    if not any(name.endswith(ext) for ext in (".jpg", ".jpeg", ".png", ".webp", ".bmp")):
        raise HTTPException(400, "Upload a leaf image (jpg/png)")
    validate_image(data)
    dest = UPLOADS / f"{datetime.utcnow().timestamp()}_{Path(file.filename or 'leaf.jpg').name}"
    dest.write_bytes(data)
    result = analyze_leaf(data, crop)
    month = datetime.utcnow().month
    crop_idx = CROPS.index(crop) if crop in CROPS else 2
    risk, _ = predict_risk(crop_idx, month, 120, 28, 78, 0)
    result["crop"] = crop
    result["risk"] = risk
    db.add(
        Prediction(
            user_id=user.id if user else None,
            crop=crop,
            disease_key=result["disease_key"],
            confidence=result["confidence"],
            risk=risk,
        )
    )
    db.commit()
    result["mongo_saved"] = record_prediction({
        "sqlite_user_id": user.id if user else None,
        "crop": crop,
        "disease_key": result["disease_key"],
        "model_label": result.get("model_label"),
        "confidence": result["confidence"],
        "risk": risk,
        "model": result.get("model", {}),
        "severity": result.get("severity", {}),
        "source": "leaf_upload",
    })
    return result


@app.post("/api/symptom-check")
def symptom_check(
    crop: str = Form(""),
    symptoms: str = Form(...),
    user: User = Depends(current_user),
):
    """Rule-based triage for cases where a clear leaf photo is not available."""
    text = symptoms.lower().strip()
    if len(text) < 8:
        raise HTTPException(400, "Please describe at least one visible symptom.")

    rules = {
        "fungal_blight": ("Fungal blight / leaf spot", ("brown", "black spot", "dark spot", "ring", "mold", "blight")),
        "bacterial_blight": ("Bacterial leaf blight", ("water soaked", "yellow halo", "yellow edge", "ooze", "streak")),
        "yellow_deficiency": ("Yellowing / nutrient stress", ("yellow", "pale", "chlorosis", "weak growth", "wilting")),
        "pest_damage": ("Pest feeding damage", ("hole", "chewed", "curl", "insect", "aphid", "whitefly", "caterpillar", "sticky")),
    }
    scores = {key: sum(word in text for word in words) for key, (_, words) in rules.items()}
    key, score = max(scores.items(), key=lambda item: item[1])
    if not score:
        return {
            "match": "No clear pattern", "confidence": "low", "advice": "No reliable match from the description. Share a sharp leaf photo or book a plant doctor.",
            "disclaimer": "Symptom checker only — this is not image-model detection or a laboratory diagnosis.",
        }
    disease = DISEASES[key]
    confidence = "moderate" if score >= 2 else "low"
    return {
        "match": rules[key][0], "confidence": confidence, "advice": disease["advice"]["en"],
        "disclaimer": "Symptom checker only — based on typed observations, not a leaf image. Confirm with a clear photo or plant doctor before treatment.",
    }


@app.post("/api/risk")
def risk(
    crop: str = Form("rice"),
    month: int = Form(7),
    rain: float = Form(150),
    temp: float = Form(29),
    humidity: float = Form(80),
    outbreak: int = Form(0),
):
    crop_idx = CROPS.index(crop) if crop in CROPS else 0
    label, conf = predict_risk(crop_idx, month, rain, temp, humidity, outbreak)
    return {"risk": label, "confidence": round(conf, 3), "crop": crop}


@app.post("/api/simulate")
def simulate(
    n: float = Form(40),
    p: float = Form(25),
    k: float = Form(25),
    rain: float = Form(100),
    temp: float = Form(28),
):
    return crop_simulation(n, p, k, rain, temp)


@app.post("/api/soil-analysis")
def soil_analysis(n: float = Form(...), p: float = Form(...), k: float = Form(...), ph: float = Form(...)):
    if not (0 <= n <= 300 and 0 <= p <= 200 and 0 <= k <= 300 and 3 <= ph <= 11):
        raise HTTPException(400, "Enter realistic NPK and pH values")
    return soil_health(n, p, k, ph)


@app.post("/api/crop-recommendations")
def recommend_crops(
    n: float = Form(...), p: float = Form(...), k: float = Form(...), ph: float = Form(...),
    temp: float = Form(...), humidity: float = Form(...), rainfall: float = Form(...), soil_type: str = Form("Loamy"),
):
    if not (0 <= n <= 300 and 0 <= p <= 200 and 0 <= k <= 300 and 3 <= ph <= 11 and 0 <= temp <= 55 and 0 <= humidity <= 100 and 0 <= rainfall <= 4000):
        raise HTTPException(400, "Enter realistic soil and climate values")
    return crop_recommendations(n, p, k, ph, temp, humidity, rainfall, soil_type)


@app.get("/api/datasets/crop-profiles")
def crop_profile_dataset():
    return {"name": "AgriShield demo crop profiles", "records": crop_profiles(), "disclaimer": "These six reference profiles are demonstration data, not a field survey or a training dataset."}


@app.get("/api/metadata/features")
def feature_metadata():
    """Public, non-sensitive metadata for every product feature and its data."""
    return feature_catalog()


@app.get("/api/weather")
def live_weather(lat: float, lon: float):
    """Fetch current conditions through the server, keeping the API key private."""
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        raise HTTPException(400, "Enter valid latitude and longitude")
    key = os.environ.get("OPENWEATHER_API_KEY")
    if not key:
        raise HTTPException(503, "Live weather is not configured. Set OPENWEATHER_API_KEY on the server.")
    cache_key = (round(lat, 3), round(lon, 3))
    cached = WEATHER_CACHE.get(cache_key)
    if cached and datetime.utcnow() - cached[0] < timedelta(minutes=10):
        return {**cached[1], "cached": True}
    params = urlencode({"lat": lat, "lon": lon, "appid": key, "units": "metric"})
    try:
        with urlopen(f"https://api.openweathermap.org/data/2.5/weather?{params}", timeout=8) as response:
            payload = json.load(response)
    except HTTPError as exc:
        if exc.code in (401, 403):
            raise HTTPException(503, "OpenWeather rejected the configured API key.") from exc
        raise HTTPException(503, "OpenWeather is temporarily unavailable.") from exc
    except (URLError, TimeoutError, ValueError) as exc:
        raise HTTPException(503, "Could not retrieve live weather. Try again shortly.") from exc
    main = payload.get("main", {})
    wind = payload.get("wind", {})
    weather = (payload.get("weather") or [{}])[0]
    result = {
        "location": payload.get("name", "Selected location"),
        "temperature_c": main.get("temp"),
        "feels_like_c": main.get("feels_like"),
        "humidity": main.get("humidity"),
        "wind_mps": wind.get("speed"),
        "condition": weather.get("description", "Current conditions"),
        "cached": False,
    }
    WEATHER_CACHE[cache_key] = (datetime.utcnow(), result)
    return result


@app.get("/api/weather/forecast")
def weather_forecast(lat: float, lon: float):
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        raise HTTPException(400, "Enter valid latitude and longitude")
    key = os.environ.get("OPENWEATHER_API_KEY")
    if not key:
        raise HTTPException(503, "Live forecast is not configured. Set OPENWEATHER_API_KEY on the server.")
    cache_key = (round(lat, 3), round(lon, 3))
    cached = FORECAST_CACHE.get(cache_key)
    if cached and datetime.utcnow() - cached[0] < timedelta(minutes=30):
        return {**cached[1], "cached": True}
    params = urlencode({"lat": lat, "lon": lon, "appid": key, "units": "metric"})
    try:
        with urlopen(f"https://api.openweathermap.org/data/2.5/forecast?{params}", timeout=8) as response:
            payload = json.load(response)
    except HTTPError as exc:
        if exc.code in (401, 403):
            raise HTTPException(503, "OpenWeather rejected the configured API key.") from exc
        raise HTTPException(503, "OpenWeather forecast is temporarily unavailable.") from exc
    except (URLError, TimeoutError, ValueError) as exc:
        raise HTTPException(503, "Could not retrieve the forecast. Try again shortly.") from exc
    daily: dict[str, dict] = {}
    for item in payload.get("list", []):
        day = str(item.get("dt_txt", ""))[:10]
        if not day:
            continue
        row = daily.setdefault(day, {"temps": [], "humidity": [], "rain_mm": 0.0, "conditions": []})
        main = item.get("main", {})
        row["temps"].append(float(main.get("temp", 0)))
        row["humidity"].append(float(main.get("humidity", 0)))
        row["rain_mm"] += float(item.get("rain", {}).get("3h", 0))
        row["conditions"].append((item.get("weather") or [{}])[0].get("description", ""))
    days = []
    alerts = []
    for day, row in list(daily.items())[:5]:
        humidity = round(max(row["humidity"]) if row["humidity"] else 0)
        rain_mm = round(row["rain_mm"], 1)
        high = round(max(row["temps"]) if row["temps"] else 0, 1)
        low = round(min(row["temps"]) if row["temps"] else 0, 1)
        days.append({"date": day, "temp_min_c": low, "temp_max_c": high, "humidity_max": humidity, "rain_mm": rain_mm, "condition": next((c for c in row["conditions"] if c), "Forecast")})
        if humidity >= 85 and rain_mm >= 5:
            alerts.append(f"{day}: humid and rainy conditions can raise fungal disease risk; inspect leaves and avoid overhead irrigation.")
        elif rain_mm >= 20:
            alerts.append(f"{day}: heavy rain is forecast; check drainage and delay spraying if possible.")
    result = {"location": payload.get("city", {}).get("name", "Selected location"), "days": days, "alerts": alerts, "cached": False}
    FORECAST_CACHE[cache_key] = (datetime.utcnow(), result)
    return result


@app.get("/api/model-status")
def model_status():
    """Reports model availability without exposing model files."""
    return {"cnn": cnn_status(load=True), "yolo": {"active": False, "reason": "YOLO weights and labelled bounding-box dataset have not been added."}}


@app.get("/api/health")
def health_check():
    status = cnn_status()
    return {"status": "ok", "environment": os.environ.get("AGRISHIELD_ENV", "development"), "services": {"database": "sqlite", "mongodb": mongo_status(), "live_weather_configured": bool(os.environ.get("OPENWEATHER_API_KEY")), "rice_cnn_weights_present": status["weights_present"], "rice_cnn_loaded": status["loaded"]}}
@app.post("/api/yield-estimate")
def estimate_yield(
    crop: str = Form("maize"), n: float = Form(...), p: float = Form(...), k: float = Form(...), ph: float = Form(...),
    temp: float = Form(...), rainfall: float = Form(...), area: float = Form(1),
):
    if not (0 <= n <= 300 and 0 <= p <= 200 and 0 <= k <= 300 and 3 <= ph <= 11 and 0 <= temp <= 55 and 0 <= rainfall <= 4000 and 0 < area <= 1000):
        raise HTTPException(400, "Enter realistic yield-estimation values")
    return yield_estimate(crop, n, p, k, ph, temp, rainfall, area)


@app.post("/api/sowing-plan")
def sowing_plan(crop: str = Form(...), area: float = Form(1), month: int = Form(...), soil_type: str = Form("Loamy")):
    if not 0 < area <= 1000 or not 1 <= month <= 12:
        raise HTTPException(400, "Enter a valid area and month")
    windows = {
        "rice": {"months": (6, 7), "seed_rate": 30, "note": "Use transplanting or direct seeding only after rainfall and field preparation are suitable."},
        "maize": {"months": (6, 7, 10, 11), "seed_rate": 20, "note": "Sow in well-drained soil with recommended spacing for the selected variety."},
        "tomato": {"months": (6, 7, 9, 10), "seed_rate": 0.12, "note": "Raise healthy nursery seedlings before transplanting; avoid waterlogged beds."},
        "groundnut": {"months": (6, 7), "seed_rate": 110, "note": "Treat seed only under locally approved guidance and sow after adequate moisture."},
        "millet": {"months": (6, 7), "seed_rate": 8, "note": "Use clean seed and sow after the first effective monsoon rainfall."},
        "cotton": {"months": (5, 6, 7), "seed_rate": 2, "note": "Use regionally approved seed and observe local pest-management recommendations."},
    }
    key = crop.lower().strip()
    plan = windows.get(key)
    if not plan:
        raise HTTPException(400, "Choose a supported crop for the sowing planner")
    suitable = month in plan["months"]
    total = round(plan["seed_rate"] * area, 2)
    return {"crop": key, "suitable_now": suitable, "seed_rate_per_hectare_kg": plan["seed_rate"], "estimated_seed_kg": total, "soil_type": soil_type, "advice": plan["note"], "disclaimer": "Sowing window and seed rate are planning references. Confirm variety, spacing, seed treatment and local advisories before sowing."}

@app.post("/api/chat")
def chat(
    message: str = Form(...),
    language: str = Form("en"),
    user: User | None = Depends(optional_user),
    db: Session = Depends(get_db),
):
    if not message.strip() or len(message.strip()) > 1_000:
        raise HTTPException(400, "Message must be between 1 and 1000 characters")
    answer = chatbot_reply(message.strip(), language if language in ("en", "hi", "ta", "mr") else "en")
    db.add(
        ChatLog(
            user_id=user.id if user else None,
            question=message,
            answer=answer,
            language=language,
        )
    )
    db.commit()
    return {"answer": answer, "language": language}


@app.post("/api/feedback")
def submit_feedback(rating: int = Form(...), category: str = Form("general"), message: str = Form(...), user: User = Depends(current_user), db: Session = Depends(get_db)):
    if not 1 <= rating <= 5:
        raise HTTPException(400, "Rating must be between 1 and 5")
    message = message.strip()
    if not 5 <= len(message) <= 1000:
        raise HTTPException(400, "Feedback must be between 5 and 1000 characters")
    category = category.strip().lower()[:60] or "general"
    entry = Feedback(user_id=user.id, rating=rating, category=category, message=message)
    db.add(entry)
    db.commit()
    return {"ok": True, "id": entry.id, "message": "Thank you for your feedback."}


@app.get("/api/feedback/my")
def my_feedback(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows = db.query(Feedback).filter(Feedback.user_id == user.id).order_by(Feedback.id.desc()).limit(20).all()
    return [{"id": row.id, "rating": row.rating, "category": row.category, "message": row.message, "status": row.status, "created_at": row.created_at.isoformat()} for row in rows]

@app.get("/api/medicines")
def medicines():
    return MEDICINES


@app.get("/api/seeds")
def seeds():
    return SEEDS

@app.post("/api/cart")
def add_cart(medicine_id: str = Form(...), qty: int = Form(1), user: User = Depends(current_user), db: Session = Depends(get_db)):
    if user.role != "farmer":
        raise HTTPException(403, "Only farmers can order medicines")
    if medicine_id not in PRODUCTS:
        raise HTTPException(404, "Unknown product")
    if not 1 <= qty <= 10:
        raise HTTPException(400, "Quantity must be between 1 and 10")
    item = db.query(CartItem).filter(CartItem.user_id == user.id, CartItem.medicine_id == medicine_id).first()
    if item:
        if item.qty + qty > 10:
            raise HTTPException(400, "Maximum quantity per medicine is 10")
        item.qty += qty
    else:
        db.add(CartItem(user_id=user.id, medicine_id=medicine_id, qty=qty))
    db.commit()
    return {"ok": True}


@app.get("/api/cart")
def get_cart(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows = db.query(CartItem).filter(CartItem.user_id == user.id).all()
    items = []
    total = 0
    for r in rows:
        m = PRODUCTS[r.medicine_id]
        line = m["price"] * r.qty
        total += line
        items.append({"id": r.id, "medicine_id": r.medicine_id, "qty": r.qty, "price": m["price"], "name": m["name"], "line": line})
    return {"items": items, "total": total}


@app.delete("/api/cart/{item_id}")
def del_cart(item_id: int, user: User = Depends(current_user), db: Session = Depends(get_db)):
    item = db.get(CartItem, item_id)
    if item and item.user_id == user.id:
        db.delete(item)
        db.commit()
    return {"ok": True}


@app.post("/api/orders")
def place_order(
    address: str = Form(...),
    phone: str = Form(...),
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    if user.role != "farmer":
        raise HTTPException(403, "Only farmers can place orders")
    if len(address.strip()) < 8 or len(phone.strip()) < 8:
        raise HTTPException(400, "Enter a complete delivery address and phone number")
    rows = db.query(CartItem).filter(CartItem.user_id == user.id).all()
    if not rows:
        raise HTTPException(400, "Cart is empty")
    items = []
    total = 0
    for r in rows:
        m = PRODUCTS[r.medicine_id]
        items.append({"medicine_id": r.medicine_id, "qty": r.qty, "price": m["price"], "name": m["name"]})
        total += m["price"] * r.qty
        db.delete(r)
    order = Order(user_id=user.id, items_json=json.dumps(items), total=total, address=address, phone=phone, status="placed")
    db.add(order)
    notify(db, user.id, f"Order placed. Total ₹{total}")
    db.commit()
    return {"id": order.id, "total": total, "status": "placed"}


@app.get("/api/orders")
def list_orders(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows = db.query(Order).filter(Order.user_id == user.id).order_by(Order.id.desc()).all()
    return [
        {
            "id": o.id,
            "total": o.total,
            "status": o.status,
            "address": o.address,
            "items": json.loads(o.items_json),
            "created_at": o.created_at.isoformat(),
        }
        for o in rows
    ]


@app.get("/api/crops")
def crops():
    return CROPS


frontend_dir = ROOT / "frontend"
app.mount("/static", StaticFiles(directory=str(frontend_dir)), name="static")


@app.get("/sw.js", include_in_schema=False)
def service_worker():
    return FileResponse(frontend_dir / "sw.js", media_type="application/javascript")


@app.get("/")
def index():
    return FileResponse(frontend_dir / "index.html")
