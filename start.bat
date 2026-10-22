@echo off
title ParakeetAI - Local Launcher
color 0A
cls
echo =====================================================================
echo       PARAKEET AI - 100% FREE FOREVER (ZERO COST / PRICELESS)
echo =====================================================================
echo.
echo  [+] Status: Unlimited Free Access Granted
echo  [+] Project Directory: %~dp0
echo  [+] Checking Node & NPM...
echo.

cd /d "%~dp0"

where npm.cmd >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] ERROR: Node.js / NPM is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b
)

if not exist "node_modules\" (
    echo [*] Installing dependencies...
    call npm.cmd install
)

echo [*] Launching ParakeetAI Development Server...
echo [*] Opening your browser at http://localhost:3000 ...
echo.
echo =====================================================================
echo  TIPS:
echo   - Press Ctrl+Space inside the app for Undetectable Stealth Mode!
echo   - Click 'Launch Assistant' to test real-time speech and answers.
echo   - Click 'Snap LeetCode / Screen' to test visual code problem solving.
echo =====================================================================
echo.

start "" "http://localhost:3000"
call npm.cmd run dev

pause
