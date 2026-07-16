from pydantic import BaseModel, Field
from typing import List


class BudgetAllocation(BaseModel):
    department: str = Field(..., description="Municipal division title")
    allocated: float = Field(..., description="Total set budget limit")
    spent: float = Field(..., description="Total spent to date")


class BudgetSummaryResponse(BaseModel):
    fiscal_year: int = Field(..., description="Approved budget fiscal year")
    total_budget: float = Field(..., description="Sum of allocations")
    allocations: List[BudgetAllocation] = Field(
        ..., description="Detailed list by division"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "fiscal_year": 2026,
                "total_budget": 45000000.00,
                "allocations": [
                    {
                        "department": "Education",
                        "allocated": 18000000.00,
                        "spent": 12400000.00,
                    }
                ],
            }
        }
    }
