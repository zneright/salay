from fastapi import APIRouter, Depends, status
from typing import List
from app.schemas.feedback import FeedbackCreateRequest, FeedbackResponse
from app.services.feedback import AbstractFeedbackService
from app.dependencies.providers import get_feedback_service

router = APIRouter()


@router.get("/feedback", response_model=List[FeedbackResponse])
def list_feedback(
    service: AbstractFeedbackService = Depends(get_feedback_service),
) -> List[FeedbackResponse]:
    return service.retrieve_all_reports()


@router.post(
    "/feedback/submit",
    response_model=FeedbackResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_feedback(
    payload: FeedbackCreateRequest,
    service: AbstractFeedbackService = Depends(get_feedback_service),
) -> FeedbackResponse:
    # Convert Pydantic request structure to dictionary
    feedback_dict = payload.model_dump()
    return service.create_report(feedback_dict)
