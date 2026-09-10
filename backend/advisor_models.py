"""Explainable, local decision-support models used by the AgriShield farm tools.

These scores are educational estimates, not laboratory or field prescriptions.
"""

from __future__ import annotations

import json
from pathlib import Path


def _clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def soil_health(n: float, p: float, k: float, ph: float) -> dict:
    """Score NPK balance and pH suitability against broad field ranges."""
    n_score = 100 - min(abs(n - 50) * 1.25, 100)
    p_score = 100 - min(abs(p - 30) * 2.0, 100)
    k_score = 100 - min(abs(k - 35) * 1.7, 100)
    ph_score = 100 - min(abs(ph - 6.8) * 38, 100)
    score = round(_clamp(0.30 * n_score + 0.25 * p_score + 0.25 * k_score + 0.20 * ph_score, 0, 100))
    status = "Good" if score >= 75 else "Needs attention" if score >= 50 else "Poor"
    actions = []
    if n < 35:
        actions.append("Nitrogen is low: use compost, legumes, or a soil-test-approved nitrogen source.")
    if p < 20:
        actions.append("Phosphorus is low: consider compost or a soil-test-approved phosphorus source.")
    if k < 25:
        actions.append("Potassium is low: add organic matter or a soil-test-approved potassium source.")
    if ph < 5.8:
        actions.append("Soil is acidic: confirm with a lab test before applying agricultural lime.")
    elif ph > 7.8:
        actions.append("Soil is alkaline: add organic matter and seek local soil-test advice before amendments.")
    if not actions:
        actions.append("NPK and pH are broadly balanced. Keep monitoring with a laboratory soil test.")
    return {"score": score, "status": status, "actions": actions}


_DATASET_PATH = Path(__file__).with_name("data") / "crop_profiles.json"


def crop_profiles() -> list[dict]:
    """Load the bundled demo crop-profile dataset used by recommendations."""
    return json.loads(_DATASET_PATH.read_text(encoding="utf-8"))


def crop_recommendations(n: float, p: float, k: float, ph: float, temp: float, humidity: float, rainfall: float, soil_type: str) -> dict:
    """Rank crop profiles by closeness to supplied soil and season conditions."""
    values = (n, p, k, ph, temp, humidity, rainfall)
    scales = (60, 45, 50, 2.0, 14, 45, 1100)
    ranked = []
    for profile in crop_profiles():
        targets = tuple(profile[key] for key in ("n", "p", "k", "ph", "temp", "humidity", "rainfall"))
        target_soil = profile["soil_type"]
        distance = sum(abs(value - target) / scale for value, target, scale in zip(values, targets, scales))
        if soil_type.lower() != target_soil.lower():
            distance += 0.35
        score = round(_clamp(100 - distance * 15, 15, 98))
        ranked.append({"crop": profile["crop"], "season": profile["season"], "suitability": score, "reason": f"Matches the {target_soil.lower()}-soil and seasonal profile most closely."})
    ranked.sort(key=lambda row: row["suitability"], reverse=True)
    return {"recommendations": ranked[:3], "disclaimer": "Suitability is a planning score. Confirm variety, water availability, local market demand, and soil-test results before planting."}


def yield_estimate(crop: str, n: float, p: float, k: float, ph: float, temp: float, rainfall: float, area: float) -> dict:
    """A transparent potential-yield estimate based on nutrition and climate fit."""
    base_yields = {"rice": 4.5, "maize": 5.5, "tomato": 28.0, "groundnut": 2.2, "millet": 2.4, "cotton": 2.0}
    base = base_yields.get(crop.lower(), 3.0)
    nutrient = _clamp((min(n, 60) / 60 + min(p, 40) / 40 + min(k, 45) / 45) / 3, 0.25, 1.0)
    ph_fit = _clamp(1 - abs(ph - 6.7) / 4, 0.45, 1.0)
    temp_fit = _clamp(1 - abs(temp - 27) / 18, 0.45, 1.0)
    rain_fit = _clamp(1 - abs(rainfall - 700) / 1200, 0.40, 1.0)
    per_hectare = round(base * (0.45 + 0.55 * nutrient * ph_fit * temp_fit * rain_fit), 2)
    risk_score = round((1 - min(nutrient, ph_fit, temp_fit, rain_fit)) * 100)
    risk = "High" if risk_score >= 45 else "Medium" if risk_score >= 22 else "Low"
    return {"per_hectare_tonnes": per_hectare, "total_tonnes": round(per_hectare * max(area, 0), 2), "risk": risk, "risk_score": risk_score, "disclaimer": "Estimated yield is not a guarantee; pests, variety, irrigation, and field management can materially change results."}
