@echo off
cd /d "%~dp0"
<<<<<<< HEAD
wscript.exe "%~dp0Open-AgriShield.vbs"
=======
if exist ".venv-ml\Scripts\python.exe" (
  echo Starting AgriShield using .venv-ml environment...
  .venv-ml\Scripts\python.exe -m uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
  exit /b
)
if not exist ".venv\Scripts\python.exe" python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe -m uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
>>>>>>> de4caf6dcc9f22fb3a07c07c376f709c014c135a
