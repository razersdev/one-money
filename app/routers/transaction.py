from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.models.transaction import TransactionCreate
from app.services.transaction_service import create_transaction, get_transactions
from app.utils.jwt_handler import verify_access_token
from app.database.connection import get_connection


router = APIRouter()

security = HTTPBearer()


@router.post("/transactions")
def add_transaction(
    transaction: TransactionCreate,
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

    result = create_transaction(
        user_id,
        transaction
    )

    return {
        "message": "Transaction created successfully",
        "data": result
    }


@router.get("/transactions")
def read_transactions(
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

    transactions = get_transactions(user_id)

    return {
        "message": "Transactions retrieved successfully",
        "data": transactions
    }