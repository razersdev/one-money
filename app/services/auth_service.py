from app.models.user import UserRegister
from app.database.connection import get_connection


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
        return {
            "error": "Email sudah terdaftar"
        }

    cursor.execute(
        """
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
        """,
        (user.name, user.email, user.password)
    )

    connection.commit()
    connection.close()

    return {
        "name": user.name,
        "email": user.email
    }