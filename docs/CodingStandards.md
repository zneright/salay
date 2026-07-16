# Code Standards & Quality Guidelines

This document describes the style, linting, formatting, and structural constraints required for contributors and AI coding units.

---

## 🎨 General Standards
*   **Self-Documenting Naming**: Use complete, clear names. Avoid custom contractions or abbreviations.
    *   *Correct*: `fetchMunicipalBudgetSummary`, `projectCompletionDate`
    *   *Incorrect*: `getMuniBgt`, `projCompDt`
*   **Clean Architecture Strictness**:
    *   *Controllers/Routers* must remain thin. Never place business rules or calculations inside them.
    *   *Services* handle calculations and coordinate steps. They must never query databases directly (they delegate to repos).
    *   *Repositories* perform SQL/API querying only. Never put validation or logic rules inside repositories.
    *   *UI Components* are for view rendering and layouts. Never write business logic inside UI views.

---

## 🐍 Python / Backend Standards
*   **Type Hinting**: All functions must contain full type hints for parameters and return values:
    ```python
    def calculate_spent_percentage(allocated: float, spent: float) -> float:
        if allocated <= 0:
            return 0.0
        return (spent / allocated) * 100.0
    ```
*   **Pydantic Enforcement**: Always use Pydantic models (version 2) for incoming payloads, outgoing REST responses, and environmental settings.
*   **Snowflake Datatypes Alignment**:
    *   Use `str` (maps to `VARCHAR` database columns).
    *   Use `int` / `float` (maps to `NUMBER` / `FLOAT` database columns).
    *   Use standard ISO-8601 strings (e.g. `YYYY-MM-DDTHH:MM:SSZ`) for date-times (maps to `TIMESTAMP_NTZ`).
*   **Formatters**: Code must conform to `black` (formatting) and `ruff` (linting).

---

## ⚛️ React & TypeScript Standards
*   **TypeScript Strict Mode**: The compiler flag `"strict": true` is enforced. Do not use `any`. Specify interface types for all function inputs and responses.
*   **Functional Components Only**: Standard functional React declarations only (no class-based structures). Use named exports:
    ```typescript
    export const ProjectDetailsCard: React.FC<ProjectProps> = ({ project }) => { ... }
    ```
*   **No Inline Logic**: Write user events, API mutations, and input changes in hooks. Keep component JSX templates clean.
*   **One Component Per File**: Every React UI component must live in its own separate file.
*   **Styling**: Use utility-first styling patterns powered by Tailwind CSS. Define tokens (colors, margins, radii) in `tailwind.config.js` to ensure visual consistency.
