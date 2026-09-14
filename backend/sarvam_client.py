from __future__ import annotations

import os
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env", override=True)

_client = None


def get_client():
    global _client
    if _client is not None:
        return _client
    api_key = os.getenv("SARVAM_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("SARVAM_API_KEY is not configured in .env or environment")
    try:
        from sarvamai import SarvamAI
        _client = SarvamAI(api_subscription_key=api_key)
        return _client
    except Exception as exc:
        raise RuntimeError(f"Failed to initialize SarvamAI client: {exc}") from exc


LANGUAGES = {
    "en": "en-IN",
    "bn": "bn-IN",
    "gu": "gu-IN",
    "hi": "hi-IN",
    "kn": "kn-IN",
    "ml": "ml-IN",
    "mr": "mr-IN",
    "od": "od-IN",
    "pa": "pa-IN",
    "ta": "ta-IN",
    "te": "te-IN",
    "as": "as-IN",
    "brx": "brx-IN",
    "doi": "doi-IN",
    "kok": "kok-IN",
    "ks": "ks-IN",
    "mai": "mai-IN",
    "mni": "mni-IN",
    "ne": "ne-IN",
    "sa": "sa-IN",
    "sat": "sat-IN",
    "sd": "sd-IN",
    "ur": "ur-IN",
}


def translate_text(
    text: str,
    source_language: str = "en-IN",
    target_language: str = "ta-IN"
):
    """Translate text between supported Indian languages."""

    if source_language == "as-IN" or target_language == "as-IN":
        model = "sarvam-translate:v1"
    else:
        model = "mayura:v1"

    client = get_client()
    response = client.text.translate(
        input=text,
        source_language_code=source_language,
        target_language_code=target_language,
        model=model,
    )

    return getattr(response, "translated_text", str(response))