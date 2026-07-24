from abc import ABC, abstractmethod
from typing import Dict, Any


class AbstractBudgetRepository(ABC):
    @abstractmethod
    def get_budget_summary(self) -> Dict[str, Any]:
        pass

    @abstractmethod
    def create_budget_allocation(self, budget_data: Dict[str, Any]) -> Dict[str, Any]:
        pass

