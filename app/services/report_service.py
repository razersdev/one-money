from app.database.connection import get_connection


def get_total_income_by_period(
    user_id: int,
    start_date: str,
    end_date: str
):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT COALESCE(SUM(amount), 0)
        FROM transactions
        WHERE user_id = ?
        AND LOWER(type) = 'income'
        AND DATE(created_at) BETWEEN DATE(?) AND DATE(?)
        """,
        (
            user_id,
            start_date,
            end_date
        )
    )

    total_income = cursor.fetchone()[0]

    connection.close()

    return total_income


def get_total_expense_by_period(
    user_id: int,
    start_date: str,
    end_date: str
):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT COALESCE(SUM(amount), 0)
        FROM transactions
        WHERE user_id = ?
        AND LOWER(type) = 'expense'
        AND DATE(created_at) BETWEEN DATE(?) AND DATE(?)
        """,
        (
            user_id,
            start_date,
            end_date
        )
    )

    total_expense = cursor.fetchone()[0]

    connection.close()

    return total_expense


def get_balance_by_period(
    user_id: int,
    start_date: str,
    end_date: str
):

    total_income = get_total_income_by_period(
        user_id,
        start_date,
        end_date
    )

    total_expense = get_total_expense_by_period(
        user_id,
        start_date,
        end_date
    )

    balance = total_income - total_expense

    return balance


def get_income_by_category(
    user_id: int,
    start_date: str,
    end_date: str
):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            category,
            SUM(amount)
        FROM transactions
        WHERE user_id = ?
        AND LOWER(type) = 'income'
        AND DATE(created_at) BETWEEN DATE(?) AND DATE(?)
        GROUP BY category
        ORDER BY SUM(amount) DESC
        """,
        (
            user_id,
            start_date,
            end_date
        )
    )

    incomes = cursor.fetchall()

    connection.close()

    result = {}

    for income in incomes:
        result[income[0]] = income[1]

    return result


def get_expense_by_category(
    user_id: int,
    start_date: str,
    end_date: str
):

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
        AND DATE(created_at) BETWEEN DATE(?) AND DATE(?)
        GROUP BY category
        ORDER BY SUM(amount) DESC
        """,
        (
            user_id,
            start_date,
            end_date
        )
    )

    expenses = cursor.fetchall()

    connection.close()

    result = {}

    for expense in expenses:
        result[expense[0]] = expense[1]

    return result


def get_financial_report(
    user_id: int,
    start_date: str,
    end_date: str
):

    total_income = get_total_income_by_period(
        user_id,
        start_date,
        end_date
    )

    total_expense = get_total_expense_by_period(
        user_id,
        start_date,
        end_date
    )

    balance = get_balance_by_period(
        user_id,
        start_date,
        end_date
    )

    income_by_category = get_income_by_category(
        user_id,
        start_date,
        end_date
    )

    expense_by_category = get_expense_by_category(
        user_id,
        start_date,
        end_date
    )

    return {
        "start_date": start_date,
        "end_date": end_date,
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "income_by_category": income_by_category,
        "expense_by_category": expense_by_category
    }