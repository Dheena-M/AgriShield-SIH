"""Leaf vs non-leaf gate that runs before disease prediction.

Uses only NumPy and Pillow (already in requirements). A human face, person,
animal, vehicle, building, document, food, or random object must not reach
the disease model — even if that model would invent a class.
"""

from __future__ import annotations

import io

import numpy as np
from PIL import Image, ImageOps, UnidentifiedImageError

INVALID_LEAF_MESSAGE = (
    "Invalid Image. Please upload a clear crop/plant leaf image for disease detection."
)

_MIN_SIDE = 48
_MAX_BYTES = 6 * 1024 * 1024


def evaluate_leaf_image(image_bytes: bytes) -> dict:
    """Return {accepted, reason, metrics}. Never runs the disease model."""
    if not image_bytes:
        return _reject("empty")
    if len(image_bytes) > _MAX_BYTES:
        return _reject("too_large")

    try:
        with Image.open(io.BytesIO(image_bytes)) as raw:
            if (raw.format or "").upper() not in {"JPEG", "PNG", "WEBP", "BMP"}:
                return _reject("unsupported_format")
            raw.load()
            raw = ImageOps.exif_transpose(raw)
            img = raw.convert("RGB")
            width, height = img.size
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError):
        return _reject("undecodable")

    if width < _MIN_SIDE or height < _MIN_SIDE:
        return _reject("too_small")
    if width * height < 80 * 80:
        return _reject("too_small")

    work = img.resize((256, 256), Image.Resampling.BILINEAR)
    arr = np.asarray(work, dtype=np.float32) / 255.0
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    gray = 0.299 * r + 0.587 * g + 0.114 * b

    brightness = float(gray.mean())
    contrast = float(gray.std())
    if brightness < 0.08:
        return _reject("too_dark")
    if brightness > 0.97 and contrast < 0.04:
        return _reject("blank")
    if contrast < 0.025:
        return _reject("empty_or_uniform")

    sharpness = _gradient_energy(gray)
    if sharpness < 0.00045:
        return _reject("blurry")

    vegetation = _vegetation_mask(r, g, b)
    yellow = _chlorosis_mask(r, g, b)
    skin = _skin_mask(r, g, b)
    brown = _brown_leaf_mask(r, g, b) & ~skin

    veg_ratio = float(vegetation.mean())
    yellow_ratio = float(yellow.mean())
    brown_ratio = float(brown.mean())
    skin_ratio = float(skin.mean())
    leaf_cover = veg_ratio + 0.9 * yellow_ratio + 0.55 * brown_ratio

    cy0, cy1, cx0, cx1 = 48, 208, 48, 208
    center_veg = float(vegetation[cy0:cy1, cx0:cx1].mean())
    center_yellow = float(yellow[cy0:cy1, cx0:cx1].mean())
    center_brown = float(brown[cy0:cy1, cx0:cx1].mean())
    center_skin = float(skin[cy0:cy1, cx0:cx1].mean())
    center_leaf = center_veg + 0.9 * center_yellow + 0.55 * center_brown

    metrics = {
        "brightness": round(brightness, 4),
        "contrast": round(contrast, 4),
        "sharpness": round(sharpness, 6),
        "veg_ratio": round(veg_ratio, 4),
        "yellow_ratio": round(yellow_ratio, 4),
        "brown_ratio": round(brown_ratio, 4),
        "skin_ratio": round(skin_ratio, 4),
        "center_veg": round(center_veg, 4),
        "center_skin": round(center_skin, 4),
        "center_leaf": round(center_leaf, 4),
        "leaf_cover": round(leaf_cover, 4),
    }

    # Face / person: skin in the centre beats plant tissue, even with a green backdrop.
    if center_skin >= 0.12 and center_skin >= center_leaf:
        return _reject("face_or_person", metrics)
    if center_skin >= 0.18:
        return _reject("face_or_person", metrics)
    if skin_ratio >= 0.16 and leaf_cover < 0.40:
        return _reject("face_or_person", metrics)
    if skin_ratio >= 0.22:
        return _reject("face_or_person", metrics)

    if leaf_cover < 0.12 or center_leaf < 0.10:
        return _reject("non_leaf", metrics)
    if veg_ratio >= 0.12 and center_veg >= 0.10:
        return _accept(metrics)
    if yellow_ratio >= 0.10 and leaf_cover >= 0.16:
        return _accept(metrics)
    if brown_ratio >= 0.14 and center_leaf >= 0.12 and skin_ratio < 0.14:
        return _accept(metrics)
    if leaf_cover >= 0.20 and center_leaf >= 0.16 and skin_ratio < center_leaf:
        return _accept(metrics)

    return _reject("non_leaf", metrics)


def require_leaf_image(image_bytes: bytes) -> dict:
    """Raise ValueError(INVALID_LEAF_MESSAGE) when the photo is not a leaf."""
    result = evaluate_leaf_image(image_bytes)
    if not result["accepted"]:
        raise ValueError(INVALID_LEAF_MESSAGE)
    return result


def _accept(metrics: dict) -> dict:
    return {"accepted": True, "reason": "leaf", "metrics": metrics}


def _reject(reason: str, metrics: dict | None = None) -> dict:
    return {"accepted": False, "reason": reason, "metrics": metrics or {}}


def _gradient_energy(gray: np.ndarray) -> float:
    dx = np.diff(gray, axis=1)
    dy = np.diff(gray, axis=0)
    return float(dx.var() + dy.var())


def _vegetation_mask(r: np.ndarray, g: np.ndarray, b: np.ndarray) -> np.ndarray:
    exg = 2.0 * g - r - b
    return (exg > 0.06) & (g > r * 0.88) & (g > b * 0.82) & (g > 0.12)


def _chlorosis_mask(r: np.ndarray, g: np.ndarray, b: np.ndarray) -> np.ndarray:
    return (r > 0.32) & (g > 0.32) & (b < 0.38) & ((r + g) > 1.55 * (b + 0.05)) & (g >= r * 0.62)


def _brown_leaf_mask(r: np.ndarray, g: np.ndarray, b: np.ndarray) -> np.ndarray:
    """Necrotic / blighted tissue that is not human skin."""
    return (r > 0.18) & (g > 0.12) & (r >= g * 0.92) & (g > b) & ((r - g) < 0.28) & (b < 0.38) & ((g - b) > 0.04)


def _skin_mask(r: np.ndarray, g: np.ndarray, b: np.ndarray) -> np.ndarray:
    """YCbCr skin ellipsoid covering a wide range of human skin tones."""
    r8, g8, b8 = r * 255.0, g * 255.0, b * 255.0
    y = 0.299 * r8 + 0.587 * g8 + 0.114 * b8
    cb = 128.0 - 0.168736 * r8 - 0.331264 * g8 + 0.5 * b8
    cr = 128.0 + 0.5 * r8 - 0.418688 * g8 - 0.081312 * b8
    return (
        (y > 40)
        & (y < 245)
        & (cb > 77)
        & (cb < 140)
        & (cr > 125)
        & (cr < 185)
        & (r > g)
        & (g > b * 0.75)
        & ((r - g) > 0.04)
    )
