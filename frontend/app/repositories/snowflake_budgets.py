import random
from typing import Dict, Any, List
from app.repositories.budgets import AbstractBudgetRepository
from app.db.snowflake import execute_snowflake_query, execute_snowflake_write


class SnowflakeBudgetRepository(AbstractBudgetRepository):
    def get_budget_summary(self) -> Dict[str, Any]:
        query = (
            "SELECT FISCAL_YEAR, DEPARTMENT, ALLOCATED, SPENT "
            "FROM BUDGETS ORDER BY ALLOCATED DESC"
        )
        rows = execute_snowflake_query(query)

        if not rows:
            return {
                "fiscal_year": 2026,
                "total_budget": 0.0,
                "allocations": [],
            }

        fiscal_year = int(rows[0].get("fiscal_year", 2026))
        allocations: List[Dict[str, Any]] = []
        total_budget = 0.0

        for row in rows:
            allocated = float(row.get("allocated", 0.0))
            spent = float(row.get("spent", 0.0))
            total_budget += allocated

            allocations.append(
                {
                    "department": row.get("department", ""),
                    "allocated": allocated,
                    "spent": spent,
                }
            )

        return {
            "fiscal_year": fiscal_year,
            "total_budget": total_budget,
            "allocations": allocations,
        }

    def create_budget_allocation(self, budget_data: Dict[str, Any]) -> Dict[str, Any]:
        budget_id = f"BDG-2026-{random.randint(10, 99)}"
        fiscal_year = int(budget_data.get("fiscal_year", 2026))
        department = budget_data.get("department", "")
        allocated = float(budget_data.get("allocated", 0.0))
        spent = float(budget_data.get("spent", 0.0))

        query = (
            "INSERT INTO BUDGETS (ID, FISCAL_YEAR, DEPARTMENT, ALLOCATED, SPENT) "
            "VALUES (%s, %s, %s, %s, %s)"
        )
        params = (budget_id, fiscal_year, department, allocated, spent)

        execute_snowflake_write(query, params)

        return {
            "id": budget_id,
            "fiscal_year": fiscal_year,
            "department": department,
            "allocated": allocated,
            "spent": spent,
        }

