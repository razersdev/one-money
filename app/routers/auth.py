from fastapi import APIRouter
from app.models.user import UserRegister
from app.services.auth_service import register_user

router = APIRouter()


@router.post("/register")
def register(user: UserRegister):
    registered_user = register_user(user)

    return {
        "message": "User registered successfully",
        "data": registered_user
    }