# Technical Debt Log

This log tracks temporary decisions, code debt, mock implementations, and shortcuts taken during rapid development, ensuring they are addressed before production or final judging.

---

## Technical Debt Index

| ID | Module | Description | Severity | Date Added | Target Resolution | Status |
|---|---|---|---|---|---|---|
| **TD-001** | Backend | Mock APIs return hardcoded data schemas instead of reading databases | Low | 2026-07-17 | Phase 3 (Snowflake SQL) | **Planned** |
| **TD-002** | Backend | Mock AI endpoint generates simulated LLM text locally without API calls | Low | 2026-07-17 | Phase 6 (Cortex AI) | **Planned** |
| **TD-003** | Frontend | Mock Auth sets a hardcoded user token in localStorage | Low | 2026-07-17 | Phase 7 (CoCo CLI Agent) | **Planned** |

---

## Details & Resolution Notes

### TD-001: Mock APIs for Civic Transparency Domain
- **Description**: Initial endpoints return mock data representing Public Works Projects, Municipal Budgets, and Citizen Reports to keep the frontend operational.
- **Resolution**: During Phase 3/4, we will write Snowflake repository classes matching the interfaces to query the database.

### TD-002: Mock AI Chat Responses
- **Description**: The AI chat endpoint utilizes local rules and structured prompt replies to simulate query responses.
- **Resolution**: Replace this implementation in Phase 6 with Snowflake Cortex function calls (`SNOWFLAKE.CORTEX.COMPLETE`).

### TD-003: Mock Authentication Local Storage
- **Description**: Mock auth uses a mock JWT token and in-memory variables.
- **Resolution**: Wire it to proper Snowflake OAuth authentication endpoints or a simplified JWT system if Snowflake integrations bypass user login.
