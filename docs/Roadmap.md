# Hackathon Roadmap & Milestone Schedule

This roadmap outlines the milestones required to take the Civic Transparency platform from scaffolding to a polished, Snowflake-integrated competition-winning demo.

---

## 📅 Milestone Schedule

```
[Phase 1 & 2: Architecture & Setup] ──> [Phase 3 & 4: Core Framework] ──> [Phase 5 & 6: Data & AI Ingestion]
                                                                                      │
                  [Demo Delivery] <── [Phase 8: Polish & Audit] <── [Phase 7: CoCo CLI Agent]
```

### 🏁 Phase 1 & 2: Base Foundation (Current)
*   **Target Completion**: Day 1
*   **Objectives**: Setup architecture configurations, establish logs (`FEATURE_STATUS.md`, `TECH_DEBT.md`, `ADR.md`), create setup scripts.
*   **Judge Rubric Contribution**: Lays the foundation for *Technical Execution* and clean, modular engineering design.

### 🏗️ Phase 3 & 4: Core Framework Setup (Mock APIs)
*   **Target Completion**: Day 2
*   **Objectives**: Build React 19 routing structures, custom hooks, and mock service endpoints for Public Works and Budgets. Make UI fully interactive with responsive mock grids.
*   **Judge Rubric Contribution**: Demonstrates *Solution Completeness* early with an end-to-end operational web interface.

### ❄️ Phase 5: Snowflake Database Integration
*   **Target Completion**: Day 3
*   **Objectives**: Replace JSON/local storage mocks with Snowflake SQL connectors and Snowpark DataFrames. Connect live databases.
*   **Judge Rubric Contribution**: Core *Technical Execution* element. Moving raw tables to Snowflake stages, running optimized aggregations.

### 🧠 Phase 6: Snowflake Cortex AI Integration
*   **Target Completion**: Day 4
*   **Objectives**: Connect Cortex completion functions (`SNOWFLAKE.CORTEX.COMPLETE`) to the search chat. Power the Q&A bot using live civic databases.
*   **Judge Rubric Contribution**: Showcases cutting-edge Snowflake-native AI features (*Real-World Relevance* and *Technical Execution*).

### 🤖 Phase 7: CoCo CLI Agent Integration
*   **Target Completion**: Day 5
*   **Objectives**: Implement Snowflake CLI features and agent automations to run operational queries or status audits.
*   **Judge Rubric Contribution**: Directly addresses the specific theme of the *CoCo CLI Hackathon 2026*.

### 💎 Phase 8: Polish, Audit & Demo Prep
*   **Target Completion**: Day 6
*   **Objectives**: Execute visual styling sweeps, audit bundle performance, draft the presentation video script, and conduct dry-run testing.
*   **Judge Rubric Contribution**: Elevates *Solution Completeness* scores to maximize winning odds.
