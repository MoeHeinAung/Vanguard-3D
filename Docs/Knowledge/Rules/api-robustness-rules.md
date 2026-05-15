# API Robustness Rules

## Rationale
The `pywebview` bridge acts as an API gateway. If a method in the `API` class throws an unhandled exception, it defaults to a generic 500 error, making debugging impossible and breaking frontend state synchronization.

## Enforcement Guidance
- Every method in the `API` class must be wrapped in a `try-except` block.
- Exceptions should be logged using `logging` or `print(file=sys.stderr)`.
- Backend exceptions should raise specific errors that are serializable across the bridge.

## Examples

### Good: Robust API Method
```python
def get_draws(self):
    try:
        self.draw_service.update_statuses()
        return self.draw_service.get_all_draws()
    except Exception as e:
        print(f"Error in get_draws: {e}", file=sys.stderr)
        raise e
```

## Anti-Patterns
- **Unprotected Methods**: Allowing exceptions to leak to the caller.
- **Silent Logging**: Swallowing exceptions without logging or re-raising.
- **Ambiguous Error Messages**: Not providing context in the exception.
