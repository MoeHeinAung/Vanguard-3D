# Task ID
TASK-3.4
---
# Title
Add Integration Testing Framework
---
# Status
PLANNING
---
# Priority
HIGH
---
# Type
Testing / QA
---
# Goal
Establish a robust automated testing suite using `pytest` to prevent regressions and validate critical financial logic.
---
# Scope
## Included
- Install `pytest` and `pytest-cov`.
- Configure `pytest.ini`.
- Create `backend/tests/` structure and `conftest.py` with in-memory DB fixture.
- Implement integration tests for `SettlementService` and unit tests for `Validators`.
- Add test script to development workflow.
## Excluded
- Full UI testing.
- End-to-end testing of `pywebview` bridge.
---
# Business Value
- Regression prevention.
- Validates complex financial/settlement calculations.
- Documentation via executable code.
- CI/CD readiness.
---
# Related Features
- Settlement calculations, Data persistence, Request validation.
---
# Dependencies
- `pytest`, `pytest-cov`.
---
# Architectural Constraints
- Tests must be isolated (clean DB state per test).
- Use in-memory SQLite (`:memory:`) to keep tests fast.
- Must not impact production/development `vanguard.db`.
---
# Assumptions
- In-memory database provides sufficient fidelity for functional/integration testing.
---
# Risks
- In-memory DB might miss subtle file-system locking bugs (though these are mitigated by `ConnectionPool`).
- High maintenance overhead for tests if not kept lightweight.
---
# Edge Cases
- Settlement with blacklisted tickets.
- Settlement for draws with zero sales.
- Validation for edge-case Pydantic schemas.
---
# Implementation Plan
## Step 1
Description:
Install dependencies and initialize configuration.
Validation:
- [ ] `pytest` and `pytest-cov` installed.
- [ ] `pytest.ini` created.
---
## Step 2
Description:
Setup test infrastructure (conftest.py and directory).
Validation:
- [ ] In-memory DB fixture functional.
---
## Step 3
Description:
Implement integration tests for Settlement logic and unit tests for Validators.
Validation:
- [ ] Tests covering basic settlement math.
- [ ] Tests covering blacklist deductions.
- [ ] Tests covering Pydantic validation rules.
---
## Step 4
Description:
Run test suite and generate coverage reports.
Validation:
- [ ] All tests pass.
- [ ] Coverage > 80%.
---
# Files Expected To Change
- backend/requirements.txt (Updated)
- backend/pytest.ini (New)
- backend/tests/* (New)
---
# Testing Strategy
- Use isolated in-memory SQLite databases for each test function via `temp_db` fixture.
---
# Acceptance Criteria
- `pytest` executes successfully.
- Integration tests confirm business logic correctness.
- Coverage reports indicate > 80% coverage for domain services.
---
# Anti-Patterns
- Tests depending on real `vanguard.db`.
- Tests sharing global state.
---
# Rollback Plan
- Revert testing dependencies and remove `tests/` directory.
---
# Completion Notes
- Pending.
