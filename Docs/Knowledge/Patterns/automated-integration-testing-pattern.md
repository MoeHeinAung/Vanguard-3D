# Isolated Integration Testing Pattern

## Rationale
To ensure test reliability and speed, integration tests must operate in total isolation. Sharing a production or development database leads to non-deterministic test results and data corruption.

## Enforcement Guidance
- Use `pytest` fixtures for database lifecycle management.
- Each test MUST receive its own clean, empty database instance.
- Avoid using production database paths in tests.
- Use `tempfile` to create unique temporary database files for integration tests.

## Implementation Pattern
```python
# conftest.py
@pytest.fixture(scope='function')
def temp_db():
    fd, db_path = tempfile.mkstemp()
    os.close(fd)
    
    db_manager = DatabaseManager(db_path)
    init_schema(db_manager)
    
    yield db_manager
    
    # Cleanup
    if os.path.exists(db_path):
        os.remove(db_path)
```

## Anti-Patterns
- **Shared DB State**: Using a single global test database.
- **Production Reliance**: Tests interacting with `backend/database/vanguard.db`.
- **Manual Cleanup**: Failing to remove temporary test artifacts after the test suite completes.

## Validation Strategy
- **Isolation Check**: Run tests in parallel or sequentially and verify that data inserted in one test does not leak into another.
- **Failure Cleanliness**: Ensure that even if a test fails, the temporary files are removed during the `yield` fixture teardown.
