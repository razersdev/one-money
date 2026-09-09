from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_create_category_success():

    # Register user
    register_response = client.post(
        "/register",
        json={
            "name": "Category Tester",
            "email": "pytest_category_create@gmail.com",
            "password": "Test12345"
        }
    )

    assert register_response.status_code == 200

    # Login user
    login_response = client.post(
        "/login",
        json={
            "email": "pytest_category_create@gmail.com",
            "password": "Test12345"
        }
    )

    assert login_response.status_code == 200

    access_token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # Create category
    response = client.post(
        "/categories",
        headers=headers,
        json={
            "name": "Food"
        }
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Category created successfully"

    data = response.json()["data"]

    assert data["user_id"] > 0
    assert data["name"] == "Food"

def test_get_categories_success():

    # Register user
    register_response = client.post(
        "/register",
        json={
            "name": "Category Reader",
            "email": "pytest_category_read@gmail.com",
            "password": "Test12345"
        }
    )

    assert register_response.status_code == 200

    # Login user
    login_response = client.post(
        "/login",
        json={
            "email": "pytest_category_read@gmail.com",
            "password": "Test12345"
        }
    )

    assert login_response.status_code == 200

    access_token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # Create category
    create_response = client.post(
        "/categories",
        headers=headers,
        json={
            "name": "Food"
        }
    )

    assert create_response.status_code == 200

    # Get categories
    response = client.get(
        "/categories",
        headers=headers
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Categories retrieved successfully"

    categories = response.json()["data"]

    assert len(categories) == 1
    assert categories[0]["name"] == "Food"

def test_update_category_success():

    # Register user
    register_response = client.post(
        "/register",
        json={
            "name": "Category Updater",
            "email": "pytest_category_update@gmail.com",
            "password": "Test12345"
        }
    )

    assert register_response.status_code == 200

    # Login user
    login_response = client.post(
        "/login",
        json={
            "email": "pytest_category_update@gmail.com",
            "password": "Test12345"
        }
    )

    assert login_response.status_code == 200

    access_token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # Create category
    create_response = client.post(
        "/categories",
        headers=headers,
        json={
            "name": "Food"
        }
    )

    assert create_response.status_code == 200

    category_id = create_response.json()["data"]["id"]

    # Update category
    response = client.put(
        f"/categories/{category_id}",
        headers=headers,
        json={
            "name": "Food & Beverage"
        }
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Category updated successfully"

    data = response.json()["data"]

    assert data["id"] == category_id
    assert data["name"] == "Food & Beverage"

def test_delete_category_success():

    # Register user
    register_response = client.post(
        "/register",
        json={
            "name": "Category Deleter",
            "email": "pytest_category_delete@gmail.com",
            "password": "Test12345"
        }
    )

    assert register_response.status_code == 200

    # Login user
    login_response = client.post(
        "/login",
        json={
            "email": "pytest_category_delete@gmail.com",
            "password": "Test12345"
        }
    )

    assert login_response.status_code == 200

    access_token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # Create category
    create_response = client.post(
        "/categories",
        headers=headers,
        json={
            "name": "Category To Delete"
        }
    )

    assert create_response.status_code == 200

    category_id = create_response.json()["data"]["id"]

    # Delete category
    response = client.delete(
        f"/categories/{category_id}",
        headers=headers
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Category deleted successfully"

    # Verify category no longer exists
    get_response = client.get(
        "/categories",
        headers=headers
    )

    assert get_response.status_code == 200

    categories = get_response.json()["data"]

    assert len(categories) == 0