"""Disease analysis and environmental risk helpers for AgriShield."""

from __future__ import annotations

import base64
import io
import json
from pathlib import Path
from threading import Lock

import numpy as np
from PIL import Image
from sklearn.ensemble import RandomForestClassifier

from knowledge import DISEASES

ROOT = Path(__file__).resolve().parent.parent
CNN_MODEL_PATH = ROOT / "models" / "rice_leaf_disease.keras"
CNN_LABELS_PATH = ROOT / "models" / "rice_leaf_disease.labels.json"
CNN_METRICS_PATH = ROOT / "models" / "rice_leaf_disease.metrics.json"
CNN_LABEL_TO_DISEASE = {
    "Bacterial leaf blight": "bacterial_blight",
    "Brown spot": "fungal_blight",
    "Leaf smut": "fungal_blight",
}
SUPPORTED_DISEASE_CROPS = frozenset({"rice"})


class UnsupportedDiseaseCropError(ValueError):
    """Raised when disease prediction is requested for an unvalidated crop."""


class DiseaseModelUnavailableError(RuntimeError):
    """Raised when the validated crop has no loaded disease model."""

RECOMMENDATIONS_3TIER = {
    "bacterial_blight": {
        "cultural": [
            "Drain stagnant standing water from fields for 48 hours to retard Xanthomonas bacterial spread.",
            "Avoid excess nitrogenous fertilizers (split urea; avoid top-dressing during visible infection).",
            "Sanitize pruning tools and tractor attachments with 1% sodium hypochlorite before entering adjacent fields."
        ],
        "biological": [
            "Foliar spray of Pseudomonas fluorescens (IS-1 strain) @ 5 g/L or 2.5 kg/ha at onset of tillering.",
            "Apply fresh cow dung slurry supernatant (20 kg cow dung in 100 L water, filter through muslin cloth)."
        ],
        "chemical": [
            "Copper Oxychloride 50% WP @ 2.5 g/L + Streptocycline @ 0.1 g/L (CIBRC approved combination).",
            "Spray early morning or late evening; repeat after 10-12 days if humid, cloudy conditions persist."
        ]
    },
    "fungal_blight": {
        "cultural": [
            "Collect and incinerate heavily infected lower leaves to lower viable airborne fungal spore count.",
            "Ensure optimal hill/row spacing (20x15 cm) to facilitate sunlight penetration and canopy aeration.",
            "Avoid overhead sprinkler irrigation in late evenings to limit leaf wetness duration below 6 hours."
        ],
        "biological": [
            "Foliar application of Trichoderma harzianum @ 5 g/L of water with wetting agent (0.5 ml/L).",
            "Cold-pressed Neem seed kernel extract (NSKE 5%) or 3000 ppm Neem oil @ 3 ml/L."
        ],
        "chemical": [
            "Mancozeb 75% WP @ 2.0 g/L or Tricyclazole 75% WP @ 0.6 g/L (targeted for blast and brown spot).",
            "Hexaconazole 5% EC @ 2 ml/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L."
        ]
    },
    "yellow_deficiency": {
        "cultural": [
            "Check soil drainage and root zone aeration; relieve waterlogged conditions to prevent root asphyxiation.",
            "Incorporate well-decomposed Farmyard Manure (FYM) @ 5 tonnes/acre to enhance nutrient exchange capacity."
        ],
        "biological": [
            "Inoculate soil with Azotobacter / Azospirillum bio-fertilizers @ 2 kg/ha mixed with 100 kg vermicompost.",
            "Foliar application of cold marine seaweed extract (Ascophyllum nodosum) @ 2 ml/L for physiological recovery."
        ],
        "chemical": [
            "Foliar spray of 19-19-19 water-soluble NPK @ 5 g/L in early morning hours.",
            "For interveinal chlorosis: Zinc Sulphate (21% Zn) @ 2.5 g/L + Ferrous Sulphate @ 1 g/L + Lime @ 0.5 g/L."
        ]
    },
    "pest_damage": {
        "cultural": [
            "Install 10-12 yellow and blue sticky traps per acre for early monitoring and mass trapping of sucking pests.",
            "Erect bird perches @ 15-20 per acre to facilitate natural insect predation.",
            "Hand-pick egg masses and gregarious young caterpillars where practical in smallholder plots."
        ],
        "biological": [
            "Spray Bacillus thuringiensis (Bt) kurstaki formulation @ 1.5 g/L in late afternoon.",
            "Release egg parasitoid Trichogramma chilonis @ 50,000 parasitized eggs/ha at 10-day intervals."
        ],
        "chemical": [
            "Neem-based Azadirachtin 10,000 ppm @ 1.5 ml/L as repellent and feeding deterrent.",
            "Targeted spray: Emamectin Benzoate 5% SG @ 0.4 g/L or Chlorantraniliprole 18.5% SC @ 0.3 ml/L if pest population exceeds ETL."
        ]
    },
    "healthy": {
        "cultural": [
            "Conduct weekly field scouting across diagonal transects to monitor leaf collar and whorl health.",
            "Maintain soil moisture at field capacity and follow SAU-prescribed split fertilizer schedules."
        ],
        "biological": [
            "Preventive soil application of Trichoderma viride enriched farm compost at root zone.",
            "Periodic application of Panchagavya (3% foliar spray) to strengthen natural plant immunity."
        ],
        "chemical": [
            "No chemical pesticide application is warranted.",
            "Conserve natural predators including spiders, dragonflies, and ladybird beetles."
        ]
    }
}
_rf = None
_cnn_model = None
_cnn_labels: list[str] = []
_cnn_error: str | None = None
_cnn_attempted = False
_cnn_lock = Lock()


