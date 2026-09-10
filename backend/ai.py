"""Disease analysis and environmental risk helpers for AgriShield."""

from __future__ import annotations

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
CNN_LABEL_TO_DISEASE = {
    "Bacterial leaf blight": "bacterial_blight",
    "Brown spot": "fungal_blight",
    "Leaf smut": "fungal_blight",
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
    return {
        "name": "MobileNetV2 rice-leaf CNN",
        "weights_present": CNN_MODEL_PATH.exists(),
        "labels_present": CNN_LABELS_PATH.exists(),
        "loaded": _cnn_model is not None,
        "supported_crop": "rice",
        "classes": _cnn_labels if _cnn_labels else (json.loads(CNN_LABELS_PATH.read_text(encoding="utf-8")) if CNN_LABELS_PATH.exists() else []),
        "error": _cnn_error,
    }


def _visual_severity(img: Image.Image) -> dict:
    """Colour-based affected-area estimate used only as an advisory visual cue."""
    arr = np.asarray(img.resize((128, 128))).astype(np.float32) / 255.0
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    green = np.clip(2 * g - r - b, 0, 1)
    yellow = np.clip(r + g - 1.4 * b, 0, 1)
    brown = np.clip(r * 0.9 + g * 0.45 - b * 1.2, 0, 1) * (1 - green)
    dark = np.clip(1 - (r + g + b) / 3, 0, 1)
    affected = float(np.clip((brown * 1.5 + yellow * 0.7 + dark * 0.35).mean() * 100, 0, 100))
    label = "Low" if affected < 8 else "Moderate" if affected < 22 else "High"
    return {"label": label, "affected_area_percent": round(affected, 1), "basis": "visual colour estimate - confirm in field"}


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
    return {
        "disease_key": disease_key,
        "model_label": label,
        "confidence": round(confidence, 3),
        "action": "suggest_treatment" if confidence >= 0.65 else "low_confidence",
        "name": name,
        "advice": DISEASES[disease_key]["advice"],
        "medicines": DISEASES[disease_key]["medicines"],
        "severity": _visual_severity(img),
        "model": {"name": "MobileNetV2 rice-leaf CNN", "mode": "trained_model", "supported_crop": "rice"},
        "disclaimer": {"en": "CNN preliminary indication for the three trained rice classes only. Confirm with a plant doctor before treatment.", "hi": "यह केवल प्रशिक्षित चावल-वर्गों के लिए AI प्रारंभिक संकेत है। उपचार से पहले विशेषज्ञ से पुष्टि करें।", "ta": "இது பயிற்சியளிக்கப்பட்ட நெல் வகைகளுக்கான AI முன் குறிப்பு மட்டுமே. சிகிச்சைக்கு முன் நிபுணரிடம் உறுதிப்படுத்தவும்.", "mr": "हा फक्त प्रशिक्षित भात-वर्गांसाठी AI प्राथमिक संकेत आहे. उपचारापूर्वी तज्ज्ञांचा सल्ला घ्या."},
    }


def _fallback_predict(img: Image.Image, crop: str) -> dict:
    arr = np.asarray(img.resize((128, 128))).astype(np.float32) / 255.0
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    green = np.clip(2 * g - r - b, 0, 1)
    yellow = np.clip(r + g - 1.4 * b, 0, 1)
    brown = np.clip(r * 0.9 + g * 0.45 - b * 1.2, 0, 1) * (1 - green)
    dark = np.clip(1 - (r + g + b) / 3, 0, 1)
    feats = np.array([float(green.mean()), float(yellow.mean()), float(brown.mean()), float(dark.mean()), float(((r + g + b) / 3).std())])
    logits = np.array([2.2 * feats[0] - 1.4 * feats[2] - 1.1 * feats[1], 2.6 * feats[2] + 0.8 * feats[4] - 0.4 * feats[0], 2.1 * feats[3] + 1.2 * feats[1] - 0.3 * feats[0], 2.8 * feats[1] - 1.5 * feats[0], 1.6 * feats[4] + 1.1 * feats[3] - 0.5 * feats[0]])
    keys = ["healthy", "fungal_blight", "bacterial_blight", "yellow_deficiency", "pest_damage"]
    probs = _softmax(logits)
    idx = int(np.argmax(probs))
    confidence = float(probs[idx])
    note = "Rice CNN is unavailable; fallback used." if crop.lower() == "rice" else "Rice CNN supports rice only; fallback used for this crop."
    return {
        "disease_key": keys[idx], "confidence": round(confidence, 3), "features": {"green": round(feats[0], 3), "yellow": round(feats[1], 3), "brown": round(feats[2], 3), "dark": round(feats[3], 3)},
        "action": "low_confidence" if confidence < 0.42 else "suggest_treatment", "name": DISEASES[keys[idx]]["name"], "advice": DISEASES[keys[idx]]["advice"], "medicines": DISEASES[keys[idx]]["medicines"], "severity": _visual_severity(img),
        "model": {"name": "Visual feature fallback", "mode": "fallback", "note": note},
        "disclaimer": {"en": "AI preliminary indication only. Not a replacement for professional agricultural diagnosis.", "hi": "यह केवल एआई प्रारंभिक संकेत है, पेशेवर निदान का विकल्प नहीं।", "ta": "இது AI முன் குறிப்பு மட்டும். நிபுணர் நோயறிதலை மாற்றாது.", "mr": "हे फक्त AI प्राथमिक संकेत आहे, व्यावसायिक निदानाचा पर्याय नाही."},
    }


def analyze_leaf(image_bytes: bytes, crop: str = "") -> dict:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    if crop.lower().strip() == "rice":
        cnn_result = _cnn_predict(img)
        if cnn_result is not None:
            return cnn_result
    return _fallback_predict(img, crop)


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