# Project Folder Structure Guidelines

To prevent file layout drift and keep the codebase highly organized, all developers and agent AI units must adhere to the folder patterns described below.

---

## Workspace Root Layout
```
salay/
├── backend/            # Python FastAPI backend
├── frontend/           # React TypeScript frontend
├── docs/               # Markdown architectural guides and specs
├── scripts/            # Automations and helper scripts
├── README.md           # Quick setup and summary
├── FEATURE_STATUS.md   # Feature roadmap and state logs
├── TECH_DEBT.md        # Technical debt registry
├── DEVELOPMENT_LOG.md  # Engineering diary
└── ADR.md              # Architecture Decision Records (ADRs)
```

---

## Backend Directory Tree (`/backend`)
```
backend/
├── app/
│   ├── api/            # API routers mapping to URL endpoints (versioned)
│   │   └── v1/         # Version 1 endpoints (auth, projects, budgets, feedback, ai)
│   ├── core/           # Config declarations, security tools, global constants
│   ├── dependencies/   # FastAPI Depends() providers resolving services/repos
│   ├── middleware/     # CORS headers, request logs, global exception wrappers
│   ├── models/         # Domain-level Python model definitions
│   ├── repositories/   # Storage adapters (Interfaces, Mock implementations, SQL repos)
│   ├── schemas/        # Pydantic validation rules for API inputs & outputs
│   ├── services/       # Core business logic handlers (Interfaces, Mock/Snowflake services)
│   └── utils/          # Globally shared backend utilities (date formats, text sanitizers)
├── tests/              # Unit and integration test suites
├── requirements.txt    # Standard python pip packages
└── run.py              # Application entrypoint script
```
### Backend Directory Rules
*   **No DB operations in API routers**: Routers must only validate and return schemas. All logic belongs in `services/` and database work in `repositories/`.
*   **Interface Dependency**: Services and dependency providers must refer to abstract base classes (interfaces) to keep modules decoupled.

---

## Frontend Directory Tree (`/frontend`)
Organized by functional modules (features) rather than flat folder trees.
```
frontend/
├── src/
│   ├── app/            # Core router providers, context declarations, App.tsx, main.tsx
│   ├── assets/         # Images, global branding assets, logos
│   ├── components/     # Shared, layout-agnostic UI design system elements
│   ├── config/         # System variables, API endpoints mapping
│   ├── constants/      # Enums, navigation lists, visual layouts settings
│   ├── features/       # Feature-sliced modules (self-contained components/hooks/services)
│   │   ├── auth/       # Login widgets, profile widgets, auth state hooks
│   │   ├── projects/   # Public Works lists, detail views, budget cards
│   │   ├── budgets/    # Expenditures charts, comparisons, filter panels
│   │   ├── feedback/   # Feedback submission cards, interactive maps, statistics
│   │   └── chat/       # Cortex AI chat screen, prompt bubble, feedback widgets
│   ├── hooks/          # Global hooks (useTheme, useDebounce, etc.)
│   ├── layouts/        # Page shell structures (DashboardLayout, AuthLayout)
│   ├── lib/            # External client initializers (axios, queryClient, Tailwind utils)
│   ├── pages/          # View containers matching browser URL paths
│   ├── routes/         # Routing arrays mapping paths to pages
│   ├── styles/         # Global CSS style files, Tailwind base rules
│   └── types/          # Shared typescript interfaces and global declaration overrides
├── package.json        # Dependencies list
├── vite.config.ts      # Vite compiling settings
└── tailwind.config.js  # Styling variables mapping
```
### Frontend Directory Rules
*   **One Component Per File**: Do not stack multiple components in a single file.
*   **Feature Isolation**: Feature-specific items (components, custom hooks, services) must live in their respective subfolders in `/features`. Only global layout items go to `/components` or `/layouts`.
