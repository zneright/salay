from fastapi import APIRouter, Depends, status
from app.schemas.budgets import BudgetSummaryResponse, BudgetAllocationCreateRequest
from app.services.budgets import AbstractBudgetService
from app.dependencies.providers import get_budget_service

router = APIRouter()


@router.get("/budgets/summary", response_model=BudgetSummaryResponse)
def get_budget_summary(
    service: AbstractBudgetService = Depends(get_budget_service),
) -> BudgetSummaryResponse:
    return service.retrieve_budget_summary()


@router.post("/budgets", status_code=status.HTTP_201_CREATED)
def create_budget_allocation(
    payload: BudgetAllocationCreateRequest,
    service: AbstractBudgetService = Depends(get_budget_service),
):
    return service.create_budget_allocation(payload.model_dump())

