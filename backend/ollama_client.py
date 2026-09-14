"""Local Ollama client for AgriShield AI.

Queries the local Qwen2.5 3B model (or any configured model) for agronomic
advice, with automatic fallback to curated knowledge if Ollama is paused.
"""

from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from typing import Any

OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://127.0.0.1:11434").rstrip("/")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "qwen2.5:3b")

SYSTEM_PROMPT = (
    "You are AgriShield AI, an expert agricultural advisor for Indian farmers. "
    "Give concise, practical crop management guidance in 2-3 sentences. "
    "Include organic or approved chemical spray recommendations with safety precautions. "
    "Respond in the requested language."
)

LANGUAGE_NAMES = {
    "en": "English",
    "hi": "Hindi (हिन्दी)",
    "ta": "Tamil (தமிழ்)",
    "mr": "Marathi (मराठी)",
}


def query_ollama(
    prompt: str,
    language: str = "en",
    crop_context: str = "",
    timeout: float = 25.0,
) -> dict[str, Any]:
    """Query local Ollama Qwen2.5 3B model for agronomic response."""
    lang_instruction = f"Reply in {LANGUAGE_NAMES.get(language, 'English')}."
    full_prompt = prompt.strip()
    if crop_context:
        full_prompt = f"[Crop: {crop_context}] {full_prompt}"
    full_prompt = f"{full_prompt}\n{lang_instruction}"

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": full_prompt,
        "system": SYSTEM_PROMPT,
        "stream": False,
        "options": {
            "temperature": 0.3,
            "num_predict": 85,
            "top_p": 0.85,
        },
    }

    url = f"{OLLAMA_BASE_URL}/api/generate"
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )

    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            answer = data.get("response", "").strip()
            if answer:
                return {
                    "answer": answer,
                    "model": OLLAMA_MODEL,
                    "source": "ollama_qwen",
                    "success": True,
                }
    except (urllib.error.URLError, TimeoutError, Exception) as exc:
        return {
            "answer": "",
            "model": OLLAMA_MODEL,
            "source": "fallback",
            "success": False,
            "error": str(exc),
        }

    return {"answer": "", "model": OLLAMA_MODEL, "source": "fallback", "success": False}
