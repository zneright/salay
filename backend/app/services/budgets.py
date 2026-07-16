from abc import ABC, abstractmethod
from typing import Dict, Any
from app.repositories.budgets import AbstractBudgetRepository


class AbstractBudgetService(ABC):
    @abstractmethod
    def retrieve_budget_summary(self) -> Dict[str, Any]:
        pass


class MockBudgetService(AbstractBudgetService):
    def __init__(self, repository: AbstractBudgetRepository) -> None:
        self._repository = repository

    def retrieve_budget_summary(self) -> Dict[str, Any]:
        return self._repository.get_budget_summary()
