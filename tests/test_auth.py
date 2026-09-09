from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_register_success():

    response = client.post(
        "/register",
        json={
            "name": "Test User",
            "email": "pytest_register_success@gmail.com",
            "password": "Test12345"
        }
    )

    assert response.status_code == 200
    assert response.json()["message"] == "User registered successfully"


def test_register_duplicate_email():

    client.post(
        "/register",
        json={
            "name": "Test User",
            "email": "pytest_duplicate@gmail.com",
            "password": "Test12345"
        }
    )

    response = client.post(
        "/register",
        json={
            "name": "Another User",
            "email": "pytest_duplicate@gmail.com",
            "password": "Test12345"
        }
    )

    assert response.status_code == 409
    assert response.json() == {
        "detail": "Email sudah terdaftar"
    }


def test_login_success():

    client.post(
        "/register",
        json={
            "name": "Test User",
            "email": "pytest_login@gmail.com",
            "password": "Test12345"
        }
    )

    response = client.post(
        "/login",
        json={
            "email": "pytest_login@gmail.com",
            "password": "Test12345"
        }
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Login berhasil"
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_get_me_success():

    client.post(
        "/register",
        json={
            "name": "Test User",
            "email": "pytest_me@gmail.com",
            "password": "Test12345"
        }
    )

    login_response = client.post(
        "/login",
        json={
            "email": "pytest_me@gmail.com",
            "password": "Test12345"
        }
    )

    assert login_response.status_code == 200

    access_token = login_response.json()["access_token"]

    response = client.get(
        "/me",
        headers={
            "Authorization": f"Bearer {access_token}"
        }
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Token valid"
    assert response.json()["user"]["email"] == "pytest_me@gmail.com"