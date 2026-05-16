# Testing Framework

This project uses `pytest` for automated backend testing.

## Running Tests

From the project root directory:

```bash
$env:PYTHONPATH = '.'; & .venv\Scripts\pytest.exe backend/tests/
```

## Coverage Reports

Coverage reports are automatically generated when running tests. They are also displayed in the terminal.

## Architecture

- **Isolated Databases**: Each test runs with a fresh, isolated temporary SQLite database file (via `temp_db` fixture in `conftest.py`).
- **In-Memory Logic**: Some logic is tested against Pydantic models directly (unit tests), while others use the full database stack (integration tests).

## Test Locations

- `backend/tests/test_validators.py`: Unit tests for request validation logic.
- `backend/tests/test_draw_service.py`: Integration tests for draw management.
- `backend/tests/test_settlement_service.py`: Integration tests for complex settlement math.
