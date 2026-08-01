from pydantic import BaseModel, Field


class ProjectCreateRequest(BaseModel):
    title: str = Field(..., description="Name of the public works project")
    department: str = Field(..., description="Department handling the project")
    budget: float = Field(..., description="Total allocated project funding")
    status: str = Field("Planned", description="Progress status")
    location: str = Field("Ward 4", description="Geographical or ward zone")
    timeline: str = Field("2026", description="Project timeline window")
    progress: int = Field(0, ge=0, le=100, description="Completeness percentage")


class ProjectResponse(BaseModel):
    id: str = Field(..., description="Unique alphanumeric project identifier")
    title: str = Field(..., description="Name of the public works project")
    department: str = Field(..., description="Department handling the project")
    budget: float = Field(..., description="Total allocated project funding")
    status: str = Field(
        ..., description="Progress status (Planned, In Progress, Completed, Delayed)"
    )
    location: str = Field(..., description="Geographical or ward zone")
    timeline: str = Field(..., description="Project timeline window")
    progress: int = Field(..., ge=0, le=100, description="Completeness percentage")

    model_config = {
        "json_schema_extra": {
            "example": {
                "id": "PRJ-8812",
                "title": "Oakridge High School Solar Retrofit",
                "department": "Energy & Environment",
                "budget": 1250000.00,
                "status": "In Progress",
                "location": "Ward 4 (North Metro)",
                "timeline": "Mar 2025 - Nov 2026",
                "progress": 68,
            }
        }
    }

