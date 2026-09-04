from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.models.category import CategoryCreate
from app.services.category_service import (
    create_category,
    get_categories,
    update_category,
    delete_category
)
from app.utils.jwt_handler import verify_access_token
from app.database.connection import get_connection


router = APIRouter()

security = HTTPBearer()


@router.post("/categories")
def add_category(
    category: CategoryCreate,
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

    result = create_category(
        user_id,
        category
    )

    return {
        "message": "Category created successfully",
        "data": result
    }


@router.get("/categories")
def read_categories(
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

    categories = get_categories(user_id)

    return {
        "message": "Categories retrieved successfully",
        "data": categories
    }


@router.put("/categories/{category_id}")
def edit_category(
    category_id: int,
    category: CategoryCreate,
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

    result = update_category(
        user_id,
        category_id,
        category
    )

    return {
        "message": "Category updated successfully",
        "data": result
    }


@router.delete("/categories/{category_id}")
def remove_category(
    category_id: int,
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

    result = delete_category(
        user_id,
        category_id
    )

    return {
        "message": "Category deleted successfully",
        "data": result
    }