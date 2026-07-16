from pydantic import BaseModel, Field


class AIChatRequest(BaseModel):
    session_id: str = Field(..., description="Active session tracking identifier")
    query: str = Field(..., min_length=2, description="Natural language question text")

    model_config = {
        "json_schema_extra": {
            "example": {
                "session_id": "sess-4401",
                "query": "Where was the 2025 education budget spent?",
            }
        }
    }


class AIChatResponse(BaseModel):
    session_id: str = Field(..., description="Session identifier")
    response: str = Field(..., description="Generated answer from Cortex context")
    confidence_score: float = Field(
        ..., ge=0.0, le=1.0, description="Confidence percentage"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "session_id": "sess-4401",
                "response": "Education budget expenditures totalled $18,000,000...",
                "confidence_score": 0.94,
            }
        }
    }
