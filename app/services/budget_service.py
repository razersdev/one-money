from app.models.budget import BudgetCreate
from app.database.connection import get_connection


def create_budget(user_id: int, budget: BudgetCreate):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO budgets (
            user_id,
            category_id,
            amount
        )
        VALUES (?, ?, ?)
        """,
        (
            user_id,
            budget.category_id,
            budget.amount
        )
    )

    connection.commit()

    budget_id = cursor.lastrowid

    connection.close()

    return {
        "id": budget_id,
        "user_id": user_id,
        "category_id": budget.category_id,
        "amount": budget.amount
    }


def get_budgets(user_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            id,
            user_id,
            category_id,
            amount
        FROM budgets
        WHERE user_id = ?
        ORDER BY id DESC
        """,
        (user_id,)
    )

    budgets = cursor.fetchall()

    connection.close()

    result = []

    for budget in budgets:
        result.append({
            "id": budget[0],
            "user_id": budget[1],
            "category_id": budget[2],
            "amount": budget[3]
        })

    return result


def update_budget(
    user_id: int,
    budget_id: int,
    budget: BudgetCreate
):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE budgets
        SET
            category_id = ?,
            amount = ?
        WHERE id = ?
        AND user_id = ?
        """,
        (
            budget.category_id,
            budget.amount,
            budget_id,
            user_id
        )
    )

    connection.commit()

    connection.close()

    return {
        "id": budget_id,
        "user_id": user_id,
        "category_id": budget.category_id,
        "amount": budget.amount
    }


def delete_budget(user_id: int, budget_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        DELETE FROM budgets
        WHERE id = ?
        AND user_id = ?
        """,
        (
            budget_id,
            user_id
        )
    )

    connection.commit()

    connection.close()

    return {
        "id": budget_id,
        "message": "Budget deleted"
    }