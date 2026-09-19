import sqlite3


def init_db():
    connection = sqlite3.connect("one_money.db")

    cursor = connection.cursor()

    # =========================
    # TABEL USERS
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    """)

    # =========================
    # TABEL CATEGORIES
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,

            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    # =========================
    # CATEGORY TYPE MIGRATION
    # =========================

    try:
        cursor.execute("""
            ALTER TABLE categories
            ADD COLUMN type TEXT NOT NULL DEFAULT 'expense'
        """)
    except sqlite3.OperationalError:
        # Kolom type sudah ada
        pass

    # =========================
    # TABEL BUDGETS
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS budgets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            category_id INTEGER NOT NULL,
            amount REAL NOT NULL,

            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )
    """)

    # =========================
    # TABEL TRANSACTIONS
    # =========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            amount REAL NOT NULL,
            description TEXT,
            category TEXT NOT NULL,
            created_at TEXT NOT NULL,

            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    connection.commit()
    connection.close()


init_db()