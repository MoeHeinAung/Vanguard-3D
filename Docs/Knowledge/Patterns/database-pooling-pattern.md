# Database Connection Pooling Pattern

## Rationale
In high-concurrency environments like `pywebview`, opening and closing SQLite connections per operation creates overhead and intermittent file locks ("database is locked"). A persistent pool ensures safe, performant concurrent access by reusing existing connections and managing thread-safety.

## Enforcement Guidance
- Use the `ConnectionPool` singleton for all database access.
- Always use the context manager pattern (`with db.get_connection() as conn:`) to ensure connections are returned to the pool, preventing leaks.

## Implementation Pattern
```python
# In DatabaseManager
def get_connection(self):
    return PooledConnection(self.pool)

# Usage
with db.get_connection() as conn:
    cursor = conn.cursor()
    cursor.execute(...)
```

## Anti-Patterns
- **Manual Connections**: Calling `sqlite3.connect` directly.
- **Leaking Connections**: Getting a connection and not returning it to the pool (or not using the context manager).

## Validation Strategy
- **Concurrency Test**: Run stress tests with multiple threads simulating high-frequency reads and writes.
- **Connection Health**: Periodically check connection status via `SELECT 1` in the return method.
