from fastapi import APIRouter, Depends
from app.schemas.budgets import BudgetSummaryResponse
from app.services.budgets import AbstractBudgetService
from app.dependencies.providers import get_budget_service

router = APIRouter()


@router.get("/budgets/summary", response_model=BudgetSummaryResponse)
def get_budget_summary(
    service: AbstractBudgetService = Depends(get_budget_service),
) -> BudgetSummaryResponse:
    return service.retrieve_budget_summary()
