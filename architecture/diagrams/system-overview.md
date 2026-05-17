# System Overview Architecture

```mermaid
graph TD
    subgraph Frontend [React UI Layer]
        A[Dashboard] --> B[Draws Page]
        A --> C[Sales Engine]
        A --> D[Risk Management]
    end

    subgraph Bridge [pywebview Bridge]
        E[API Bridge Class]
    end

    subgraph Backend [Python Service Layer]
        F[Draw Service]
        G[Sale Service]
        H[Settlement Service]
        I[Offload Service]
    end

    subgraph Persistence [SQLite Storage]
        J[Connection Pool]
        K[(vanguard.db)]
    end

    B -- Sync Call --> E
    C -- Sync Call --> E
    D -- Sync Call --> E
    
    E --> F
    E --> G
    E --> H
    E --> I
    
    F --> J
    G --> J
    H --> J
    I --> J
    
    J --> K
```

### Architectural Principles
1. **Bridge-Only IO:** All frontend-to-backend communication must pass through the `API` class in `main.py`. No direct filesystem or network access from the UI.
2. **Synchronous Execution:** Bridge calls are synchronous by default to simplify state management in the local context.
3. **Repository Abstraction:** Services do not execute SQL. They delegate data persistence to specialized Repositories or the Connection Pool.
4. **Local-First Design:** Optimized for single-user desktop usage with zero external server dependencies.
