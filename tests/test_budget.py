from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_create_budget_success():

    # Register user
    register_response = client.post(
        "/register",
        json={
            "name": "Budget Tester",
            "email": "pytest_budget_create@gmail.com",
            "password": "Test12345"
        }
    )

    assert register_response.status_code == 200

    # Login user
    login_response = client.post(
        "/login",
        json={
            "email": "pytest_budget_create@gmail.com",
            "password": "Test12345"
        }
    )

    assert login_response.status_code == 200

    access_token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # Create category first
    category_response = client.post(
        "/categories",
        headers=headers,
        json={
            "name": "Food"
        }
    )

    assert category_response.status_code == 200

    category_id = category_response.json()["data"]["id"]

    # Create budget
    response = client.post(
        "/budgets",
        headers=headers,
        json={
            "category_id": category_id,
            "amount": 1000000
        }
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Budget created successfully"

    data = response.json()["data"]

    assert data["user_id"] > 0
    assert data["category_id"] == category_id
    assert data["amount"] == 1000000

def test_get_budgets_success():

    # Register user
    register_response = client.post(
        "/register",
        json={
            "name": "Budget Reader",
            "email": "pytest_budget_read@gmail.com",
            "password": "Test12345"
        }
    )

    assert register_response.status_code == 200

    # Login user
    login_response = client.post(
        "/login",
        json={
            "email": "pytest_budget_read@gmail.com",
            "password": "Test12345"
        }
    )

    assert login_response.status_code == 200

    access_token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # Create category
    category_response = client.post(
        "/categories",
        headers=headers,
        json={
            "name": "Food"
        }
    )

    assert category_response.status_code == 200

    category_id = category_response.json()["data"]["id"]

    # Create budget
    create_response = client.post(
        "/budgets",
        headers=headers,
        json={
            "category_id": category_id,
            "amount": 1000000
        }
    )

    assert create_response.status_code == 200

    # Get budgets
    response = client.get(
        "/budgets",
        headers=headers
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Budgets retrieved successfully"

    budgets = response.json()["data"]

    assert len(budgets) == 1
    assert budgets[0]["user_id"] > 0
    assert budgets[0]["category_id"] == category_id
    assert budgets[0]["amount"] == 1000000

def test_update_budget_success():

    # Register user
    register_response = client.post(
        "/register",
        json={
            "name": "Budget Updater",
            "email": "pytest_budget_update@gmail.com",
            "password": "Test12345"
        }
    )

    assert register_response.status_code == 200

    # Login user
    login_response = client.post(
        "/login",
        json={
            "email": "pytest_budget_update@gmail.com",
            "password": "Test12345"
        }
    )

    assert login_response.status_code == 200

    access_token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # Create first category
    category_response = client.post(
        "/categories",
        headers=headers,
        json={
            "name": "Food"
        }
    )

    assert category_response.status_code == 200

    category_id = category_response.json()["data"]["id"]

    # Create second category
    second_category_response = client.post(
        "/categories",
        headers=headers,
        json={
            "name": "Transport"
        }
    )

    assert second_category_response.status_code == 200

    second_category_id = second_category_response.json()["data"]["id"]

    # Create budget
    create_response = client.post(
        "/budgets",
        headers=headers,
        json={
            "category_id": category_id,
            "amount": 1000000
        }
    )

    assert create_response.status_code == 200

    budget_id = create_response.json()["data"]["id"]

    # Update budget
    response = client.put(
        f"/budgets/{budget_id}",
        headers=headers,
        json={
            "category_id": second_category_id,
            "amount": 1500000
        }
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Budget updated successfully"

    data = response.json()["data"]

    assert data["id"] == budget_id
    assert data["category_id"] == second_category_id
    assert data["amount"] == 1500000

def test_delete_budget_success():

    # Register user
    register_response = client.post(
        "/register",
        json={
            "name": "Budget Deleter",
            "email": "pytest_budget_delete@gmail.com",
            "password": "Test12345"
        }
    )

    assert register_response.status_code == 200

    # Login user
    login_response = client.post(
        "/login",
        json={
            "email": "pytest_budget_delete@gmail.com",
            "password": "Test12345"
        }
    )

    assert login_response.status_code == 200

    access_token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # Create category
    category_response = client.post(
        "/categories",
        headers=headers,
        json={
            "name": "Food"
        }
    )

    assert category_response.status_code == 200

    category_id = category_response.json()["data"]["id"]

    # Create budget
    create_response = client.post(
        "/budgets",
        headers=headers,
        json={
            "category_id": category_id,
            "amount": 1000000
        }
    )

    assert create_response.status_code == 200

    budget_id = create_response.json()["data"]["id"]

    # Delete budget
    response = client.delete(
        f"/budgets/{budget_id}",
        headers=headers
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Budget deleted successfully"

    # Verify budget no longer exists
    get_response = client.get(
        "/budgets",
        headers=headers
    )

    assert get_response.status_code == 200

    budgets = get_response.json()["data"]

    assert len(budgets) == 0