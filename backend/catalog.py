"""Feature and dataset metadata for transparent AgriShield decision support."""

from __future__ import annotations

import json
from pathlib import Path

_CATALOG_PATH = Path(__file__).with_name("data") / "feature_catalog.json"


def feature_catalog() -> dict:
    catalog = json.loads(_CATALOG_PATH.read_text(encoding="utf-8"))
    if not catalog.get("features"):
        raise ValueError("Feature catalog is empty")
    return catalog
