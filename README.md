# One Money

One Money adalah aplikasi personal finance management untuk membantu pengguna mengelola keuangan.

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

## Upcoming Features

- Testing
- Documentation & deployment

## Tech Stack

- Python
- FastAPI
- SQLite
- Pydantic
- bcrypt
- JWT

## API Endpoints

### Authentication

- `POST /register`
- `POST /login`
- `GET /me`

### Transactions

- `POST /transactions`
- `GET /transactions`
- `PUT /transactions/{transaction_id}`
- `DELETE /transactions/{transaction_id}`

### Categories

- `POST /categories`
- `GET /categories`
- `PUT /categories/{category_id}`
- `DELETE /categories/{category_id}`

### Budgets

- `POST /budgets`
- `GET /budgets`
- `PUT /budgets/{budget_id}`
- `DELETE /budgets/{budget_id}`

### Dashboard

- `GET /dashboard`

### Financial Reports

- `GET /reports`

## Project Status

Currently under development.

### Backend Progress

- Authentication — Complete
- Transaction CRUD — Complete
- Transaction Filtering — Complete
- Category System — Complete
- Budget System — Complete
- Dashboard Logic — Complete
- Financial Reports — Complete
- Validation & Error Handling — Complete
- Testing — Upcoming
- Documentation & Deployment — Upcoming