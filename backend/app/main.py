from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.middleware.errors import GlobalExceptionMiddleware
from app.api.v1.health import router as health_router
from app.api.v1.version import router as version_router
from app.api.v1.projects import router as projects_router
from app.api.v1.budgets import router as budgets_router
from app.api.v1.feedback import router as feedback_router
from app.api.v1.ai import router as ai_router


def create_app() -> FastAPI:
    # Setup root logging formatters
    setup_logging()

    app = FastAPI(
        title="Civic Transparency API",
        description="REST backend endpoints powered by Snowflake",
        version="0.1.0",
        debug=settings.API_DEBUG,
    )

    # CORS Configurations
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Global exception handler middleware
    app.add_middleware(GlobalExceptionMiddleware)

    # Mount API routers under /api/v1
    api_prefix = "/api/v1"
    app.include_router(health_router, prefix=api_prefix, tags=["Diagnostics"])
    app.include_router(version_router, prefix=api_prefix, tags=["Diagnostics"])
    app.include_router(projects_router, prefix=api_prefix, tags=["Public Works"])
    app.include_router(budgets_router, prefix=api_prefix, tags=["Municipal Budgets"])
    app.include_router(feedback_router, prefix=api_prefix, tags=["Citizen Reports"])
    app.include_router(ai_router, prefix=api_prefix, tags=["Cortex AI"])

    return app


app = create_app()
