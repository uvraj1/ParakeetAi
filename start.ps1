Write-Host "=====================================================================" -ForegroundColor Green
Write-Host "       PARAKEET AI - 100% FREE FOREVER (ZERO COST / PRICELESS)       " -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Green
Write-Host ""

Set-Location $PSScriptRoot

if (-not (Test-Path "node_modules")) {
    Write-Host "[*] Installing dependencies..." -ForegroundColor Yellow
    npm.cmd install
}

Write-Host "[*] Opening browser at http://localhost:3000 ..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

Write-Host "[*] Starting Vite server..." -ForegroundColor Green
npm.cmd run dev
