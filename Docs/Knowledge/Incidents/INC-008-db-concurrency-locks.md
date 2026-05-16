# Incident ID
INC-008
---
# Title
Database Concurrency Locks and Threading Issues
---
# Status
RESOLVED
---
# Severity
HIGH
---
# Category
Database / Performance
---
# Date
2026-05-16
---
# Related Feature
All Data Operations (Draws, Sales, Offloads)
---
# Symptom
Intermittent "database is locked" errors and potential runtime crashes during concurrent UI actions.
---
# Root Cause
The previous implementation opened a new `sqlite3` connection for every database operation without a pool. This caused resource contention and locking issues under concurrent access, especially because `pywebview` runs the Python backend in a separate thread from the UI thread, leading to SQLite thread-safety violations (`check_same_thread=True` default).
---
# Architectural Mistake
Directly managing database connections per operation instead of using a thread-safe connection pool singleton.
---
# Prevention Principles
- Database connection management must be centralized through a singleton pool.
- SQLite connections must be configured for multi-threaded usage in a `pywebview` environment.
- Use WAL (Write-Ahead Logging) mode to allow concurrent reads and writes.
---
# Mandatory Prevention Rules
- Always use `ConnectionPool` singleton via `DatabaseManager`.
- Connections MUST be used within a `with db.get_connection() as conn:` context manager.
- SQLite connections MUST set `check_same_thread=False`.
---
# Anti-Patterns
- Manual `sqlite3.connect` calls.
- Failing to use `with` context managers for connections.
---
# Resolution Summary
Implemented a singleton `ConnectionPool` in `backend/database/pool.py`, configured WAL mode and `busy_timeout`, and refactored `DatabaseManager` to distribute pooled connections.
---
# Validation Checklist
* [x] Connection pool implemented and verified.
* [x] WAL mode enabled.
* [x] Concurrency stress test passed.
