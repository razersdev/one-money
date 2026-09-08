from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.services.dashboard_service import get_dashboard
from app.utils.jwt_handler import verify_access_token
from app.database.connection import get_connection


router = APIRouter()

security = HTTPBearer()


@router.get("/dashboard")
def read_dashboard(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_access_token(token)

    email = payload["email"]

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT id FROM users WHERE email = ?",
        (email,)
    )

    user = cursor.fetchone()

    connection.close()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user_id = user[0]

    dashboard = get_dashboard(user_id)

    return {
        "message": "Dashboard retrieved successfully",
        "data": dashboard
    }