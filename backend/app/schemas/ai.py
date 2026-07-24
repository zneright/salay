from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ChatMessageTurn(BaseModel):
    role: str = Field(..., description="Role of the sender: 'user' or 'assistant'")
    content: str = Field(..., description="Message text content")


class AIChatRequest(BaseModel):
    session_id: str = Field(..., description="Active session tracking identifier")
    query: str = Field(..., min_length=1, description="Natural language question text")
    history: Optional[List[ChatMessageTurn]] = Field(
        default=[], description="Multi-turn conversation dialogue history"
    )
    model: Optional[str] = Field(
        default="llama3-70b", description="Target Cortex LLM model identifier"
    )
    dataset_scope: Optional[str] = Field(
        default="All Datasets (Snowflake Hybrid)", description="Target dataset filter scope"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "session_id": "sess-4401",
                "query": "Where was the 2025 education budget spent?",
                "history": [{"role": "user", "content": "Hello"}, {"role": "assistant", "content": "Hi! How can I help?"}],
                "model": "llama3-70b",
                "dataset_scope": "Municipal Budgets Registry",
            }
        }
    }


class AIChatResponse(BaseModel):
    session_id: str = Field(..., description="Session identifier")
    response: str = Field(..., description="Generated answer from Cortex context")
    confidence_score: float = Field(
        ..., ge=0.0, le=1.0, description="Confidence percentage"
    )
    model_used: Optional[str] = Field(
        default="llama3-70b", description="Model used to generate response"
    )
    generated_sql: Optional[str] = Field(
        default=None, description="Snowflake SQL query preview executed or constructed"
    )
    data_sources: Optional[List[str]] = Field(
        default=[], description="Referenced database tables or document search stages"
    )
    pdf_attachment_name: Optional[str] = Field(
        default=None, description="Name of referenced PDF audit document proof"
    )
    pdf_snippet: Optional[str] = Field(
        default=None, description="Extracted textual excerpt from audit PDF proof"
    )
    suggested_followups: Optional[List[str]] = Field(
        default=[], description="Recommended follow-up query suggestions"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "session_id": "sess-4401",
                "response": "Education budget expenditures totalled $18,000,000...",
                "confidence_score": 0.96,
                "model_used": "llama3-70b",
                "generated_sql": "SELECT * FROM BUDGETS WHERE DEPARTMENT = 'Education';",
                "data_sources": ["BUDGETS"],
                "pdf_attachment_name": None,
                "suggested_followups": ["Show expenditure breakdown by school district."],
            }
        }
    }

