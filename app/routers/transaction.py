from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.models.transaction import TransactionCreate
from app.services.transaction_service import (
    create_transaction,
    get_transactions,
    update_transaction,
    delete_transaction,
    get_filtered_transactions
)
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
    transaction_type: str = None,
    category: str = None,
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

    transactions = get_filtered_transactions(
        user_id,
        transaction_type,
        category
    )

    return {
        "message": "Transactions retrieved successfully",
        "data": transactions
    }


@router.put("/transactions/{transaction_id}")
def edit_transaction(
    transaction_id: int,
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

    result = update_transaction(
        user_id,
        transaction_id,
        transaction
    )

    return {
        "message": "Transaction updated successfully",
        "data": result
    }


@router.delete("/transactions/{transaction_id}")
def remove_transaction(
    transaction_id: int,
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

    result = delete_transaction(
        user_id,
        transaction_id
    )

    return {
        "message": "Transaction deleted successfully",
        "data": result
    }