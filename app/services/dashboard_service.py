from app.database.connection import get_connection


def get_total_income(user_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT COALESCE(SUM(amount), 0)
        FROM transactions
        WHERE user_id = ?
        AND LOWER(type) = 'income'
        """,
        (user_id,)
    )

    total_income = cursor.fetchone()[0]

    connection.close()

    return total_income

def get_total_expense(user_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT COALESCE(SUM(amount), 0)
        FROM transactions
        WHERE user_id = ?
        AND LOWER(type) = 'expense'
        """,
        (user_id,)
    )

    total_expense = cursor.fetchone()[0]

    connection.close()

    return total_expense

def get_balance(user_id: int):

    total_income = get_total_income(user_id)
    total_expense = get_total_expense(user_id)

    balance = total_income - total_expense

    return balance

def get_expense_by_category(user_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            category,
            SUM(amount)
        FROM transactions
        WHERE user_id = ?
        AND LOWER(type) = 'expense'
        GROUP BY category
        ORDER BY SUM(amount) DESC
        """,
        (user_id,)
    )

    expenses = cursor.fetchall()

    connection.close()

    result = {}

    for expense in expenses:
        result[expense[0]] = expense[1]

    return result

def get_dashboard(user_id: int):

    total_income = get_total_income(user_id)
    total_expense = get_total_expense(user_id)
    balance = get_balance(user_id)
    expense_by_category = get_expense_by_category(user_id)

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "expense_by_category": expense_by_category
    }