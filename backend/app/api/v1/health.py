import datetime
from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter()


class HealthResponse(BaseModel):
    status: str = Field(..., description="System health status indicator")
    timestamp: str = Field(..., description="ISO-8601 server datetime stamp")
    environment: str = Field(..., description="Active server runtime tier")


@router.get("/health", response_model=HealthResponse)
def check_health() -> HealthResponse:
    return HealthResponse(
        status="OK",
        timestamp=datetime.datetime.utcnow().isoformat() + "Z",
        environment="development",
    )
