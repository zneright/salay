# Architecture Decision Records (ADR)

This file maintains records of significant design and architectural choices made throughout the life of the project.

---

## ADR Index

1. [ADR-001: Monorepo Structure with Separated Components](#adr-001-monorepo-structure-with-separated-components) (2026-07-17)
2. [ADR-002: Service-Repository Clean Architecture Pattern](#adr-002-service-repository-clean-architecture-pattern) (2026-07-17)
3. [ADR-003: Civic Transparency Themed Domain Design](#adr-003-civic-transparency-themed-domain-design) (2026-07-17)

---

## ADR-001: Monorepo Structure with Separated Components

### Context
We need to coordinate a frontend React application and backend FastAPI service. We want local setup, scripting, and deployment to be straightforward during the hackathon.

### Decision
We will use a simple monorepo structure. `/frontend` and `/backend` exist as folders in a single git repository. 
We will avoid complex monorepo managers (e.g. Lerna, Nx, Turborepo) to prevent dependency conflicts and keep build steps extremely clear for local execution.

### Alternatives Considered
1. **Separated Repositories**: Adds overhead synchronizing code and managing git logs across two separate codebases.
2. **Heavy Monorepo Tooling (Nx/Turborepo)**: Adds steep learning curves and potential environment issues on the judge's local machines.

### Consequences
- **Pros**: Easy to launch both servers, unified git logs, easy packaging.
- **Cons**: Dependencies are managed separately in each directory (`package.json` vs. `requirements.txt`). This is mitigated by clean automation setup scripts.

---

## ADR-002: Service-Repository Clean Architecture Pattern

### Context
We must ensure our codebase is modular so that Snowflake integrations can be developed incrementally, and mock components can easily be replaced without affecting the UI or core business controllers.

### Decision
We will employ a classic Clean Architecture design:
1. **API Routers**: Pure REST inputs/outputs (FastAPI).
2. **Services**: Business rules coordination. Uses Dependency Injection to obtain Repositories.
3. **Repositories**: Connects to the database / external APIs.
We will define Python Interfaces (Protocols/ABCs) for every service and repository. FastAPI depends on these interfaces, and resolves them to mock or real classes at startup.

### Alternatives Considered
1. **Direct DB queries in Router controllers**: Faster to write initially, but couples the router code tightly to SQL, which would require massive rewrites when moving to Snowflake.

### Consequences
- **Pros**: Easily swap mock data folders for Snowpark/Cortex integrations by changing a single DI configuration. Extremely testable.
- **Cons**: Introduces more boilerplate files (interfaces, mock implementations, DI providers) during initial scaffolding.

---

## ADR-003: Civic Transparency Themed Domain Design

### Context
Judge scores heavily reward "Real-World Relevance" and "Solution Completeness". Using generic placeholder mock data (e.g. `foo`, `bar`, standard CRM `users`/`tasks`) looks unpolished and does not tell a cohesive product story.

### Decision
We will adopt a **Civic Transparency** theme from day one. All mock models, database fields, and interface designs represent Public Works Projects, Municipal Budgets, and Citizen Feedback.

### Alternatives Considered
1. **Generic CRM Theme**: Plentiful example code online, but lacks unique relevance for a standout hackathon submission.

### Consequences
- **Pros**: Immediate professional narrative, clear data schemas, highly relevant judging profile.
- **Cons**: Slightly more effort designing mock schemas from scratch.
