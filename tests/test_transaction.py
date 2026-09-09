from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_create_transaction_success():

    # Register user
    register_response = client.post(
        "/register",
        json={
            "name": "Transaction Tester",
            "email": "pytest_transaction@gmail.com",
            "password": "Test12345"
        }
    )

    assert register_response.status_code == 200

    # Login user
    login_response = client.post(
        "/login",
        json={
            "email": "pytest_transaction@gmail.com",
            "password": "Test12345"
        }
    )

    assert login_response.status_code == 200

    access_token = login_response.json()["access_token"]

    # Create transaction
    response = client.post(
        "/transactions",
        headers={
            "Authorization": f"Bearer {access_token}"
        },
        json={
            "type": "expense",
            "amount": 50000,
            "description": "Makan siang",
            "category": "Food"
        }
    )

    assert response.status_code == 200

    assert response.json()["message"] == "Transaction created successfully"

    data = response.json()["data"]

    assert data["type"] == "expense"
    assert data["amount"] == 50000
    assert data["description"] == "Makan siang"
    assert data["category"] == "Food"

def test_get_transactions_success():

    # Register user
    register_response = client.post(
        "/register",
        json={
            "name": "Transaction Reader",
            "email": "pytest_transaction_read@gmail.com",
            "password": "Test12345"
        }
    )

    assert register_response.status_code == 200

    # Login user
    login_response = client.post(
        "/login",
        json={
            "email": "pytest_transaction_read@gmail.com",
            "password": "Test12345"
        }
    )

    assert login_response.status_code == 200

    access_token = login_response.json()["access_token"]

    # Create transaction
    create_response = client.post(
        "/transactions",
        headers={
            "Authorization": f"Bearer {access_token}"
        },
        json={
            "type": "expense",
            "amount": 75000,
            "description": "Beli buku",
            "category": "Education"
        }
    )

    assert create_response.status_code == 200

    # Get transactions
    response = client.get(
        "/transactions",
        headers={
            "Authorization": f"Bearer {access_token}"
        }
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Transactions retrieved successfully"

    transactions = response.json()["data"]

    assert len(transactions) == 1
    assert transactions[0]["type"] == "expense"
    assert transactions[0]["amount"] == 75000
    assert transactions[0]["description"] == "Beli buku"
    assert transactions[0]["category"] == "Education"

def test_update_transaction_success():

    # Register user
    register_response = client.post(
        "/register",
        json={
            "name": "Transaction Updater",
            "email": "pytest_transaction_update@gmail.com",
            "password": "Test12345"
        }
    )

    assert register_response.status_code == 200

    # Login user
    login_response = client.post(
        "/login",
        json={
            "email": "pytest_transaction_update@gmail.com",
            "password": "Test12345"
        }
    )

    assert login_response.status_code == 200

    access_token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # Create transaction
    create_response = client.post(
        "/transactions",
        headers=headers,
        json={
            "type": "expense",
            "amount": 50000,
            "description": "Makan siang",
            "category": "Food"
        }
    )

    assert create_response.status_code == 200

    transaction_id = create_response.json()["data"]["id"]

    # Update transaction
    response = client.put(
        f"/transactions/{transaction_id}",
        headers=headers,
        json={
            "type": "expense",
            "amount": 75000,
            "description": "Makan malam",
            "category": "Food"
        }
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Transaction updated successfully"

    data = response.json()["data"]

    assert data["id"] == transaction_id
    assert data["amount"] == 75000
    assert data["description"] == "Makan malam"
    assert data["category"] == "Food"

def test_delete_transaction_success():

    # Register user
    register_response = client.post(
        "/register",
        json={
            "name": "Transaction Deleter",
            "email": "pytest_transaction_delete@gmail.com",
            "password": "Test12345"
        }
    )

    assert register_response.status_code == 200

    # Login user
    login_response = client.post(
        "/login",
        json={
            "email": "pytest_transaction_delete@gmail.com",
            "password": "Test12345"
        }
    )

    assert login_response.status_code == 200

    access_token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # Create transaction
    create_response = client.post(
        "/transactions",
        headers=headers,
        json={
            "type": "expense",
            "amount": 50000,
            "description": "Transaksi untuk dihapus",
            "category": "Food"
        }
    )

    assert create_response.status_code == 200

    transaction_id = create_response.json()["data"]["id"]

    # Delete transaction
    response = client.delete(
        f"/transactions/{transaction_id}",
        headers=headers
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Transaction deleted successfully"

    # Verify transaction no longer exists
    get_response = client.get(
        "/transactions",
        headers=headers
    )

    assert get_response.status_code == 200

    transactions = get_response.json()["data"]

    assert len(transactions) == 0