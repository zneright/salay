from pydantic import BaseModel, Field, EmailStr


class FeedbackCreateRequest(BaseModel):
    report_type: str = Field(
        ..., min_length=2, description="Type of incident or review"
    )
    address: str = Field(
        ..., min_length=5, description="Incident geographical location"
    )
    description: str = Field(
        ..., min_length=10, description="Comprehensive report details"
    )
    citizen_contact: EmailStr = Field(..., description="Valid contact email address")

    model_config = {
        "json_schema_extra": {
            "example": {
                "report_type": "Pothole",
                "address": "452 Pine Street",
                "description": "Deep pothole blocking the southbound bicycle lane.",
                "citizen_contact": "citizen@gmail.com",
            }
        }
    }


class FeedbackResponse(BaseModel):
    id: str = Field(..., description="Unique generated tracking ticket ID")
    type: str = Field(..., description="Parsed report type")
    location: str = Field(..., description="Report location")
    description: str = Field(..., description="Incident details text")
    submittedAt: str = Field(..., description="ISO-8601 Date string")
    status: str = Field(
        ..., description="Open, Under Investigation, or Resolved status"
    )
