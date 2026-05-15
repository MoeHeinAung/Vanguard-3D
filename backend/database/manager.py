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
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS agents (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    commission REAL NOT NULL,
                    jp_factor REAL NOT NULL,
                    sp_factor REAL NOT NULL,
                    notes TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS master_dealers (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    commission REAL NOT NULL,
                    jp_factor REAL NOT NULL,
                    sp_factor REAL NOT NULL,
                    notes TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS sales (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    draw_id INTEGER NOT NULL,
                    agent_id TEXT NOT NULL,
                    ticket TEXT NOT NULL,
                    amount REAL NOT NULL,
                    notes TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (draw_id) REFERENCES draws (id),
                    FOREIGN KEY (agent_id) REFERENCES agents (id)
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS offloaded_tickets (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    draw_id INTEGER NOT NULL,
                    master_dealer_id TEXT NOT NULL,
                    ticket TEXT NOT NULL,
                    amount REAL NOT NULL,
                    notes TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (draw_id) REFERENCES draws (id),
                    FOREIGN KEY (master_dealer_id) REFERENCES master_dealers (id)
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS settings (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL
                )
            ''')
            # Initialize default settings if not exists
            cursor.execute('INSERT OR IGNORE INTO settings (key, value) VALUES ("admin_hold", "5000")')
            cursor.execute('INSERT OR IGNORE INTO settings (key, value) VALUES ("max_offload_amount", "10000")')
            cursor.execute('INSERT OR IGNORE INTO settings (key, value) VALUES ("max_offload_ticket", "10")')
            conn.commit()
