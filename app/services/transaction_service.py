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