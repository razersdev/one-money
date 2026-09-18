from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth
from app.routers import transaction
from app.routers import category
from app.routers import budget
from app.routers import dashboard
from app.routers import report

from app.database.init_db import init_db


app = FastAPI()

init_db()


# =========================
# CORS CONFIGURATION
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# ROUTERS
# =========================

app.include_router(
    auth.router,
    prefix="/auth"
)

app.include_router(transaction.router)
app.include_router(category.router)
app.include_router(budget.router)
app.include_router(dashboard.router)
app.include_router(report.router)


# =========================
# ROOT
# =========================

@app.get("/")
def home():

    return {
        "message": "Welcome to One Money API"
    }


@app.get("/about")
def about():

    return {
        "message": "One Money is a personal finance management API"
    }


@app.get("/health")
def health_check():

    return {
        "status": "ok",
        "service": "One Money API"
    }


@app.get("/version")
def version():

    return {
        "name": "One Money API",
        "version": "1.0.0"
    }