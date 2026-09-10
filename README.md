# One Money

One Money adalah aplikasi personal finance management berbasis REST API yang membantu pengguna mengelola pemasukan, pengeluaran, kategori, budget, dan laporan keuangan.

Project ini dibangun sebagai backend application menggunakan FastAPI dan SQLite, dengan authentication berbasis JWT serta automated testing menggunakan Pytest.

## Project Overview

### Main Goals

- Mengelola transaksi keuangan pengguna
- Mengelola kategori dan budget
- Menyediakan dashboard keuangan
- Menyediakan laporan keuangan berdasarkan periode
- Mengamankan endpoint menggunakan JWT authentication
- Menyediakan automated testing untuk memastikan fitur berjalan dengan baik

## Current Features

### Authentication

- User registration
- Password hashing with bcrypt
- User login
- JWT authentication
- Protected endpoints

### Transaction Management

- Create transaction
- View transactions
- Update transaction
- Delete transaction
- Transaction automatically linked to authenticated user
- Filter transactions by type
- Filter transactions by category
- Combined filtering by type and category
- Case-insensitive filtering

### Category Management

- Create category
- View categories
- Update category
- Delete category
- Categories automatically linked to authenticated user

### Budget Management

- Create budget
- View budgets
- Update budget
- Delete budget
- Budgets automatically linked to authenticated user

### Dashboard

- Total income
- Total expense
- Balance calculation
- Expense summary by category

### Financial Reports

- Financial report by date range
- Total income by period
- Total expense by period
- Balance by period
- Income summary by category
- Expense summary by category

### Validation & Error Handling

- Transaction amount validation
- Transaction type validation
- Transaction description validation
- Transaction category validation
- Category name validation
- Budget amount validation
- Resource not found handling
- User not found handling
- HTTP 404 error responses

### Testing

- Pytest test suite
- Test database isolation
- Authentication tests
- Transaction CRUD tests
- Category CRUD tests
- Budget CRUD tests
- Dashboard tests
- Financial report tests
- Full test suite: 19/19 tests passed

## Tech Stack

- Python
- FastAPI
- SQLite
- Pydantic
- bcrypt
- JWT
- Pytest

## Project Structure

```text
one-money/
│
├── app/
│   ├── database/
│   │   ├── connection.py
│   │   └── init_db.py
│   │
│   ├── models/
│   │   ├── budget.py
│   │   ├── category.py
│   │   ├── transaction.py
│   │   └── user.py
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   ├── budget.py
│   │   ├── category.py
│   │   ├── dashboard.py
│   │   ├── report.py
│   │   └── transaction.py
│   │
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── budget_service.py
│   │   ├── category_service.py
│   │   ├── dashboard_service.py
│   │   ├── report_service.py
│   │   └── transaction_service.py
│   │
│   ├── utils/
│   │   └── jwt_handler.py
│   │
│   ├── __init__.py
│   └── main.py
│
├── tests/
│   ├── test_auth.py
│   ├── test_budget.py
│   ├── test_category.py
│   ├── test_dashboard.py
│   ├── test_database.py
│   ├── test_main.py
│   ├── test_report.py
│   └── test_transaction.py
│
├── conftest.py
├── pytest.ini
├── README.md
└── .gitignore