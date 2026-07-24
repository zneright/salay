# Snowflake Database & Cortex AI Setup Guide

This guide provides step-by-step instructions to configure and initialize your Snowflake database instance for the Civic Transparency Platform.

---

## Prerequisites

1. Active Snowflake Account (or Free Trial at [snowflake.com](https://signup.snowflake.com)).
2. Snowflake user credentials with privileges to create databases and warehouses (e.g. `ACCOUNTADMIN` or `SYSADMIN`).

---

## Step 1: Execute SQL Schema & Seed Data Script

1. Open **Snowsight** (Snowflake Web UI).
2. Create a new **SQL Worksheet**.
3. Copy the entire contents of [`scripts/snowflake_schema.sql`](file:///c:/Users/Renz%20Jericho%20Buday/salay/scripts/snowflake_schema.sql).
4. Run the worksheet (`CTRL + Enter` or click **Run All**).

This creates:
- Warehouse: `COMPUTE_WH`
- Database: `CIVIC_TRANSPARENCY_DB`
- Schema: `PUBLIC`
- Tables: `PROJECTS`, `BUDGETS`, `FEEDBACK_REPORTS`
- Pre-populated civic transparency data.

---

## Step 2: Configure Environment Variables

Create or edit your local `backend/.env` file with your Snowflake account details:

```env
API_ENV=development
API_PORT=8000
API_DEBUG=true

# Snowflake Connection Configuration
SNOWFLAKE_ACCOUNT=your_account_identifier
SNOWFLAKE_USER=your_username
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_WAREHOUSE=COMPUTE_WH
SNOWFLAKE_DATABASE=CIVIC_TRANSPARENCY_DB
SNOWFLAKE_SCHEMA=PUBLIC
SNOWFLAKE_ROLE=ACCOUNTADMIN

# Snowflake Cortex Model Selection
CORTEX_LLM_MODEL=llama3-70b
```

> **Account Identifier Format**: Example `xy12345.us-east-1` or `orgname-accountname`. Do not include `https://`.

---

## Step 3: Test Cortex AI Query Support

In Snowsight, run this verification query to confirm that Snowflake Cortex AI functions are active:

```sql
SELECT SNOWFLAKE.CORTEX.COMPLETE('llama3-70b', 'Provide a 1-sentence summary of why civic transparency is important.');
```

---

## Step 4: Run Backend in Connected Mode

Launch your backend API server:

```powershell
cd backend
python run.py
```

The application automatically checks for active Snowflake credentials:
- If credentials are valid, API logs will report: `INFO: Connected to Snowflake database (CIVIC_TRANSPARENCY_DB)`.
- If credentials are absent or incomplete, API logs will report: `INFO: Snowflake credentials unconfigured. Falling back to Mock Repositories`.
