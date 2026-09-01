from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.models.user import UserRegister, UserLogin
from app.services.auth_service import register_user, login_user
from app.utils.jwt_handler import verify_access_token


router = APIRouter()

security = HTTPBearer()


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


@router.get("/me")
def get_me(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_access_token(token)

    return {
        "message": "Token valid",
        "user": payload
    }