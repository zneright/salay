# Windows Local Setup Script for Civic Transparency Platform

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Initializing Civic Transparency Platform Environment  " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check Python installation
Write-Host "`n[1/4] Checking Python Installation..." -ForegroundColor Yellow
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonVersion = python --version
    Write-Host "Found Python: $pythonVersion" -ForegroundColor Green
} else {
    Write-Error "Python is not installed or not in PATH. Please install Python 3.11+."
    Exit
}

# 2. Setup Backend Virtual Environment
Write-Host "`n[2/4] Setting up Python Virtual Environment..." -ForegroundColor Yellow
if (-not (Test-Path "backend")) {
    New-Item -ItemType Directory -Force -Path "backend" | Out-Null
}

# Create requirements.txt if not exists
if (-not (Test-Path "backend/requirements.txt")) {
    New-Item -ItemType File -Force -Path "backend/requirements.txt" | Out-Null
    Set-Content -Path "backend/requirements.txt" -Value "fastapi==0.111.0`nuvicorn==0.30.1`npydantic==2.7.4`npydantic-settings==2.3.4`npython-dotenv==1.0.1`nrequests==2.32.3"
}

# Create .env.example if not exists
if (-not (Test-Path "backend/.env.example")) {
    New-Item -ItemType File -Force -Path "backend/.env.example" | Out-Null
    Set-Content -Path "backend/.env.example" -Value "API_ENV=development`nAPI_PORT=8000`nAPI_DEBUG=true`nAPI_SECRET_KEY=09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7`nACCESS_TOKEN_EXPIRE_MINUTES=60`nCORS_ORIGINS=[`"http://localhost:5173`"]`nSNOWFLAKE_ACCOUNT=your_account`nSNOWFLAKE_USER=your_user`nSNOWFLAKE_PASSWORD=your_password`nSNOWFLAKE_WAREHOUSE=your_warehouse`nSNOWFLAKE_DATABASE=CIVIC_TRANSPARENCY_DB`nSNOWFLAKE_SCHEMA=PUBLIC`nSNOWFLAKE_ROLE=your_role`nCORTEX_LLM_MODEL=llama3-70b"
}

# Copy env if not exists
if (-not (Test-Path "backend/.env")) {
    Copy-Item -Path "backend/.env.example" -Destination "backend/.env"
    Write-Host "Created backend/.env config file." -ForegroundColor Green
}

# Create venv
if (-not (Test-Path "backend/venv")) {
    Write-Host "Creating Virtual Environment 'backend/venv'..." -ForegroundColor Cyan
    python -m venv backend/venv
}

# Install dependencies
Write-Host "Installing Python packages..." -ForegroundColor Cyan
& "backend/venv/Scripts/pip.exe" install -r backend/requirements.txt

# 3. Check Node/NPM installation
Write-Host "`n[3/4] Checking Node.js / NPM..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "Found Node: $nodeVersion" -ForegroundColor Green
} else {
    Write-Warning "Node.js is not found. Please install Node.js 18+ to run the React UI."
}

# Create frontend config placeholders if directories exist
if (-not (Test-Path "frontend")) {
    New-Item -ItemType Directory -Force -Path "frontend" | Out-Null
}

# Create frontend/.env.example if not exists
if (-not (Test-Path "frontend/.env.example")) {
    New-Item -ItemType File -Force -Path "frontend/.env.example" | Out-Null
    Set-Content -Path "frontend/.env.example" -Value "VITE_API_BASE_URL=http://localhost:8000/api/v1`nVITE_APP_TITLE=Civic Transparency Platform`nVITE_ENABLE_MOCKS=true"
}

# Copy env if not exists
if (-not (Test-Path "frontend/.env")) {
    Copy-Item -Path "frontend/.env.example" -Destination "frontend/.env"
    Write-Host "Created frontend/.env config file." -ForegroundColor Green
}

# Install npm dependencies if node is present
if (Get-Command node -ErrorAction SilentlyContinue) {
    if (Test-Path "frontend/package.json") {
        Write-Host "Installing Frontend dependencies..." -ForegroundColor Cyan
        Set-Location -Path "frontend"
        npm install
        Set-Location -Path ".."
    } else {
        Write-Host "Frontend package.json not found yet. Skipping npm install." -ForegroundColor Gray
    }
}

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "  Setup Complete! Follow README.md to start the servers." -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
