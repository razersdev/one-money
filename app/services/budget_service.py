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

    cursor.execute(
        """
        SELECT name
        FROM categories
        WHERE id = ?
        AND user_id = ?
        """,
        (
            budget.category_id,
            user_id
        )
    )

    category = cursor.fetchone()

    category_name = category[0] if category else "Unknown Category"

    cursor.execute(
        """
        SELECT COALESCE(SUM(amount), 0)
        FROM transactions
        WHERE user_id = ?
        AND category = ?
        AND type = 'expense'
        """,
        (
            user_id,
            category_name
        )
    )

    spent = cursor.fetchone()[0]

    connection.close()

    return {
        "id": budget_id,
        "user_id": user_id,
        "category_id": budget.category_id,
        "amount": budget.amount,
        "category_name": category_name,
        "spent": spent
    }


def get_budgets(user_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            b.id,
            b.user_id,
            b.category_id,
            b.amount,
            c.name,
            COALESCE(
                (
                    SELECT SUM(t.amount)
                    FROM transactions t
                    WHERE t.user_id = b.user_id
                    AND t.category = c.name
                    AND t.type = 'expense'
                ),
                0
            ) AS spent
        FROM budgets b
        LEFT JOIN categories c
            ON b.category_id = c.id
            AND b.user_id = c.user_id
        WHERE b.user_id = ?
        ORDER BY b.id DESC
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
            "amount": budget[3],
            "category_name": budget[4] or "Unknown Category",
            "spent": budget[5] or 0
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

    if cursor.rowcount == 0:
        connection.close()
        return None

    connection.commit()

    cursor.execute(
        """
        SELECT name
        FROM categories
        WHERE id = ?
        AND user_id = ?
        """,
        (
            budget.category_id,
            user_id
        )
    )

    category = cursor.fetchone()

    category_name = category[0] if category else "Unknown Category"

    cursor.execute(
        """
        SELECT COALESCE(SUM(amount), 0)
        FROM transactions
        WHERE user_id = ?
        AND category = ?
        AND type = 'expense'
        """,
        (
            user_id,
            category_name
        )
    )

    spent = cursor.fetchone()[0]

    connection.close()

    return {
        "id": budget_id,
        "user_id": user_id,
        "category_id": budget.category_id,
        "amount": budget.amount,
        "category_name": category_name,
        "spent": spent
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

    if cursor.rowcount == 0:
        connection.close()
        return None

    connection.commit()

    connection.close()

    return {
        "id": budget_id,
        "message": "Budget deleted"
    }