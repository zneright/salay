from abc import ABC, abstractmethod
from typing import Dict, Any

class AbstractBudgetRepository(ABC):
    @abstractmethod
    def get_budget_summary(self) -> Dict[str, Any]:
        pass

class MockBudgetRepository(AbstractBudgetRepository):
    def __init__(self) -> None:
        self._summary = {
            "fiscal_year": 2026,
            "total_budget": 45000000.00,
            "allocations": [
                { "department": "Education & Schools", "allocated": 18000000.00, "spent": 12400000.00 },
                { "department": "Public Safety (Police & Fire)", "allocated": 12000000.00, "spent": 8100000.00 },
                { "department": "Infrastructure & Roadways", "allocated": 10000000.00, "spent": 9500000.00 },
                { "department": "Parks, Health & Recreation", "allocated": 5000000.00, "spent": 3200000.00 }
            ]
        }

    def get_budget_summary(self) -> Dict[str, Any]:
        return self._summary
