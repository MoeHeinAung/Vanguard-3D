import pytest
import os
import tempfile
from backend.database.manager import DatabaseManager
from backend.repositories.draw_repository import DrawRepository
from backend.services.draw_service import DrawService
from backend.services.settlement_service import SettlementService

@pytest.fixture(scope='function')
def temp_db():
    """
    Creates a temporary SQLite database file for each test.
    Ensures tests are isolated.
    """
    fd, db_path = tempfile.mkstemp()
    os.close(fd)
    
    db_manager = DatabaseManager(db_path, max_connections=1)
    
    # Initialize Schema
    with db_manager.get_connection() as conn:
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
            CREATE TABLE IF NOT EXISTS blacklist_tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                draw_id INTEGER NOT NULL,
                ticket TEXT NOT NULL,
                type TEXT NOT NULL, -- 'HALF' or 'BLOCK'
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (draw_id) REFERENCES draws (id)
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS winning_tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                draw_id INTEGER NOT NULL,
                ticket TEXT NOT NULL,
                type TEXT NOT NULL, -- 'Jackpot' or 'Minor'
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (draw_id) REFERENCES draws (id)
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
        ''')
        conn.commit()
    
    yield db_manager
    
    # Cleanup
    if os.path.exists(db_path):
        try:
            os.remove(db_path)
        except PermissionError:
            pass # Windows sometimes holds file handles a bit longer

@pytest.fixture
def draw_repo(temp_db):
    return DrawRepository(temp_db)

@pytest.fixture
def draw_service(draw_repo):
    return DrawService(draw_repo)

@pytest.fixture
def settlement_service(temp_db):
    return SettlementService(temp_db)
