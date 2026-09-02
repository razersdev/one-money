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
- Protected transaction endpoint
- Transaction automatically linked to authenticated user

## Upcoming Features

- View transactions
- Category management
- Budget management
- Dashboard
- Financial reports

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

## Project Status

Currently under development.