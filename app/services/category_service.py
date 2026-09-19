from app.models.category import CategoryCreate
from app.database.connection import get_connection


def create_category(user_id: int, category: CategoryCreate):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO categories (
            user_id,
            name,
            type
        )
        VALUES (?, ?, ?)
        """,
        (
            user_id,
            category.name,
            category.type
        )
    )

    connection.commit()

    category_id = cursor.lastrowid

    connection.close()

    return {
        "id": category_id,
        "user_id": user_id,
        "name": category.name,
        "type": category.type
    }


def get_categories(user_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            id,
            user_id,
            name,
            type
        FROM categories
        WHERE user_id = ?
        ORDER BY id DESC
        """,
        (user_id,)
    )

    categories = cursor.fetchall()

    connection.close()

    result = []

    for category in categories:
        result.append({
            "id": category[0],
            "user_id": category[1],
            "name": category[2],
            "type": category[3]
        })

    return result


def update_category(
    user_id: int,
    category_id: int,
    category: CategoryCreate
):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE categories
        SET
            name = ?,
            type = ?
        WHERE id = ?
        AND user_id = ?
        """,
        (
            category.name,
            category.type,
            category_id,
            user_id
        )
    )

    if cursor.rowcount == 0:
        connection.close()
        return None

    connection.commit()

    connection.close()

    return {
        "id": category_id,
        "user_id": user_id,
        "name": category.name,
        "type": category.type
    }


def delete_category(user_id: int, category_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        DELETE FROM categories
        WHERE id = ?
        AND user_id = ?
        """,
        (
            category_id,
            user_id
        )
    )

    if cursor.rowcount == 0:
        connection.close()
        return None

    connection.commit()

    connection.close()

    return {
        "id": category_id,
        "message": "Category deleted"
    }