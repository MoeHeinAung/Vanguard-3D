import sqlite3

class SettingsService:
    def __init__(self, db):
        self.db = db

    def get_setting(self, key, default=None):
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT value FROM settings WHERE key = ?', (key,))
            row = cursor.fetchone()
            return row[0] if row else default

    def update_setting(self, key, value):
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO settings (key, value) 
                VALUES (?, ?) 
                ON CONFLICT(key) DO UPDATE SET value = excluded.value
            ''', (key, str(value)))
            conn.commit()
        return True