def _train_risk_model():
    rng = np.random.default_rng(42)
    X, y = [], []
    for _ in range(800):
        crop = int(rng.integers(0, 8))
        month = int(rng.integers(1, 13))
        rain = float(rng.uniform(0, 400))
        temp = float(rng.uniform(15, 42))
        humidity = float(rng.uniform(30, 98))
        outbreak = int(rng.integers(0, 2))
        monsoon = 1 if month in (6, 7, 8, 9) else 0
        score = 0
        score += 2 if humidity > 80 else 0
        score += 2 if rain > 180 else 1 if rain > 80 else 0
        score += 1 if monsoon else 0
        score += 2 if outbreak else 0
        score += 1 if temp > 34 else 0
        score += 1 if crop in (0, 2, 3) else 0
        label = 0 if score <= 2 else 1 if score <= 4 else 2
        X.append([crop, month, rain, temp, humidity, outbreak, monsoon])
        y.append(label)
    clf = RandomForestClassifier(n_estimators=80, random_state=42)
    clf.fit(np.array(X), np.array(y))
    return clf


def get_rf():
    global _rf
    if _rf is None:
        _rf = _train_risk_model()
    return _rf


def predict_risk(crop_idx: int, month: int, rain: float, temp: float, humidity: float, outbreak: int):
    """Return a transparent agronomic risk baseline trained on generated rule labels.

    This is a prototype risk baseline, not a field-validated epidemiological model.
    """
    monsoon = 1 if month in (6, 7, 8, 9) else 0
    x = np.array([[crop_idx, month, rain, temp, humidity, outbreak, monsoon]])
    pred = int(get_rf().predict(x)[0])
    proba = get_rf().predict_proba(x)[0]
    labels = ["Low", "Medium", "High"]
    return labels[pred], float(max(proba))


def _softmax(v: np.ndarray) -> np.ndarray:
    e = np.exp(v - np.max(v))
    return e / (e.sum() + 1e-9)


def _load_cnn():
    """Load the optional rice MobileNetV2 model once, without blocking non-ML installs."""
    global _cnn_model, _cnn_labels, _cnn_error, _cnn_attempted
    if _cnn_attempted:
        return _cnn_model
    with _cnn_lock:
        if _cnn_attempted:
            return _cnn_model
        _cnn_attempted = True
        if not CNN_MODEL_PATH.exists() or not CNN_LABELS_PATH.exists():
            _cnn_error = "Rice CNN model or labels file is missing."
            return None
        try:
            import tensorflow as tf
            labels = json.loads(CNN_LABELS_PATH.read_text(encoding="utf-8"))
            if not isinstance(labels, list) or not labels:
                raise ValueError("CNN labels file is invalid")
            _cnn_model = tf.keras.models.load_model(CNN_MODEL_PATH, compile=False)
            _cnn_labels = [str(label) for label in labels]
        except Exception as exc:  # Optional dependency and model compatibility failure.
            _cnn_error = f"CNN unavailable: {type(exc).__name__}: {exc}"
            _cnn_model = None
    return _cnn_model

