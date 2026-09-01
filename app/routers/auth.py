from fastapi import APIRouter

from app.models.user import UserRegister, UserLogin
from app.services.auth_service import register_user, login_user

router = APIRouter()


@router.post("/register")
def register(user: UserRegister):
    result = register_user(user)

    return {
        "message": "User registered successfully",
        "data": result
    }


@router.post("/login")
def login(user: UserLogin):
    result = login_user(user)

    return result