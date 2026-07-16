# Developer & Agent Development Guide

This guide details the onboarding steps, runtime execution cycles, and testing commands required to develop, build, and verify the Civic Transparency platform.

---

## 💻 Local Setup Workflow

### Automatic Windows Setup
We provide an automated PowerShell script to install node dependencies and configure virtual environments. Open PowerShell as Administrator and execute:
```powershell
.\scripts\setup.ps1
```

### Manual Backend Setup
1. Navigate to `/backend` directory:
   ```bash
   cd backend
   ```
2. Create virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the environment:
   *   *Windows PowerShell*: `.\venv\Scripts\Activate.ps1`
   *   *Windows CMD*: `.\venv\Scripts\activate.bat`
   *   *macOS/Linux*: `source venv/bin/activate`
4. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Manual Frontend Setup
1. Navigate to `/frontend` directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```

---

## 🏃 Running Development Servers

### Starting Backend (FastAPI)
Activate the virtual environment and execute:
```bash
python run.py
```
By default, the server runs on `http://127.0.0.1:8000`. You can inspect endpoints and execute test payloads at `http://127.0.0.1:8000/docs`.

### Starting Frontend (Vite)
Navigate to `/frontend` and run:
```bash
npm run dev
```
The server runs locally, typically at `http://localhost:5173`.

---

## 🛠️ Verification Commands

Before staging modifications or declaring a phase complete, verify compliance using these commands:

### Backend Linter & Format Checks
From the `/backend` directory:
```bash
# Format check
black --check app/
# Code linting
ruff check app/
```

### Backend Unit Tests
From the `/backend` directory:
```bash
pytest
```

### Frontend Code Checks
From the `/frontend` directory:
```bash
# Type-check TypeScript files
npm run build -- --noEmit

# Lint check
npm run lint
```

---

## 🔄 Daily Workflow Rules

### Session Continuity Checklist
At the beginning of every session:
1. Review modified files in git status.
2. Read the latest status updates in `FEATURE_STATUS.md`.
3. Check active logs in `DEVELOPMENT_LOG.md` and `TECH_DEBT.md`.
4. Run health tests to confirm the base build is not broken.

### Definition of Done Checklist
Do not mark a feature or phase as completed until:
- [ ] All acceptance criteria are met.
- [ ] TypeScript type checks pass with zero compile errors.
- [ ] Python ruff/black checks pass with zero layout warnings.
- [ ] The local frontend and backend servers start cleanly.
- [ ] The local API docs are fully operational.
- [ ] `FEATURE_STATUS.md` and `DEVELOPMENT_LOG.md` are updated.
