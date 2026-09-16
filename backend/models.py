from datetime import datetime
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    text,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    email = Column(String(180), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # farmer | doctor
    language = Column(String(8), default="en")
    phone = Column(String(30), default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    doctor_profile = relationship("DoctorProfile", back_populates="user", uselist=False)
    plants = relationship("Plant", back_populates="owner")


class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    qualification = Column(String(160))
    specialization = Column(String(200))
    experience = Column(Integer, default=0)
    bio = Column(Text, default="")
    languages = Column(String(40), default="en")
    fee = Column(Integer, default=199)
    days = Column(String(80), default="Mon,Tue,Wed,Thu,Fri")
    slots = Column(String(200), default="10:00,15:00")
    verified = Column(Boolean, default=True)
    user = relationship("User", back_populates="doctor_profile")


class Plant(Base):
    __tablename__ = "plants"
    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    plant_name = Column(String(120))
    crop_type = Column(String(80))
    location = Column(String(120))
    notes = Column(Text, default="")
    image_path = Column(String(255), default="")
    owner = relationship("User", back_populates="plants")


class Appointment(Base):
    __tablename__ = "appointments"
    __table_args__ = (
        Index(
            "uq_active_appointment_doctor_slot",
            "doctor_id",
            "date",
            "start_time",
            unique=True,
            sqlite_where=text("status IN ('pending', 'confirmed')"),
        ),
    )
    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    doctor_id = Column(Integer, ForeignKey("users.id"))
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=True)
    date = Column(String(16), nullable=False)
    start_time = Column(String(8), nullable=False)
    end_time = Column(String(8), default="")
    status = Column(String(20), default="pending")
    reason = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)


class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text)
    sent_at = Column(DateTime, default=datetime.utcnow)


class ConsultationNote(Base):
    __tablename__ = "consultation_notes"
    id = Column(Integer, primary_key=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id"))
    doctor_id = Column(Integer, ForeignKey("users.id"))
    diagnosis = Column(Text, default="")
    advice = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    read = Column(Boolean, default=False)


class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    crop = Column(String(80))
    disease_key = Column(String(80))
    confidence = Column(Float)
    risk = Column(String(20))
    created_at = Column(DateTime, default=datetime.utcnow)


class CartItem(Base):
    __tablename__ = "cart_items"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    medicine_id = Column(String(80))
    qty = Column(Integer, default=1)


class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    items_json = Column(Text)
    total = Column(Float)
    address = Column(Text)
    phone = Column(String(30))
    status = Column(String(30), default="placed")
    created_at = Column(DateTime, default=datetime.utcnow)


class ChatLog(Base):
    __tablename__ = "chats"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    question = Column(Text)
    answer = Column(Text)
    language = Column(String(8))
    created_at = Column(DateTime, default=datetime.utcnow)


class DoctorVerificationRequest(Base):
    __tablename__ = "doctor_verification_requests"
    id = Column(Integer, primary_key=True)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    registration_number = Column(String(120), nullable=False)
    status = Column(String(20), default="pending")
    reviewer_note = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)


class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    category = Column(String(60), default="general")
    message = Column(Text, nullable=False)
    status = Column(String(20), default="new")
    created_at = Column(DateTime, default=datetime.utcnow)


class OutbreakAlert(Base):
    __tablename__ = "outbreak_alerts"
    id = Column(Integer, primary_key=True)
    title = Column(String(160), nullable=False)
    crop = Column(String(80), nullable=False)
    disease_name = Column(String(120), nullable=False)
    disease_key = Column(String(80), default="")
    severity = Column(String(20), default="High")  # Critical | High | Moderate
    location_name = Column(String(160), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    radius_km = Column(Float, default=10.0)
    cases_count = Column(Integer, default=1)
    advisory = Column(Text, default="")
    quarantine_protocol = Column(Text, default="")
    reporter_name = Column(String(120), default="KVK Agronomy Center")
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)