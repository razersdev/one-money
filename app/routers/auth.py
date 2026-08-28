from fastapi import APIRouter
from app.models.user import UserRegister
from app.services.auth_service import register_user

router = APIRouter()


@router.post("/register")
def register(user: UserRegister):
    result = register_user(user)

    if "error" in result:
        return result

    return {
        "message": "User registered successfully",
        "data": result
    }