def cnn_status(load: bool = False) -> dict:
    if load:
        _load_cnn()
    metrics = None
    if CNN_METRICS_PATH.exists():
        try:
            metrics = json.loads(CNN_METRICS_PATH.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            pass
    return {
        "name": "MobileNetV2 rice-leaf CNN",
        "weights_present": CNN_MODEL_PATH.exists(),
        "labels_present": CNN_LABELS_PATH.exists(),
        "loaded": _cnn_model is not None,
        "supported_crop": "rice",
        "metrics": metrics,
        "classes": _cnn_labels if _cnn_labels else (json.loads(CNN_LABELS_PATH.read_text(encoding="utf-8")) if CNN_LABELS_PATH.exists() else []),
        "error": _cnn_error,
    }


def _calculate_icar_ses_severity_and_heatmap(img: Image.Image) -> dict:
    """Calculate foliar severity based on ICAR/IRRI Standard Evaluation System (SES) Grade 0-9
    and generate base64 Explainable AI (XAI) lesion heatmap overlay.
    """
    work_img = img.resize((256, 256)).convert("RGB")
    arr = np.asarray(work_img).astype(np.float32) / 255.0
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]

    # Excess Green (ExG) and vegetation mask
    exg = 2.0 * g - r - b
    brightness = (r + g + b) / 3.0

    # Leaf foliage mask: excludes dark/bright backgrounds
    leaf_mask = (brightness > 0.08) & (brightness < 0.95) & ((exg > -0.08) | (g > b * 0.9))
    total_leaf_pixels = int(np.sum(leaf_mask))
    if total_leaf_pixels < 256:
        leaf_mask = np.ones((256, 256), dtype=bool)
        total_leaf_pixels = 256 * 256

    # Lesion detection: chlorotic yellowing, necrotic browning, dark spots
    yellow_lesion = (r > 0.4) & (g > 0.35) & (b < 0.35) & (r + g > 1.8 * b)
    brown_lesion = (r > g) & (g > b) & (r > 0.25) & (exg < 0.05)
    dark_lesion = (brightness < 0.22) & leaf_mask

    lesion_mask = leaf_mask & (yellow_lesion | brown_lesion | dark_lesion)
    lesion_pixels = int(np.sum(lesion_mask))

    affected_pct = float((lesion_pixels / total_leaf_pixels) * 100.0)
    affected_pct = round(min(100.0, max(0.0, affected_pct)), 1)

    # Standard Evaluation System (SES) Scale for Rice & Foliar Blights (ICAR / IRRI)
    if affected_pct <= 0.2:
        ses_grade = 0
        label = "Healthy / Immune"
        resistance = "Highly Resistant (HR)"
        color_code = "#10b981"
    elif affected_pct < 1.0:
        ses_grade = 1
        label = "Mild / Pinpoint"
        resistance = "Resistant (R)"
        color_code = "#22c55e"
    elif affected_pct <= 5.0:
        ses_grade = 3
        label = "Low"
        resistance = "Moderately Resistant (MR)"
        color_code = "#84cc16"
    elif affected_pct <= 25.0:
        ses_grade = 5
        label = "Moderate"
        resistance = "Moderately Susceptible (MS)"
        color_code = "#f59e0b"
    elif affected_pct <= 50.0:
        ses_grade = 7
        label = "Severe / Spreading"
        resistance = "Susceptible (S)"
        color_code = "#ea580c"
    else:
        ses_grade = 9
        label = "Critical / Destructive"
        resistance = "Highly Susceptible (HS)"
        color_code = "#ef4444"

    # Generate Explainable AI (XAI) Lesion Heatmap Overlay
    orig_uint8 = np.asarray(work_img).copy()
    overlay = orig_uint8.astype(np.float32)

    # Blend lesion pixels with glowing crimson/amber highlight: [240, 45, 10]
    lesion_color = np.array([245, 55, 20], dtype=np.float32)
    alpha = 0.65
    for c in range(3):
        overlay[:, :, c] = np.where(
            lesion_mask,
            overlay[:, :, c] * (1 - alpha) + lesion_color[c] * alpha,
            overlay[:, :, c] * 0.88,
        )

    overlay_uint8 = np.clip(overlay, 0, 255).astype(np.uint8)
    overlay_img = Image.fromarray(overlay_uint8)

    buf = io.BytesIO()
    overlay_img.save(buf, format="JPEG", quality=88)
    heatmap_b64 = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("ascii")

    return {
        "ses_grade": ses_grade,
        "label": label,
        "resistance_category": resistance,
        "affected_area_percent": affected_pct,
        "leaf_pixel_count": total_leaf_pixels,
        "lesion_pixel_count": lesion_pixels,
        "color_code": color_code,
        "standard": "ICAR / IRRI Standard Evaluation System (SES) Scale 0–9",
        "description": f"SES Grade {ses_grade} ({label}): {affected_pct}% foliar area damaged",
        "heatmap_base64": heatmap_b64,
        "basis": "ICAR/IRRI SES-inspired bio-spectral lesion segmentation; not Grad-CAM",
    }


