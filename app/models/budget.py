from pydantic import BaseModel


class BudgetCreate(BaseModel):
    category_id: int
    amount: float