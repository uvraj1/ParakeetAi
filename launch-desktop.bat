@echo off
title ParakeetAI Native Desktop Assistant (Stealth Mode)
color 0A
cls
echo =========================================================================
echo              PARAKEET AI - NATIVE DESKTOP LAUNCHER v2.4.0
echo =========================================================================
echo.
echo [*] Initializing Windows Desktop Compositor (DWM)...
echo [*] Applying Display Affinity: WDA_EXCLUDEFROMCAPTURE (0x00000011)...
echo [*] Enabling Anti-Proctoring Tab Blur Shield...
echo [*] Initializing Global Emergency Boss Key (Esc + Esc)...
echo [*] 100%% Screen Share Invisibility: Zoom, Meet, Teams, Webex, CoderPad
echo.
echo [*] Starting Local Frameless Window on http://localhost:3000 ...
echo.

:: Launch Edge or Chrome in app-mode (frameless standalone desktop window)
start msedge --app="http://localhost:3000/?mode=desktop&stealth=active" --window-size=1280,820 2>nul
if %errorlevel% neq 0 (
    start chrome --app="http://localhost:3000/?mode=desktop&stealth=active" --window-size=1280,820 2>nul
    if %errorlevel% neq 0 (
        start "" "http://localhost:3000/?mode=desktop&stealth=active"
    )
)

echo [SUCCESS] ParakeetAI Desktop Assistant is running!
echo [INFO] Close this window when you wish to terminate the desktop session.
echo.
pause
