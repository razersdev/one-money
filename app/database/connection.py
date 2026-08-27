import sqlite3


def get_connection(): # bisa di pakai bagian lain ketika membutuhkan koneksi ke database
    connection = sqlite3.connect("one_money.db")
    return connection