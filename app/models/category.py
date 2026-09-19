from typing import Literal
from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    name: str = Field(min_length=1)
    type: Literal["income", "expense"]