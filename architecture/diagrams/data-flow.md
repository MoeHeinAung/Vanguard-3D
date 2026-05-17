# Request Lifecycle & Data Flow

This diagram traces a typical "Create Sale" request from the UI to the Database.

```mermaid
sequenceDiagram
    participant UI as React: SalesPage
    participant Bridge as JS: callPython()
    participant API as Python: API.create_sales()
    participant Svc as Python: SaleService
    participant Util as Python: TicketParser
    participant Pool as Python: ConnectionPool
    participant DB as SQLite: vanguard.db

    UI->>Bridge: bridge.create_sales(data)
    Bridge->>API: JSON Serialization
    API->>Svc: create_sales(draw_id, agent_id, text)
    Svc->>Util: parse_tickets(text)
    Util-->>Svc: List[TicketData]
    Svc->>Pool: with db.get_connection()
    Pool->>DB: BEGIN TRANSACTION
    Svc->>DB: INSERT INTO sales (...)
    DB-->>Svc: rowid
    Pool->>DB: COMMIT
    Svc-->>API: Success Status
    API-->>Bridge: JSON Response
    Bridge-->>UI: Promise.resolve(result)
```

### Data Integrity Measures
1. **At-Source Validation:** Input text is parsed and validated by the `TicketParser` utility before any DB operations occur.
2. **Transaction Integrity:** All writes use Python's `with` context manager on the connection pool, ensuring automatic COMMIT/ROLLBACK.
3. **Thread Safety:** The `ConnectionPool` ensures that pywebview's concurrent JS execution threads do not collide on a single SQLite handle.
