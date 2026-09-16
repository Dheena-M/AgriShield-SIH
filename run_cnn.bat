@echo off
cd /d "%~dp0"
if not exist ".venv-ml\Scripts\python.exe" (
  echo Missing .venv-ml. Create it, then install requirements-ml-server.txt.
  exit /b 1
)
.venv-ml\Scripts\python.exe -c "import fastapi, uvicorn, tensorflow" >nul 2>&1
if errorlevel 1 (
  echo Install the CNN server dependencies once with:
  echo .\.venv-ml\Scripts\python.exe -m pip install -r requirements-ml-server.txt
  exit /b 1
)
echo Starting AgriShield with the MobileNetV2 rice CNN...
.venv-ml\Scripts\python.exe -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000