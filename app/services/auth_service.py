import bcrypt

from fastapi import HTTPException, status

from app.models.user import UserRegister, UserLogin
from app.database.connection import get_connection
from app.utils.jwt_handler import create_access_token


def register_user(user: UserRegister):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE email = ?",
        (user.email,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        connection.close()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email sudah terdaftar"
        )

    hashed_password = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt()
    )

    cursor.execute(
        """
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
        """,
        (
            user.name,
            user.email,
            hashed_password
        )
    )

    connection.commit()
    connection.close()

    return {
        "name": user.name,
        "email": user.email
    }


def login_user(user: UserLogin):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE email = ?",
        (user.email,)
    )

    existing_user = cursor.fetchone()

    if not existing_user:
        connection.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah"
        )

    stored_password = existing_user[3]

    password_match = bcrypt.checkpw(
        user.password.encode("utf-8"),
        stored_password
    )

    if not password_match:
        connection.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah"
        )

    connection.close()

    access_token = create_access_token(
        {
            "email": user.email
        }
    )

    return {
        "message": "Login berhasil",
        "access_token": access_token,
        "token_type": "bearer"
    }