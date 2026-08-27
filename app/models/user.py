from pydantic import BaseModel


class UserRegister(BaseModel):
    name: str
    email: str
    password: str