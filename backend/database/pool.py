import sqlite3
import queue
import threading
from typing import Optional

class ConnectionPool:
    """
    Thread-safe connection pool for SQLite.
    Prevents 'database is locked' errors and reduces connection overhead.
    """
    
    _instances = {}
    _lock = threading.Lock()

    def __new__(cls, db_path: str, max_connections: int = 10):
        # Singleton pattern per DB path
        with cls._lock:
            if db_path not in cls._instances:
                instance = super().__new__(cls)
                instance._initialize(db_path, max_connections)
                cls._instances[db_path] = instance
        return cls._instances[db_path]

    def _initialize(self, db_path: str, max_connections: int):
        self.db_path = db_path
        self.pool = queue.Queue(maxsize=max_connections)
        
        # Pre-populate pool
        for _ in range(max_connections):
            conn = self._create_connection()
            self.pool.put(conn)

    def _create_connection(self) -> sqlite3.Connection:
        """
        Creates a new SQLite connection with optimized settings for threading.
        """
        # check_same_thread=False is CRITICAL for pywebview (UI thread vs Python thread)
        conn = sqlite3.connect(self.db_path, check_same_thread=False)
        
        # Enable Foreign Keys (Task 1.3 requirement)
        conn.execute('PRAGMA foreign_keys = ON')
        
        # Optimize for WAL (Write-Ahead Logging) - allows concurrent reads/writes
        conn.execute('PRAGMA journal_mode=WAL')
        
        # Busy timeout (ms) - wait if DB is locked before failing
        conn.execute('PRAGMA busy_timeout=5000')
        
        return conn

    def get_connection(self) -> sqlite3.Connection:
        """
        Retrieves a connection from the pool. Blocks if none available.
        """
        try:
            return self.pool.get(timeout=10) # Timeout prevents infinite hanging
        except queue.Empty:
            raise RuntimeError("Database connection pool exhausted. Try increasing max_connections.")

    def return_connection(self, conn: sqlite3.Connection):
        """
        Returns a connection to the pool for reuse.
        """
        # Basic health check before returning
        try:
            conn.execute('SELECT 1')
            self.pool.put(conn)
        except sqlite3.Error:
            # If connection is broken, create a new one to replace it
            try:
                new_conn = self._create_connection()
                self.pool.put(new_conn)
            except Exception:
                pass # Pool will be smaller, but we can't do much here

    def close_all(self):
        """Gracefully shutdown all connections."""
        while not self.pool.empty():
            conn = self.pool.get_nowait()
            conn.close()

# Context Manager Helper
class PooledConnection:
    def __init__(self, pool: ConnectionPool):
        self.pool = pool
        self.conn = None

    def __enter__(self):
        self.conn = self.pool.get_connection()
        return self.conn

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.conn:
            self.pool.return_connection(self.conn)
