# 🚀 Zero-Config 1-Click Starter for SALAY Civic Transparency Platform

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Starting SALAY Platform (100% Free Local Zero-Config)   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

# 1. Start Backend in separate window
Write-Host "`n[1/2] Launching FastAPI Backend on http://localhost:8000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; .\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

# 2. Start Frontend in separate window
Write-Host "[2/2] Launching React UI on http://localhost:5173 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev"

Write-Host "`n✅ SALAY is running!" -ForegroundColor Green
Write-Host "• Frontend UI: http://localhost:5173" -ForegroundColor Cyan
Write-Host "• Backend API: http://localhost:8000/docs" -ForegroundColor Cyan
