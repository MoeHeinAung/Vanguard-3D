# Backend Service Architecture

The backend follows a **DDD-lite** (Domain-Driven Design) pattern, where logic is separated into discrete domain services.

```mermaid
graph LR
    subgraph API_Entry [API Bridge]
        A[main.py:API]
    end

    subgraph Validators [Validation Layer]
        B[DrawValidator]
        C[AgentValidator]
    end

    subgraph Services [Business Logic]
        D[DrawService]
        E[AgentService]
        F[SettlementService]
        G[SaleService]
    end

    subgraph Repositories [Data Abstraction]
        H[DrawRepository]
        I[AgentRepository]
        J[BaseRepository]
    end

    subgraph DB [Persistence]
        K[ConnectionPool]
        L[(SQLite3)]
    end

    A --> B
    A --> D
    D --> H
    H --> K
    K --> L
    
    A --> C
    A --> E
    E --> I
    I --> K

    A --> F
    F --> K
    
    A --> G
    G --> K
```

### Key Components
- **API Bridge (`main.py`):** Acts as the controller. It instantiates the graph and handles exception translation for the frontend.
- **Service Layer:** Responsible for domain constraints (e.g., "only one open draw"). It coordinates multiple repositories if needed.
- **Repository Layer:** Encapsulates raw SQL queries. It ensures that data returned to services is in a standard dictionary format.
- **Connection Pool:** Manages thread-local SQLite connections to prevent locking issues in the pywebview environment.
