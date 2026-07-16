# System Architecture

This document describes the architectural patterns and design principles governing the Civic Transparency application.

---

## Clean Architecture Principles

To ensure that the application is resilient to changes and optimized for rapid hackathon iteration, we isolate business logic from infrastructure concerns. This allows us to work with local mock files initially and swap them with real Snowflake drivers later.

```
   ┌─────────────────────────────────────────────────────────┐
   │                       Presentation                      │
   │            (React Components / shadcn UI / CSS)          │
   └────────────────────────────┬────────────────────────────┘
                                │ JSON API (HTTP)
                                ▼
   ┌─────────────────────────────────────────────────────────┐
   │                   FastAPI Controllers                   │
   │               (Routers, Pydantic Schema Parsing)        │
   └────────────────────────────┬────────────────────────────┘
                                │ Resolves Interface
                                ▼
   ┌─────────────────────────────────────────────────────────┐
   │                      Service Layer                      │
   │            (Business Logics / Abstract Services)        │
   └────────────────────────────┬────────────────────────────┘
                                │ Resolves Interface
                                ▼
   ┌─────────────────────────────────────────────────────────┐
   │                    Repository Layer                     │
   │           (Data Abstractions / Abstract Repos)          │
   └────────────────────────────┬────────────────────────────┘
                                │ SQL / Snowpark Commands
                                ▼
   ┌─────────────────────────────────────────────────────────┐
   │                    Infrastructure                       │
   │              (Snowflake DB / Local JSON Files)          │
   └─────────────────────────────────────────────────────────┘
```

### 1. Presentation Layer (Frontend)
- **Vite & React 19**: Builds a Single Page Application (SPA).
- **Custom Hooks**: Isolate UI elements from network queries. Components consume data and trigger mutations through hooks containing TanStack Query hooks.
- **Component Design**: Purely layout and presentation. No inline database structure or API endpoints are hardcoded inside views.

### 2. Controller Layer (Backend Routers)
- **FastAPI Routers**: Capture HTTP requests, validate request bodies via Pydantic, check credentials, and delegate processing to the Service Layer.
- **Return Type Mapping**: Routers output standard Pydantic models. Output structures enforce strict API contracts.

### 3. Service Layer (Business Domain)
- **Services (FastAPI Depends)**: Coordinate operations, calculate aggregated civic statistics, run mock analysis rules, or compose prompt vectors for Cortex.
- **Decoupled Interfaces**: Business services depend solely on repository *interfaces* (`AbstractProjectRepository`, etc.), not on actual databases.

### 4. Repository Layer (Data Access)
- **Repositories**: Standardize create, read, update, and delete actions.
- **Mock vs. Snowflake**: We implement `MockProjectRepository` (loads JSON files locally) and `SnowflakeProjectRepository` (queries Snowflake stages and tables). Both classes extend the same abstract interface. Dependency injection switches the class at startup.

---

## Frontend State Management & Network Flow
- **Axios API Client**: Configured with a base URL, request timeouts, and default header handling.
- **TanStack Query (React Query)**: Handles caching, loading states, retry triggers, and stale-time invalidation.
- **React Hook Form & Zod**: Validates user inputs (such as submitting citizen complaints) on the client before network requests are fired.

---

## Future Snowflake Integration Strategy
When migrating from mock data to live Snowflake execution:
1. Establish connectivity in the Snowflake Adapter (`backend/app/repositories/snowflake_adapter.py`).
2. Write a concrete repository class (`SnowflakeProjectRepository`) inheriting the abstract interface.
3. Change the dependency binding in `backend/app/dependencies/providers.py` to return the Snowflake repository instead of the mock repository.
4. Core business services and API router controllers remain completely unchanged, ensuring zero regressions.
