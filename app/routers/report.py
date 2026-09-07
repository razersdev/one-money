from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.services.report_service import get_financial_report
from app.utils.jwt_handler import verify_access_token
from app.database.connection import get_connection


router = APIRouter()

security = HTTPBearer()


@router.get("/reports")
def read_financial_report(
    start_date: str,
    end_date: str,
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
        return {
            "message": "User not found"
        }

    user_id = user[0]

    report = get_financial_report(
        user_id,
        start_date,
        end_date
    )

    return {
        "message": "Financial report retrieved successfully",
        "data": report
    }