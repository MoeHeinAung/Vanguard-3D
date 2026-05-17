# Modernization Plan

1. **Contract-First Development:** Define a shared schema (JSON Schema) that generates TypeScript types for the frontend and Pydantic models for the backend, replacing manual data structures.
2. **Asynchronous Architecture:** Migrate bridge communication to an async pattern to prevent UI locking during heavy processing.
3. **DI Refactoring:** Implement a lightweight dependency injection framework (e.g., `injector` in Python) to simplify the service graph.
