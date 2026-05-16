# Incident ID
INC-009
---
# Title
Windows Temp-File Handling in Pytest Fixtures
---
# Status
RESOLVED
---
# Severity
LOW
---
# Category
Testing / Environment
---
# Date
2026-05-16
---
# Related Feature
Automated Integration Tests (TASK-3.4)
---
# Symptom
Pytest fixture setup failed with `FileNotFoundError: [WinError 3] The system cannot find the path specified: ''` when initializing `DatabaseManager`.
---
# Root Cause
The `DatabaseManager` used `os.path.dirname(db_path)` to ensure a directory existed. When `:memory:` was passed as the `db_path` (a common SQLite in-memory pattern), `os.path.dirname` returned an empty string, which `os.makedirs` attempted to create, causing a `FileNotFoundError` on Windows.
---
# Architectural Mistake
The `DatabaseManager` assumed all paths were file-system paths and did not account for the SQLite in-memory database URI (`:memory:`).
---
# Prevention Principles
- Database initialization logic must verify if the path is a file-system path before performing OS operations like `os.makedirs`.
- Test fixtures should simulate the environment's actual persistence behavior (e.g., using `tempfile.mkstemp()` on Windows is safer than assuming file paths).
---
# Mandatory Prevention Rules
- `DatabaseManager` must skip `os.makedirs` if the provided `db_path` is `:memory:`.
- Test fixtures must use `tempfile` modules for temporary file creation rather than hardcoded paths or `os.makedirs` calls.
---
# Resolution Summary
Updated `DatabaseManager.__init__` to skip directory creation if `db_path == ':memory:'`. Updated `conftest.py` to use `tempfile.mkstemp()` for robust isolated file generation during integration tests.
---
# Validation Checklist
* [x] Test infrastructure fixed to handle Windows temp files correctly.
* [x] Database manager logic updated to detect in-memory databases.
