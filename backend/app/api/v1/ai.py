from fastapi import APIRouter, Depends
from app.schemas.ai import AIChatRequest, AIChatResponse
from app.services.ai import AbstractAIService
from app.dependencies.providers import get_ai_service

router = APIRouter()


@router.post("/ai/chat", response_model=AIChatResponse)
def chat_transparency(
    payload: AIChatRequest, service: AbstractAIService = Depends(get_ai_service)
) -> AIChatResponse:
    return service.generate_chat_response(payload.query, payload.session_id)
