"""Optional crop-identification model used after the leaf validation gate.

The model is intentionally opt-in: predictions are returned only when real
weights and labels are present. No crop is guessed from color heuristics.
"""

from __future__ import annotations

import io
import json
from pathlib import Path
from threading import Lock

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = ROOT / "models" / "crop_leaf_classifier.keras"
LABELS_PATH = ROOT / "models" / "crop_leaf_classifier.labels.json"
MIN_CONFIDENCE = 0.70

_model = None
_labels: list[str] = []
_error: str | None = None
_attempted = False
_lock = Lock()


class CropClassifierUnavailableError(RuntimeError):
    """Raised when crop-classifier weights or labels are unavailable."""


class CropIdentificationUncertainError(ValueError):
    """Raised when the crop classifier cannot make a safe identification."""


def _load_model():
    global _model, _labels, _error, _attempted
    if _attempted:
        return _model
    with _lock:
        if _attempted:
            return _model
        _attempted = True
        if not MODEL_PATH.exists() or not LABELS_PATH.exists():
            _error = "Crop classifier weights or labels are missing."
            return None
        try:
            import tensorflow as tf

            labels = json.loads(LABELS_PATH.read_text(encoding="utf-8"))
            if not isinstance(labels, list) or not labels:
                raise ValueError("Crop classifier labels must be a non-empty list.")
            _labels = [str(label).strip().lower() for label in labels]
            _model = tf.keras.models.load_model(MODEL_PATH, compile=False)
        except Exception as exc:
            _error = f"Crop classifier unavailable: {type(exc).__name__}: {exc}"
            _model = None
        return _model


def identify_crop(image_bytes: bytes) -> dict:
    model = _load_model()
    if model is None:
        raise CropClassifierUnavailableError(
            "Crop identification is unavailable. Add a trained crop classifier or consult a plant doctor."
        )
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    size = int(model.input_shape[1] or 224)
    array = np.asarray(image.resize((size, size)), dtype=np.float32) / 255.0
    probabilities = np.asarray(model.predict(np.expand_dims(array, axis=0), verbose=0)[0])
    index = int(np.argmax(probabilities))
    confidence = float(probabilities[index])
    crop = _labels[index] if index < len(_labels) else ""
    result = {
        "crop": crop if confidence >= MIN_CONFIDENCE else None,
        "confidence": round(confidence, 4),
        "accepted": confidence >= MIN_CONFIDENCE and bool(crop),
        "threshold": MIN_CONFIDENCE,
    }
    if not result["accepted"]:
        raise CropIdentificationUncertainError(
            "Crop could not be identified confidently. Please upload a clearer leaf image."
        )
    return result


def crop_classifier_status(load: bool = False) -> dict:
    if load:
        _load_model()
    return {
        "name": "MobileNetV2 crop leaf classifier",
        "weights_present": MODEL_PATH.exists(),
        "labels_present": LABELS_PATH.exists(),
        "loaded": _model is not None,
        "classes": _labels,
        "threshold": MIN_CONFIDENCE,
        "error": _error,
    }
