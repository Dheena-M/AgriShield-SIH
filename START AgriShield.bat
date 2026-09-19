@echo off
REM Launch AgriShield from the real project root (parent of this folder layout).
cd /d "%~dp0"
if exist "%~dp0Open-AgriShield.vbs" (
  wscript.exe "%~dp0Open-AgriShield.vbs"
) else if exist "%~dp0AgriShield-SIH-main\Open-AgriShield.vbs" (
  wscript.exe "%~dp0AgriShield-SIH-main\Open-AgriShield.vbs"
) else (
  echo AgriShield launcher not found.
  pause
)
