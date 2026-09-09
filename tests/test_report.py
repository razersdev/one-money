from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_get_financial_report_success():

    # Register user
    register_response = client.post(
        "/register",
        json={
            "name": "Report Tester",
            "email": "pytest_report@gmail.com",
            "password": "Test12345"
        }
    )

    assert register_response.status_code == 200

    # Login user
    login_response = client.post(
        "/login",
        json={
            "email": "pytest_report@gmail.com",
            "password": "Test12345"
        }
    )

    assert login_response.status_code == 200

    access_token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # Create income
    income_response = client.post(
        "/transactions",
        headers=headers,
        json={
            "type": "income",
            "amount": 5000000,
            "description": "Gaji",
            "category": "Salary"
        }
    )

    assert income_response.status_code == 200

    # Create expense
    expense_response = client.post(
        "/transactions",
        headers=headers,
        json={
            "type": "expense",
            "amount": 1000000,
            "description": "Makan",
            "category": "Food"
        }
    )

    assert expense_response.status_code == 200

    # Create another expense
    second_expense_response = client.post(
        "/transactions",
        headers=headers,
        json={
            "type": "expense",
            "amount": 500000,
            "description": "Transport",
            "category": "Transport"
        }
    )

    assert second_expense_response.status_code == 200

    # Get financial report
    response = client.get(
        "/reports",
        headers=headers,
        params={
            "start_date": "2000-01-01",
            "end_date": "2100-12-31"
        }
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Financial report retrieved successfully"

    data = response.json()["data"]

    assert data["start_date"] == "2000-01-01"
    assert data["end_date"] == "2100-12-31"

    assert data["total_income"] == 5000000
    assert data["total_expense"] == 1500000
    assert data["balance"] == 3500000

    assert data["income_by_category"]["Salary"] == 5000000

    assert data["expense_by_category"]["Food"] == 1000000
    assert data["expense_by_category"]["Transport"] == 500000