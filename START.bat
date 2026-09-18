@echo off
cd /d "%~dp0"
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":8000 .*LISTENING"') do taskkill /PID %%P /F >nul 2>&1
timeout /t 1 /nobreak >nul
wscript.exe "%~dp0Open-AgriShield.vbs"
