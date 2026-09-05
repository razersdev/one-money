from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.models.budget import BudgetCreate
from app.services.budget_service import (
    create_budget,
    get_budgets,
    update_budget,
    delete_budget
)
from app.utils.jwt_handler import verify_access_token
from app.database.connection import get_connection


router = APIRouter()

security = HTTPBearer()


@router.post("/budgets")
def add_budget(
    budget: BudgetCreate,
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

    result = create_budget(
        user_id,
        budget
    )

    return {
        "message": "Budget created successfully",
        "data": result
    }


@router.get("/budgets")
def read_budgets(
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

    budgets = get_budgets(user_id)

    return {
        "message": "Budgets retrieved successfully",
        "data": budgets
    }


@router.put("/budgets/{budget_id}")
def edit_budget(
    budget_id: int,
    budget: BudgetCreate,
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

    result = update_budget(
        user_id,
        budget_id,
        budget
    )

    return {
        "message": "Budget updated successfully",
        "data": result
    }


@router.delete("/budgets/{budget_id}")
def remove_budget(
    budget_id: int,
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

    result = delete_budget(
        user_id,
        budget_id
    )

    return {
        "message": "Budget deleted successfully",
        "data": result
    }