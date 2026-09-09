import os
import sqlite3


def get_connection(db_name=None):

    if db_name is None:
        db_name = os.getenv("DATABASE_NAME", "one_money.db")

    connection = sqlite3.connect(db_name)

    return connection