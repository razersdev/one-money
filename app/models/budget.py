from pydantic import BaseModel, Field


class BudgetCreate(BaseModel):
    category_id: int
    amount: float = Field(gt=0)