from app.models.transaction import TransactionCreate
from app.database.connection import get_connection


def create_transaction(user_id: int, transaction: TransactionCreate):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO transactions (
            user_id,
            type,
            amount,
            description,
            category,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, datetime('now'))
        """,
        (
            user_id,
            transaction.type,
            transaction.amount,
            transaction.description,
            transaction.category
        )
    )

    connection.commit()

    transaction_id = cursor.lastrowid

    connection.close()

    return {
        "id": transaction_id,
        "user_id": user_id,
        "type": transaction.type,
        "amount": transaction.amount,
        "description": transaction.description,
        "category": transaction.category
    }


def get_transactions(user_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            id,
            user_id,
            type,
            amount,
            description,
            category,
            created_at
        FROM transactions
        WHERE user_id = ?
        ORDER BY created_at DESC
        """,
        (user_id,)
    )

    transactions = cursor.fetchall()

    connection.close()

    result = []

    for transaction in transactions:
        result.append({
            "id": transaction[0],
            "user_id": transaction[1],
            "type": transaction[2],
            "amount": transaction[3],
            "description": transaction[4],
            "category": transaction[5],
            "created_at": transaction[6]
        })

    return result


def update_transaction(
    user_id: int,
    transaction_id: int,
    transaction: TransactionCreate
):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE transactions
        SET
            type = ?,
            amount = ?,
            description = ?,
            category = ?
        WHERE id = ?
        AND user_id = ?
        """,
        (
            transaction.type,
            transaction.amount,
            transaction.description,
            transaction.category,
            transaction_id,
            user_id
        )
    )

    connection.commit()

    connection.close()

    return {
        "id": transaction_id,
        "user_id": user_id,
        "type": transaction.type,
        "amount": transaction.amount,
        "description": transaction.description,
        "category": transaction.category
    }