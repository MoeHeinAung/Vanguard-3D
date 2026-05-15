# Incident ID
INC-001
---
# Title
500 Internal Server Error in Bridge Communication
---
# Status
ACTIVE
---
# Severity
MEDIUM
---
# Category
API
---
# Date
2026-05-15
---
# Related Feature
Sale Management (TASK-004)
---
# Symptom
API call via `callPython` returns 500 Internal Server Error in the browser console.
---
# Error Message
500 (Internal Server Error)
---
# Root Cause
The backend `API` methods (`get_draws`, `get_agents`) are likely throwing unhandled exceptions when called by the new `SalesPage.jsx` component. This can be caused by missing dependencies, incorrect database queries, or silent failures in Python services that are not propagated to the bridge properly.
---
# Architectural Mistake
The `API` class in `main.py` lacks generic try-except blocks, causing all internal errors to bubble up as raw 500 responses without meaningful logs or messages for debugging.
---
# Trigger Conditions
Component mount triggered fetching logic that failed to find expected data or experienced a database schema mismatch.
---
# Prevention Principles
- Always implement robust error handling in the `API` class methods.
- Bridge calls must log server-side errors to the console or file.
- Validate data availability (e.g., empty DB) before processing.
---
# Mandatory Prevention Rules
- All `API` methods must wrap logic in `try-except` blocks.
- Log all backend exceptions to `stderr` or a log file.
- Provide descriptive error messages in exceptions.
---
# Anti-Patterns
- Unprotected `API` methods that allow exceptions to crash the bridge process.
- Silent backend failures.
---
# Validation Checklist
* [ ] Verify backend `API` methods have try-except wrapping.
* [ ] Check if `DatabaseManager` tables are correctly initialized.
* [ ] Validate `SalesPage` state logic for empty response.
