# Technical Debt Report

- **Bridge Type Safety:** No shared schema definition (e.g., JSON Schema/Protobuf) between frontend/backend, relies on dynamic object pass-through.
- **Manual DI:** Service instantiation in `main.py` is brittle and difficult to test in isolation without full instantiation overhead.
- **Concurrency:** SQLite connection pooling is robust, but still a single-file contention point for heavy write-heavy operations.
- **UI Blocking:** Intensive calculations (settlement/offloading) are synchronous, potentially impacting UI responsiveness (needs async transition).