def _cnn_predict(img: Image.Image) -> dict | None:
    model = _load_cnn()
    if model is None:
        return None
    input_shape = model.input_shape
    size = int(input_shape[1] or 224)
    arr = np.asarray(img.resize((size, size))).astype(np.float32)
    probabilities = model.predict(np.expand_dims(arr, axis=0), verbose=0)[0]
    idx = int(np.argmax(probabilities))
    label = _cnn_labels[idx]
    disease_key = CNN_LABEL_TO_DISEASE.get(label, "fungal_blight")
    name = dict(DISEASES[disease_key]["name"])
    name["en"] = f"Rice {label}"
    confidence = float(probabilities[idx])

    top_probabilities = [
        {
            "label": _cnn_labels[i],
            "probability": round(float(probabilities[i]), 4),
            "percentage": round(float(probabilities[i]) * 100, 1),
        }
        for i in np.argsort(probabilities)[::-1]
    ]

    severity = _calculate_icar_ses_severity_and_heatmap(img)
    recommendations_3tier = RECOMMENDATIONS_3TIER.get(disease_key, RECOMMENDATIONS_3TIER["fungal_blight"])

    return {
        "disease_key": disease_key,
        "model_label": label,
        "confidence": round(confidence, 3),
        "top_probabilities": top_probabilities,
        "action": "suggest_treatment" if confidence >= 0.65 else "low_confidence",
        "name": name,
        "advice": DISEASES[disease_key]["advice"],
        "medicines": DISEASES[disease_key]["medicines"],
        "severity": severity,
        "recommendations_3tier": recommendations_3tier,
        "model": {"name": "MobileNetV2 rice-leaf CNN", "mode": "trained_model", "supported_crop": "rice"},
        "disclaimer": {
            "en": "CNN preliminary indication for the three trained rice classes only. Confirm with a plant doctor before treatment.",
            "hi": "यह केवल प्रशिक्षित चावल-वर्गों के लिए AI प्रारंभिक संकेत है। उपचार से पहले विशेषज्ञ से पुष्टि करें।",
            "ta": "இது பயிற்சியளிக்கப்பட்ட நெல் வகைகளுக்கான AI முன் குறிப்பு மட்டுமே. சிகிச்சைக்கு முன் நிபுணரிடம் உறுதிப்படுத்தவும்.",
            "mr": "हा फक्त प्रशिक्षित भात-वर्गांसाठी AI प्राथमिक संकेत आहे. उपचारापूर्वी तज्ज्ञांचा सल्ला घ्या.",
        },
    }


def _fallback_predict(img: Image.Image, crop: str) -> dict:
    arr = np.asarray(img.resize((128, 128))).astype(np.float32) / 255.0
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    green = np.clip(2 * g - r - b, 0, 1)
    yellow = np.clip(r + g - 1.4 * b, 0, 1)
    brown = np.clip(r * 0.9 + g * 0.45 - b * 1.2, 0, 1) * (1 - green)
    dark = np.clip(1 - (r + g + b) / 3, 0, 1)
    feats = np.array([float(green.mean()), float(yellow.mean()), float(brown.mean()), float(dark.mean()), float(((r + g + b) / 3).std())])
    logits = np.array([
        2.2 * feats[0] - 1.4 * feats[2] - 1.1 * feats[1],
        2.6 * feats[2] + 0.8 * feats[4] - 0.4 * feats[0],
        2.1 * feats[3] + 1.2 * feats[1] - 0.3 * feats[0],
        2.8 * feats[1] - 1.5 * feats[0],
        1.6 * feats[4] + 1.1 * feats[3] - 0.5 * feats[0],
    ])
    keys = ["healthy", "fungal_blight", "bacterial_blight", "yellow_deficiency", "pest_damage"]
    probs = _softmax(logits)
    idx = int(np.argmax(probs))
    confidence = float(probs[idx])

    order = np.argsort(probs)[::-1]
    top_probabilities = [
        {
            "label": DISEASES[keys[i]]["name"]["en"],
            "disease_key": keys[i],
            "probability": round(float(probs[i]), 4),
            "percentage": round(float(probs[i]) * 100, 1),
        }
        for i in order
    ]

    severity = _calculate_icar_ses_severity_and_heatmap(img)
    recommendations_3tier = RECOMMENDATIONS_3TIER.get(keys[idx], RECOMMENDATIONS_3TIER["fungal_blight"])

    note = "Rice CNN is unavailable; fallback used." if crop.lower() == "rice" else "Rice CNN supports rice only; fallback used for this crop."
    return {
        "disease_key": keys[idx],
        "confidence": round(confidence, 3),
        "top_probabilities": top_probabilities,
        "features": {"green": round(feats[0], 3), "yellow": round(feats[1], 3), "brown": round(feats[2], 3), "dark": round(feats[3], 3)},
        "action": "low_confidence" if confidence < 0.42 else "suggest_treatment",
        "name": DISEASES[keys[idx]]["name"],
        "advice": DISEASES[keys[idx]]["advice"],
        "medicines": DISEASES[keys[idx]]["medicines"],
        "severity": severity,
        "recommendations_3tier": recommendations_3tier,
        "model": {"name": "Visual feature fallback", "mode": "fallback", "note": note},
        "disclaimer": {
            "en": "AI preliminary indication only. Not a replacement for professional agricultural diagnosis.",
            "hi": "यह केवल एआई प्रारंभिक संकेत है, पेशेवर निदान का विकल्प नहीं।",
            "ta": "இது AI முன் குறிப்பு மட்டும். நிபுணர் நோயறிதலை மாற்றாது.",
            "mr": "हे फक्त AI प्राथमिक संकेत आहे, व्यावसायिक निदानाचा पर्याय नाही.",
        },
    }


