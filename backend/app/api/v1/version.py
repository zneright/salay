from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter()

class VersionResponse(BaseModel):
    version: str = Field(..., description="Active version of the platform release")
    roadmap_phase: str = Field(..., description="Active phase of the hackathon schedule")

@router.get("/version", response_model=VersionResponse)
def get_version() -> VersionResponse:
    return VersionResponse(
        version="0.1.0",
        roadmap_phase="Phase 4 - Backend Foundation"
    )
