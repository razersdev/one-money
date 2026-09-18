from datetime import datetime

from app.database.connection import get_connection


def get_total_income(user_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT COALESCE(SUM(amount), 0)
        FROM transactions
        WHERE user_id = ?
        AND LOWER(type) = 'income'
    """, (user_id,))

    total_income = cursor.fetchone()[0]

    connection.close()

    return total_income


def get_total_expense(user_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT COALESCE(SUM(amount), 0)
        FROM transactions
        WHERE user_id = ?
        AND LOWER(type) = 'expense'
    """, (user_id,))

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

    cursor.execute("""
        SELECT category, SUM(amount)
        FROM transactions
        WHERE user_id = ?
        AND LOWER(type) = 'expense'
        GROUP BY category
        ORDER BY SUM(amount) DESC
    """, (user_id,))

    expenses = cursor.fetchall()

    connection.close()

    result = {}

    for expense in expenses:
        result[expense[0]] = expense[1]

    return result


def get_monthly_financial_overview(user_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            strftime('%Y-%m', created_at) AS month,
            LOWER(type) AS type,
            COALESCE(SUM(amount), 0) AS total
        FROM transactions
        WHERE user_id = ?
        GROUP BY month, type
        ORDER BY month ASC
    """, (user_id,))

    rows = cursor.fetchall()

    connection.close()

    monthly_data = {}

    for month, transaction_type, total in rows:
        if month not in monthly_data:
            monthly_data[month] = {
                "income": 0,
                "expense": 0
            }

        if transaction_type == "income":
            monthly_data[month]["income"] = total

        elif transaction_type == "expense":
            monthly_data[month]["expense"] = total

    # Generate the last 6 months
    current_date = datetime.now()

    months = []

    year = current_date.year
    month = current_date.month

    for _ in range(6):
        months.append((year, month))

        month -= 1

        if month == 0:
            month = 12
            year -= 1

    months.reverse()

    result = []

    month_names = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ]

    for year, month in months:
        month_key = f"{year:04d}-{month:02d}"

        data = monthly_data.get(
            month_key,
            {
                "income": 0,
                "expense": 0
            }
        )

        result.append({
            "month": month_names[month - 1],
            "income": data["income"],
            "expense": data["expense"]
        })

    return result


def get_dashboard(user_id: int):
    total_income = get_total_income(user_id)
    total_expense = get_total_expense(user_id)
    balance = get_balance(user_id)
    expense_by_category = get_expense_by_category(user_id)
    financial_overview = get_monthly_financial_overview(user_id)

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "expense_by_category": expense_by_category,
        "financial_overview": financial_overview
    }