import sqlite3
import os

class DatabaseManager:
    def __init__(self, db_path='backend/database/vanguard.db'):
        self.db_path = db_path
        # Ensure directory exists
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self.init_db()

    def get_connection(self):
        return sqlite3.connect(self.db_path)

    def init_db(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS draws (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    draw_date TEXT NOT NULL,
                    cutoff_time TEXT NOT NULL,
                    status TEXT NOT NULL,
                    notes TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            conn.commit()
