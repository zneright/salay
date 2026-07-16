# Civic Transparency & Accountability Platform (Snowflake Hackathon 2026)

A clean, production-ready, clean-architecture application built for the **Snowflake CoCo CLI Hackathon 2026**.

This platform provides citizens and administrators with transparent access to **Public Works Projects**, **Municipal Budget Expenditures**, and **Citizen Feedback** through natural language querying powered by Snowflake Cortex AI and Snowpark.

---

## 🌟 Hackathon Goals & Manifest
*   **Real-World Relevance**: Making civic budgets and project allocations readable and searchable by any citizen.
*   **Technical Execution**: Fully decoupled Clean Architecture (FastAPI + React 19 + TypeScript) built to swap mocks for live Snowflake databases seamlessly.
*   **Solution Completeness**: A highly polished Vercel/Linear-inspired minimal interface, fully responsive and accessible.
*   **Decoupled & Replaceable**: Abstraction layers ensure Snowflake drivers, Cortex engines, and CLI agents are easily swappable.

---

## 🏗️ Architecture & Module Flow

```
   [ React SPA UI ]
          │
          ▼
   [ Axios Client ]
          │
          ▼
   [ FastAPI Router ]
          │
          ▼
  [ Service Interfaces ]  <── (Dependency Injection)
          │
          ▼
 [ Repository Interfaces ] <── (Decoupled Adapters)
          │
          ▼
    [ Snowflake ]
```

---

## 📁 Repository Layout
```
salay/
├── backend/            # FastAPI REST Service (Python 3.11)
├── frontend/           # Vite + React (TypeScript + Tailwind + shadcn/ui)
├── docs/               # Architecture, API, and setup documentation
├── scripts/            # Local developer onboarding automation
├── README.md           # This file
├── FEATURE_STATUS.md   # Feature roadmap and state logs
├── TECH_DEBT.md        # Technical debt registry
├── DEVELOPMENT_LOG.md  # Engineering dairy and log
└── ADR.md              # Architecture Decision Records
```

---

## 🚀 Quick Start (Local Setup)

To set up local virtual environments and node modules quickly on Windows, run the automated setup script from PowerShell:

```powershell
.\scripts\setup.ps1
```

### Starting the Backend
```bash
cd backend
venv\Scripts\activate
python run.py
```
*API docs will be available at:* `http://localhost:8000/docs`

### Starting the Frontend
```bash
cd frontend
npm install
npm run dev
```
*UI will be available at:* `http://localhost:5173`

---

## 🗺️ Snowflake Integration Roadmap
1.  **Phase 1**: Mock APIs returning static Civic Transparency schemas.
2.  **Phase 2**: Local JSON storage.
3.  **Phase 3**: Connection handshake implementation.
4.  **Phase 4**: Snowflake SQL queries (Snowflake Python Connector).
5.  **Phase 5**: Snowpark DataFrames data-wrangling.
6.  **Phase 6**: Snowflake Cortex AI integration.
7.  **Phase 7**: CoCo CLI Agent automation.
8.  **Phase 8**: Production optimization & demo readiness.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