def analyze_leaf(image_bytes: bytes, crop: str = "") -> dict:
    crop_name = crop.lower().strip()
    if crop_name not in SUPPORTED_DISEASE_CROPS:
        raise UnsupportedDiseaseCropError(
            "Disease image detection is currently validated for rice leaves only. "
            "Please upload a rice leaf image or consult a plant doctor."
        )
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    cnn_result = _cnn_predict(img)
    if cnn_result is not None:
        return cnn_result
    raise DiseaseModelUnavailableError(
        "Rice disease model is not installed or could not be loaded. Disease diagnosis was not run."
    )
    # Keep the scanner useful when optional CNN weights are not installed.
    # This is explicitly a low-confidence visual screen, not a CNN diagnosis.
    result = _fallback_predict(img, crop_name)
    result["action"] = "low_confidence"
    result["model"] = {
        "name": "Visual symptom screen",
        "mode": "fallback",
        "supported_crop": "rice",
        "note": "Rice CNN weights are not installed. This is a visual screening result, not a trained CNN diagnosis.",
    }
    result["disclaimer"] = {
        "en": "Visual symptom screening only. The trained rice CNN is unavailable on this server; confirm with a plant doctor before treatment.",
        "hi": "यह केवल दृश्य लक्षण जांच है। उपचार से पहले कृषि विशेषज्ञ से पुष्टि करें।",
        "ta": "இது காட்சி அறிகுறி சோதனை மட்டுமே. சிகிச்சைக்கு முன் வேளாண் நிபுணரிடம் உறுதிப்படுத்தவும்.",
        "mr": "ही केवळ दृश्य लक्षण तपासणी आहे. उपचारापूर्वी कृषी तज्ज्ञांचा सल्ला घ्या.",
    }
    return result


def crop_simulation(n: float, p: float, k: float, rain: float, temp: float) -> dict:
    score = 50 + min(n, 80) * 0.15 + min(p, 60) * 0.12 + min(k, 60) * 0.12
    if 18 <= temp <= 32:
        score += 8
    if 60 <= rain <= 220:
        score += 10
    elif rain < 30:
        score -= 12
    score = max(5, min(96, score))
    if n < 20:
        rec = ["pulses", "groundnut"]
    elif rain > 180:
        rec = ["rice", "sugarcane"]
    elif temp > 34:
        rec = ["cotton", "sorghum"]
    else:
        rec = ["wheat", "maize", "soybean"]
    return {"yield_index": round(score, 1), "suggested_crops": rec, "note": {"en": "Simulation uses NPK + climate ranges. Field soil testing is still recommended.", "hi": "सिमुलेशन NPK और जलवायु पर आधारित है। खेत मिट्टी परीक्षण फिर भी आवश्यक है।", "ta": "NPK மற்றும் காலநிலை அடிப்படையிலான உருவகமாக்கம். மண் பரிசோதனை இன்னும் தேவை.", "mr": "हे NPK व हवामानावर आधारित सिम्युलेशन आहे. शेतातील माती चाचणी आवश्यक आहे."}}
