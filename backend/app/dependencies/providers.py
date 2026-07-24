import logging
from fastapi import Depends
from app.db.snowflake import is_snowflake_configured, get_snowflake_connection

from app.repositories.projects import AbstractProjectRepository
from app.repositories.snowflake_projects import SnowflakeProjectRepository

from app.repositories.budgets import AbstractBudgetRepository
from app.repositories.snowflake_budgets import SnowflakeBudgetRepository

from app.repositories.feedback import AbstractFeedbackRepository
from app.repositories.snowflake_feedback import SnowflakeFeedbackRepository

from app.services.projects import AbstractProjectService, ProjectService
from app.services.budgets import AbstractBudgetService, BudgetService
from app.services.feedback import AbstractFeedbackService, FeedbackService

from app.services.ai import AbstractAIService
from app.services.snowflake_ai import SnowflakeAIService

logger = logging.getLogger("civic_api")


def _resolve_providers():
    logger.info("Initializing repositories and services strictly with Snowflake DB and Cortex AI backend.")
    p_repo = SnowflakeProjectRepository()
    b_repo = SnowflakeBudgetRepository()
    f_repo = SnowflakeFeedbackRepository()
    ai_svc = SnowflakeAIService()

    p_svc = ProjectService(p_repo)
    b_svc = BudgetService(b_repo)
    f_svc = FeedbackService(f_repo)

    return p_repo, b_repo, f_repo, p_svc, b_svc, f_svc, ai_svc



(
    _project_repo,
    _budget_repo,
    _feedback_repo,
    _project_service,
    _budget_service,
    _feedback_service,
    _ai_service,
) = _resolve_providers()


# Dependency Resolvers
def get_project_repository() -> AbstractProjectRepository:
    return _project_repo


def get_project_service(
    repo: AbstractProjectRepository = Depends(get_project_repository),
) -> AbstractProjectService:
    return _project_service


def get_budget_repository() -> AbstractBudgetRepository:
    return _budget_repo


def get_budget_service(
    repo: AbstractBudgetRepository = Depends(get_budget_repository),
) -> AbstractBudgetService:
    return _budget_service


def get_feedback_repository() -> AbstractFeedbackRepository:
    return _feedback_repo


def get_feedback_service(
    repo: AbstractFeedbackRepository = Depends(get_feedback_repository),
) -> AbstractFeedbackService:
    return _feedback_service


def get_ai_service() -> AbstractAIService:
    return _ai_service
