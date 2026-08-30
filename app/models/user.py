from pydantic import BaseModel, Field, EmailStr


class UserRegister(BaseModel):

    name: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=8)