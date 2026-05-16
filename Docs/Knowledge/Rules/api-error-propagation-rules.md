# API Error Propagation Rule

## Rationale
The application architecture relies on the bridge between Python services and the React frontend. Silent failures in the service layer are not detected by the frontend, leading to UI states that are out-of-sync with the database. Specifically, database-level constraints (like Foreign Key violations) must be explicitly caught and transformed into user-actionable feedback.

## Enforcement Guidance
- Every backend service method that performs a destructive or integrity-sensitive operation (DELETE, UPDATE, INSERT) must explicitly handle potential database exceptions.
- Database integrity exceptions must be transformed into `ValueError` or other appropriate high-level exceptions that the API layer is designed to propagate.
- The API layer in `main.py` must catch these specific high-level exceptions and allow them to propagate to the bridge, ensuring the UI receives the error information.

## Examples

### Good: Explicit Integrity Handling
```python
def delete(self, entity_id: Any) -> bool:
    try:
        # ... logic
    except sqlite3.IntegrityError as e:
        if 'FOREIGN KEY constraint failed' in str(e):
            raise ValueError(f"Cannot delete record '{entity_id}' as it is referenced by other data.")
        raise e
```

### Bad: Swallowing Integrity Errors
```python
def delete(self, entity_id: Any) -> bool:
    try:
        # ... logic
    except Exception as e:
        print(f"Error: {e}") # Silent failure; UI thinks it succeeded
        return False 
```

## Anti-Patterns
- **Catch-all Exception Swallowing**: Returning `False` without context or propagation.
- **Silent Logging**: Printing an error to the server logs without alerting the user of the failure.
- **Frontend Trust**: Assuming that if the API returns a response, the backend action was successful. Always verify the status or error state.

## Validation Strategy
- Integration tests must attempt to delete records that have active foreign key references and assert that the correct validation error is returned.
- UI layer must treat all non-null responses from `callPython` as potential successes and catch errors to trigger `notifyError`.
