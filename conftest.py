import os
import pytest

from tests.test_database import init_test_db, clear_test_db


@pytest.fixture(autouse=True)
def setup_test_database(monkeypatch):

    monkeypatch.setenv("DATABASE_NAME", "test_one_money.db")

    init_test_db()
    clear_test_db()