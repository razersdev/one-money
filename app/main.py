from fastapi import FastAPI

from app.routers import auth
from app.routers import transaction
from app.routers import category

from app.database.init_db import init_db


app = FastAPI()

init_db()

app.include_router(auth.router)
app.include_router(transaction.router)
app.include_router(category.router)


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