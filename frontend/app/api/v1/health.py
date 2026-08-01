import datetime
from typing import Optional, Dict, Any
from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.db.snowflake import get_snowflake_connection, execute_snowflake_query
from app.core.config import settings

router = APIRouter()


class HealthResponse(BaseModel):
    status: str = Field(..., description="System health status indicator")
    timestamp: str = Field(..., description="ISO-8601 server datetime stamp")
    environment: str = Field(..., description="Active server runtime tier")
    snowflake_connected: bool = Field(
        ..., description="Live Snowflake DB connection status"
    )
    snowflake_details: Optional[Dict[str, Any]] = Field(
        None, description="Detailed Snowflake DB connection telemetry"
    )


@router.get("/health", response_model=HealthResponse)
def check_health() -> HealthResponse:
    is_connected = False
    details: Dict[str, Any] = {
        "account": settings.SNOWFLAKE_ACCOUNT or "Unconfigured",
        "database": settings.SNOWFLAKE_DATABASE or "CIVIC_TRANSPARENCY_DB",
        "warehouse": settings.SNOWFLAKE_WAREHOUSE or "COMPUTE_WH",
        "projects_table_rows": 0,
    }

    try:
        conn = get_snowflake_connection()
        if conn:
            is_connected = True
            rows = execute_snowflake_query("SELECT COUNT(*) AS CNT FROM PROJECTS")
            if rows:
                details["projects_table_rows"] = rows[0].get("cnt", 0)
            conn.close()
    except Exception as exc:
        details["error"] = str(exc)

    return HealthResponse(
        status="OK" if is_connected else "DEGRADED",
        timestamp=datetime.datetime.utcnow().isoformat() + "Z",

        environment=settings.API_ENV,
        snowflake_connected=is_connected,
        snowflake_details=details,
    )
