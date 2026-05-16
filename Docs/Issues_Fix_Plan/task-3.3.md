Task 3.3: Implement Database Connection Pooling
🎯 Objective
Replace the "create-new-connection-per-operation" pattern with a Thread-Safe Connection Pool. This prevents SQLite database is locked errors under concurrent load, reduces overhead, and prepares the architecture for high-scalability scenarios.
⚠️ Critical Context: SQLite & Threading
SQLite has specific threading modes. By default, pywebview runs the Python backend in a separate thread from the UI. Without a proper pool configured for check_same_thread=False, you will encounter runtime crashes.
🏗️ Architecture Change
Before: Service → sqlite3.connect() (New connection every time, high latency, lock risks)
After: Service → ConnectionPool.get() → Reused Connection (Low latency, thread-safe)
📋 Prerequisites
Completion of Task 1.3 (Foreign Keys)
Understanding of Python threading and queue modules
🚀 Step-by-Step Execution Plan
Step 1: Create the Connection Pool Module
Create /workspace/backend/database/pool.py. This implements a fixed-size pool using queue.Queue for thread safety.
python
import sqlite3
import queue
import threading
from typing import Optional

class ConnectionPool:
    """
    Thread-safe connection pool for SQLite.
    Prevents 'database is locked' errors and reduces connection overhead.
    """
    
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, db_path: str, max_connections: int = 10):
        # Singleton pattern to ensure only one pool exists per DB path
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    instance = super().__new__(cls)
                    instance._initialize(db_path, max_connections)
                    cls._instance = instance
        return cls._instance

    def _initialize(self, db_path: str, max_connections: int):
        self.db_path = db_path
        self.pool = queue.Queue(maxsize=max_connections)
        self._local = threading.local() # Track connection per thread if needed
        
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
            new_conn = self._create_connection()
            self.pool.put(new_conn)

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
Step 2: Update Database Manager
Refactor /workspace/backend/database/manager.py to use the new pool instead of direct sqlite3.connect.
python
from .pool import ConnectionPool, PooledConnection

class DatabaseManager:
    def __init__(self, db_path: str, max_connections: int = 10):
        self.db_path = db_path
        # Initialize the singleton pool
        self.pool = ConnectionPool(db_path, max_connections)

    def get_connection(self):
        """
        Returns a context manager that yields a pooled connection.
        Usage: with db.get_connection() as conn: ...
        """
        return PooledConnection(self.pool)
Step 3: Verify Service Compatibility
No changes required in your Service files (agent_service.py, sale_service.py, etc.) if they already use the context manager pattern:
python
# This pattern works automatically with the new pool
with self.db.get_connection() as conn:
    cursor = conn.cursor()
    # ...
# Connection is automatically returned to pool here
If any service manually calls sqlite3.connect or conn.close(), refactor them to use with self.db.get_connection() as conn:.
Step 4: Configure WAL Mode (One-Time Setup)
Although the pool sets journal_mode=WAL on new connections, it's best to ensure the DB file itself is initialized correctly.
Add a startup script or run once manually:
bash
cd /workspace/backend
python -c "import sqlite3; c=sqlite3.connect('vanguard.db'); c.execute('PRAGMA journal_mode=WAL'); c.close()"
Note: WAL mode creates -wal and -shm sidecar files. Do not delete them.
Step 5: Stress Test Concurrency
Simulate concurrent access to verify the pool prevents locking errors.
Test Script (test_pool.py):
python
import threading
from database.manager import DatabaseManager

db = DatabaseManager('vanguard.db', max_connections=5)

def worker(worker_id):
    try:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM agents")
            count = cursor.fetchone()[0]
            print(f"Worker {worker_id}: Found {count} agents")
    except Exception as e:
        print(f"Worker {worker_id} FAILED: {e}")

threads = []
for i in range(20): # Spawn 20 threads for a pool of 5
    t = threading.Thread(target=worker, args=(i,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()

print("Stress test completed successfully.")
✅ Completion Checklist
database/pool.py created with ConnectionPool class
check_same_thread=False configured (Critical for pywebview)
PRAGMA journal_mode=WAL enabled for concurrency
PRAGMA busy_timeout set to handle transient locks
DatabaseManager refactored to initialize the pool
All services verified to use with db.get_connection() pattern
Stress test passed without "database is locked" errors
💡 Strategic Benefits
Concurrency Safety: Eliminates OperationalError: database is locked during simultaneous UI actions.
Performance: Reusing connections saves the overhead of file opening/closing and parsing PRAGMAs every time.
Resource Control: max_connections cap prevents the app from spawning unlimited threads/connections, crashing the OS.
Scalability Foundation: The code structure now mimics production-grade pools (like PostgreSQL's PgBouncer), making future DB migrations smoother.
⚠️ Troubleshooting
"Database is locked" persists: Ensure all code paths use the with statement. Any manual connect() without close() will steal a connection from the pool forever.
"check_same_thread" error: Verify check_same_thread=False is present in _create_connection.
WAL files missing: Ensure the first connection successfully executed PRAGMA journal_mode=WAL.