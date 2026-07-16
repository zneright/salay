# Application Deployment Guide

This guide details the targets, pipelines, and commands required to bundle, containerize, and deploy the Civic Transparency Platform into production.

---

## 🎯 Target Environments

During the Snowflake Hackathon, we prepare for three deployment vectors:

### 1. Traditional Container Deployment (Docker + Cloud Hosting)
For testing and simple showcases, the backend and frontend are built as standard web containers:
*   **Frontend**: Built to static HTML/JS/CSS assets and served via an Nginx container.
*   **Backend**: Run as a containerized Uvicorn daemon.

### 2. Streamlit in Snowflake (SiS)
If migrating to an all-in-Snowflake UI model:
*   Re-use backend services directly as imported Python modules.
*   Run the Python UI natively inside a Snowflake warehouse container.

### 3. Snowflake Native App Framework
The ultimate production structure. The monorepo aligns directly with the Native App schema layout:
*   Backend scripts are registered as User Defined Functions (UDFs) and Stored Procedures.
*   Data pipelines are executed inside Snowpark.
*   Secure Views are exposed to consumer accounts.

---

## 📦 Building the Application

### Compiling Frontend Bundle
From the `/frontend` directory, build the optimized static distribution:
```bash
npm run build
```
Vite generates compiled assets into `/frontend/dist`. These assets are minified, code-split by route, and optimized for fast page loads (Performance Budget: initial bundles < 250kb).

### Backend Production Setup
Ensure debug settings are disabled inside backend env configs:
```ini
API_ENV=production
API_DEBUG=false
```
Execute the backend using a multi-worker production configuration:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 80 --workers 4
```

---

## ❄️ Deploying Stages to Snowflake SQL

To deploy mock files or datasets into Snowflake Stages for the data processing pipelines:
1. Connect via the SnowSQL client or CoCo CLI:
   ```bash
   snow connection test
   ```
2. Create standard stages:
   ```sql
   CREATE OR REPLACE STAGE civic_raw_stage;
   ```
3. Upload raw civic datasets (Budgets, Public Projects JSON/CSV structures):
   ```sql
   PUT file://path/to/local/data.json @civic_raw_stage;
   ```
4. Define a Snowflake Dynamic Table to auto-ingest data from the stages:
   ```sql
   CREATE OR REPLACE DYNAMIC TABLE public_works_summary
     TARGET_LAG = '1 hour'
     WAREHOUSE = COMPUTE_WH
     AS SELECT * FROM @civic_raw_stage;
   ```
