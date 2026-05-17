# Security & Trust Boundaries

Vanguard-3D is designed as a **Trusted Local Application**.

```mermaid
graph TD
    subgraph Untrusted_Input [Untrusted Surface]
        A[User Input Text]
        B[External CSV Imports]
    end

    subgraph Sandbox [UI Sandbox]
        C[React Frontend]
    end

    subgraph Trust_Boundary [Bridge Barrier]
        D[pywebview Bridge]
    end

    subgraph Trusted_Zone [Backend Environment]
        E[API Validation]
        F[Service Logic]
        G[Filesystem / DB]
    end

    A --> C
    B --> C
    C -- JSON --> D
    D -- Marshaled Objects --> E
    E -- Validated Models --> F
    F --> G
```

### Security Posture
1. **Marshaling Boundary:** No raw strings from the UI are used directly in SQL queries. Data is marshaled through Pydantic models (validation layer) or parameterized SQL (persistence layer).
2. **Local Execution:** The app does not expose a network port (except for the Vite dev server during development). In production, it runs as a closed executable.
3. **No Dynamic Code:** No `eval()` or dynamic code execution in either the JS or Python layers.
4. **Data Isolation:** All operational data is stored in the local `vanguard.db` file.
