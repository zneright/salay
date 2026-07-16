from fastapi import Depends
from app.repositories.projects import AbstractProjectRepository, MockProjectRepository
from app.repositories.budgets import AbstractBudgetRepository, MockBudgetRepository
from app.repositories.feedback import AbstractFeedbackRepository, MockFeedbackRepository
from app.services.projects import AbstractProjectService, MockProjectService
from app.services.budgets import AbstractBudgetService, MockBudgetService
from app.services.feedback import AbstractFeedbackService, MockFeedbackService
from app.services.ai import AbstractAIService, MockAIService

# Singleton Mock Database Repositories to preserve state
_project_repo = MockProjectRepository()
_budget_repo = MockBudgetRepository()
_feedback_repo = MockFeedbackRepository()

# Singleton Mock Services
_project_service = MockProjectService(_project_repo)
_budget_service = MockBudgetService(_budget_repo)
_feedback_service = MockFeedbackService(_feedback_repo)
_ai_service = MockAIService()

# Dependency Resolvers
def get_project_repository() -> AbstractProjectRepository:
    return _project_repo

def get_project_service(
    repo: AbstractProjectRepository = Depends(get_project_repository)
) -> AbstractProjectService:
    return _project_service

def get_budget_repository() -> AbstractBudgetRepository:
    return _budget_repo

def get_budget_service(
    repo: AbstractBudgetRepository = Depends(get_budget_repository)
) -> AbstractBudgetService:
    return _budget_service

def get_feedback_repository() -> AbstractFeedbackRepository:
    return _feedback_repo

def get_feedback_service(
    repo: AbstractFeedbackRepository = Depends(get_feedback_repository)
) -> AbstractFeedbackService:
    return _feedback_service

def get_ai_service() -> AbstractAIService:
    return _ai_service
