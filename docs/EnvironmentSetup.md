# Environment Configuration Guide

This document describes the environment variables required for running the backend and frontend modules locally and on target Snowflake deployments.

---

## 🔒 Security Rules
*   **No Committing Secrets**: Never commit `.env` files to git. The `.gitignore` file enforces this globally.
*   **Isolated Overrides**: Copy the template environment files (`.env.example`) to `.env` in both folders and input your specific credentials locally.
*   **Frontend Constraints**: Never define database passwords, private keys, or credentials in the frontend. Only prefix variables with `VITE_` if they are public.

---

## 🐍 Backend Configuration (`/backend/.env`)

Below is the structured list of backend settings. Copy these to `backend/.env`.

```ini
# FastAPI Settings
API_ENV=development
API_PORT=8000
API_DEBUG=true

# Security Settings
# Generate secret key using: openssl rand -hex 32
API_SECRET_KEY=09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=["http://localhost:5173", "http://127.0.0.1:5173"]

# Snowflake Connectivity (Required for Phase 3+)
SNOWFLAKE_ACCOUNT=your_snowflake_account
SNOWFLAKE_USER=your_snowflake_user
SNOWFLAKE_PASSWORD=your_snowflake_password
SNOWFLAKE_WAREHOUSE=your_snowflake_warehouse
SNOWFLAKE_DATABASE=CIVIC_TRANSPARENCY_DB
SNOWFLAKE_SCHEMA=PUBLIC
SNOWFLAKE_ROLE=your_snowflake_role

# Snowflake Cortex & AI settings (Required for Phase 6+)
CORTEX_LLM_MODEL=llama3-70b
```

### Backend Config Types (Pydantic Mapping)
FastAPI parses these values into a strongly typed class `core/config.py` using `pydantic-settings`:
*   `API_ENV`: String representing the runtime tier (e.g. `development`, `production`).
*   `CORS_ORIGINS`: JSON array representation of authorized origin domains.
*   `SNOWFLAKE_PORT` (Optional): Default standard port is 443.

---

## ⚡ Frontend Configuration (`/frontend/.env`)

Vite exposes environment variables to the browser bundle only if prefixed with `VITE_`. Copy these to `frontend/.env`.

```ini
# Base API Connection Endpoint
VITE_API_BASE_URL=http://localhost:8000/api/v1

# UI Configurations
VITE_APP_TITLE=Civic Transparency Platform
VITE_ENABLE_MOCKS=true
```

### Accessing in Frontend Code
Within React, variables are retrieved using Vite's custom context utility:
```typescript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
```
If `VITE_ENABLE_MOCKS` is set to `true`, the UI will simulate database endpoints without querying the backend, which is useful for stand-alone frontend showcases.
