"""Optional MongoDB document store for AgriShield prediction history.

SQLite continues to handle the transactional workflow (accounts, appointments and
orders). MongoDB stores flexible scan documents and model metadata when enabled.
"""
from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any

_client = None
_database = None
_error: str | None = None
_initialized = False


def _settings() -> tuple[str, str]:
    return os.environ.get("MONGODB_URI", "").strip(), os.environ.get("MONGODB_DATABASE", "agrishield").strip() or "agrishield"


def initialize_mongo() -> bool:
    """Connect lazily and never prevent the local demo from starting."""
    global _client, _database, _error, _initialized
    if _initialized:
        return _database is not None
    _initialized = True
    uri, database_name = _settings()
    if not uri:
        _error = "MongoDB is disabled. Set MONGODB_URI to enable it."
        return False
    try:
        from pymongo import ASCENDING, DESCENDING, MongoClient

        _client = MongoClient(uri, serverSelectionTimeoutMS=3000, connectTimeoutMS=3000, appname="AgriShield")
        _client.admin.command("ping")
        _database = _client[database_name]
        _database.predictions.create_index([("user_id", ASCENDING), ("created_at", DESCENDING)])
        _database.predictions.create_index([("crop", ASCENDING), ("created_at", DESCENDING)])
        _database.model_events.create_index([("created_at", DESCENDING)])
        _error = None
        return True
    except Exception as exc:  # MongoDB is optional in local/demo mode.
        _client = None
        _database = None
        _error = f"MongoDB unavailable: {type(exc).__name__}: {exc}"
        return False


def mongo_status() -> dict[str, Any]:
    uri, database_name = _settings()
    return {
        "configured": bool(uri),
        "connected": _database is not None,
        "database": database_name if uri else None,
        "error": _error,
    }


def record_prediction(document: dict[str, Any]) -> bool:
    """Persist a non-image prediction document. Upload binaries remain on disk."""
    if not initialize_mongo():
        return False
    try:
        safe_document = {**document, "created_at": datetime.now(timezone.utc)}
        _database.predictions.insert_one(safe_document)
        return True
    except Exception as exc:
        global _error
        _error = f"MongoDB write failed: {type(exc).__name__}: {exc}"
        return False


def record_model_event(event: dict[str, Any]) -> bool:
    if not initialize_mongo():
        return False
    try:
        _database.model_events.insert_one({**event, "created_at": datetime.now(timezone.utc)})
        return True
    except Exception as exc:
        global _error
        _error = f"MongoDB write failed: {type(exc).__name__}: {exc}"
        return False