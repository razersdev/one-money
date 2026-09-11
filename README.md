# One Money

One Money adalah aplikasi **personal finance management** berbasis REST API yang membantu pengguna mengelola pemasukan, pengeluaran, kategori, budget, dan laporan keuangan.

Project ini dibangun dengan fokus pada backend application menggunakan **FastAPI dan SQLite**, authentication berbasis **JWT**, automated testing menggunakan **Pytest**, serta frontend berbasis **React + Vite**.

> 🚧 One Money is currently under development.

---

## Project Overview

### Main Goals

- Mengelola transaksi keuangan pengguna
- Mengelola kategori transaksi
- Mengelola budget pengguna
- Menyediakan dashboard keuangan
- Menyediakan laporan keuangan berdasarkan periode
- Mengamankan endpoint menggunakan JWT authentication
- Menyediakan automated testing
- Menyediakan frontend dashboard yang clean, simple, dan responsive
- Menyiapkan application environment menggunakan Docker

---

## Current Features

### Authentication

- User registration
- Password hashing with bcrypt
- User login
- JWT authentication
- Protected endpoints
- Authentication-based resource ownership

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
- Full test suite: **19/19 tests passed**

---

## Frontend

The One Money frontend is built using **React + Vite**.

The current frontend foundation includes:

- React + Vite setup
- React Router
- Axios
- Recharts
- Lucide React
- Main application layout
- Sidebar navigation
- Dashboard page
- Financial summary cards
- Financial overview chart
- Recent transactions section
- Responsive layout foundation

### Frontend UI Direction

The visual direction of One Money focuses on:

- Clean
- Simple
- Professional
- Elegant
- Functional
- Responsive
- Minimal use of colors
- Financial dashboard-oriented interface

The final visual identity, logo, accent color, and dark mode will be developed in later stages.

---

## Tech Stack

### Backend

- Python
- FastAPI
- SQLite
- Pydantic
- bcrypt
- JWT
- Pytest

### Frontend

- React
- Vite
- React Router
- Axios
- Recharts
- Lucide React

### Development & Deployment

- Git
- GitHub
- Docker
- Docker Compose

---

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
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── Sidebar.jsx
│   │   ├── hooks/
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Login.jsx
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .gitignore
├── conftest.py
├── pytest.ini
└── README.md
```

---

## Architecture

```text
                    ONE MONEY
                        │
          ┌─────────────┴─────────────┐
          │                           │
          ▼                           ▼
   React Frontend              FastAPI Backend
      (Vite)                       (REST API)
          │                           │
          │        HTTP / JSON        │
          └─────────────┬─────────────┘
                        │
                        ▼
                   SQLite Database
```

The backend is responsible for:

- Business logic
- Authentication
- Authorization
- Validation
- Data processing
- Database interaction
- Financial calculations

The frontend is responsible for:

- User interface
- Dashboard visualization
- User interaction
- API communication
- Responsive presentation

---

## API Overview

The backend provides REST API endpoints for:

```text
/auth
/transactions
/categories
/budgets
/dashboard
/reports
```

Basic HTTP method mapping:

```text
GET     → Read data
POST    → Create data
PUT     → Update data
DELETE  → Delete data
```

Protected resources require authentication using JWT.

---

## Development

### Backend

Create and activate the Python virtual environment:

```bash
python -m venv venv
```

Activate on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the FastAPI development server:

```bash
uvicorn app.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

### Frontend

Move into the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

### Frontend Production Build

```bash
cd frontend
npm run build
```

The production build will be generated inside:

```text
frontend/dist/
```

---

## Docker

One Money is prepared to run using Docker.

Build and start the application:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d --build
```

Stop the containers:

```bash
docker compose down
```

Docker is used to provide a consistent application environment and simplify deployment.

---

## Environment Variables

Sensitive configuration should be stored in a `.env` file.

Example:

```env
SECRET_KEY=your-secret-key
```

The `.env` file is excluded from Git using `.gitignore`.

> Never commit real secrets, passwords, or private keys to the repository.

---

## Testing

Run the complete test suite:

```bash
pytest
```

Current test status:

```text
19/19 tests passed
```

Testing currently covers:

- Authentication
- Database
- Transactions
- Categories
- Budgets
- Dashboard
- Financial reports
- Main application endpoints

---

## Git & Versioning

The project uses Git for version control and GitHub as the remote repository.

Current backend release:

```text
v1.0.0
```

Frontend development is currently continuing on the main branch.

---

## Current Development Status

```text
Backend
├── FastAPI                  ✅
├── Authentication           ✅
├── JWT                      ✅
├── Transaction CRUD         ✅
├── Category CRUD            ✅
├── Budget CRUD              ✅
├── Dashboard                ✅
├── Financial Reports        ✅
├── Validation               ✅
├── Automated Testing         ✅
├── Docker                    ✅
└── v1.0.0                    ✅

Frontend
├── React + Vite              ✅
├── React Router              ✅
├── Axios                     ✅
├── Recharts                  ✅
├── Lucide React               ✅
├── Application Layout        ✅
├── Sidebar                   ✅
├── Dashboard Foundation     ✅
├── Financial Cards           ✅
├── Financial Chart           ✅
├── Recent Transactions       ✅
├── Responsive Foundation    ✅
└── API Integration           ⏳
```

---

## Roadmap

### Frontend

- [x] React + Vite foundation
- [x] Application layout
- [x] Sidebar navigation
- [x] Dashboard foundation
- [x] Financial summary cards
- [x] Financial chart
- [x] Recent transactions
- [x] Responsive foundation
- [ ] Final visual identity
- [ ] Logo
- [ ] Authentication UI
- [ ] API integration
- [ ] Real transaction data
- [ ] Budget interface
- [ ] Financial reports interface
- [ ] Dark mode
- [ ] Frontend testing

### Backend

- [x] REST API
- [x] Authentication
- [x] Authorization
- [x] CRUD operations
- [x] Dashboard
- [x] Financial reports
- [x] Validation
- [x] Automated testing
- [x] Docker preparation
- [x] Version 1.0.0

### Future

- [ ] Production deployment
- [ ] Database migration strategy
- [ ] CI/CD
- [ ] Monitoring
- [ ] Performance optimization
- [ ] Production security hardening

---

## Project Status

**One Money is currently under active development.**

The backend foundation has been completed and the frontend foundation is currently being developed and integrated with the backend API.

The long-term goal is to build a complete, reliable, and professional personal finance management application.

---

## License

This project is currently developed as a personal learning and portfolio project.