from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv


# ============================================================
# AgriShield AI - Sarvam AI Translation Client
# ============================================================

# Project root: D:\SIH agri
ROOT = Path(__file__).resolve().parent.parent

# Load D:\SIH agri\.env
load_dotenv(ROOT / ".env", override=True)


# Cached Sarvam client
_client = None


# ============================================================
# Supported Indian Languages
# ============================================================

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


# ============================================================
# Get Sarvam AI Client
# ============================================================

def get_client():
    global _client

    # Reuse existing client
    if _client is not None:
        return _client

    # Read API key from .env
    api_key = os.getenv("SARVAM_API_KEY", "").strip()

    if not api_key:
        raise RuntimeError(
            "SARVAM_API_KEY is not configured. "
            "Please add SARVAM_API_KEY to D:\\SIH agri\\.env"
        )

    try:
        from sarvamai import SarvamAI

        _client = SarvamAI(
            api_subscription_key=api_key
        )

        return _client

    except ImportError as exc:
        raise RuntimeError(
            "SarvamAI package is not installed. "
            "Run: python -m pip install --upgrade sarvamai"
        ) from exc

    except Exception as exc:
        raise RuntimeError(
            f"Failed to initialize SarvamAI client: {exc}"
        ) from exc


# ============================================================
# Normalize Language
# ============================================================

def normalize_language(language: str) -> str:
    """
    Accepts both:

        en
        en-IN
        EN
        EN-IN

    and returns the official Sarvam format:

        en-IN
    """

    if not isinstance(language, str):
        raise ValueError("Language must be a string.")

    language = language.strip()

    if not language:
        raise ValueError("Language cannot be empty.")

    # Check full language code
    for code in LANGUAGES.values():
        if language.lower() == code.lower():
            return code

    # Check short language code
    short_code = language.lower()

    if short_code in LANGUAGES:
        return LANGUAGES[short_code]

    raise ValueError(
        f"Unsupported language: {language}. "
        f"Supported languages: {', '.join(LANGUAGES.keys())}"
    )


# ============================================================
# Translate Text
# ============================================================

def translate_text(
    text: str,
    source_language: str = "en-IN",
    target_language: str = "ta-IN",
) -> str:
    """
    Translate text between supported Indian languages.

    Example:

        translate_text(
            "Rice disease detected",
            "en-IN",
            "ta-IN"
        )
    """

    # Empty text
    if not text or not text.strip():
        return ""

    # Normalize languages
    source_language = normalize_language(source_language)
    target_language = normalize_language(target_language)

    # No translation required
    if source_language == target_language:
        return text

    # Select Sarvam translation model
    if (
        source_language == "as-IN"
        or target_language == "as-IN"
    ):
        model = "sarvam-translate:v1"
    else:
        model = "mayura:v1"

    # Get API client
    client = get_client()

    try:
        # Call Sarvam Translation API
        response = client.text.translate(
            input=text.strip(),
            source_language_code=source_language,
            target_language_code=target_language,
            model=model,
        )

        # Return translated text
        translated_text = getattr(
            response,
            "translated_text",
            None
        )

        if translated_text:
            return translated_text.strip()

        # Fallback
        return str(response)

    except Exception as exc:
        raise RuntimeError(
            f"Sarvam translation failed "
            f"({source_language} -> {target_language}): {exc}"
        ) from exc


# ============================================================
# Simple Test Function
# ============================================================

if __name__ == "__main__":

    print("=" * 60)
    print("AgriShield AI - Sarvam Translation Test")
    print("=" * 60)

    try:
        result = translate_text(
            "Rice disease detected",
            "en-IN",
            "ta-IN",
        )

        print("English : Rice disease detected")
        print("Tamil   :", result)
        print("=" * 60)
        print("Translation SUCCESS")
        print("=" * 60)

    except Exception as exc:
        print("=" * 60)
        print("Translation FAILED")
        print("=" * 60)
        print(exc)