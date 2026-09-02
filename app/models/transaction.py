from pydantic import BaseModel


class TransactionCreate(BaseModel):
    type: str
    amount: float
    description: str
    category: str