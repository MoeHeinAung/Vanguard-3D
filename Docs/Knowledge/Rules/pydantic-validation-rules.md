# Request Validation Rule (Pydantic Integration)

## Rationale
To ensure data integrity, prevent database corruption, and improve user experience, all input data from the frontend must be validated at the API boundary (the `API` class in `main.py`) before reaching the business services.

## Enforcement Guidance
- All new API input methods must implement a Pydantic schema validation.
- Validation errors must be caught in the `API` layer and transformed into a `ValueError` with a clear, user-friendly message.
- Frontend bridge calls should be wrapped in `try-catch` blocks that handle these `ValueError` messages (via the `NotificationContext`).

## Implementation Pattern
```python
# API Method in main.py
def create_something(self, data):
    try:
        validated_data = SomeValidator(**data)
        return self.some_service.create(**validated_data.model_dump())
    except ValidationError as e:
        # Format Pydantic errors for UI consumption
        error_msg = "; ".join([f"{err['loc'][0]}: {err['msg']}" for err in e.errors()])
        raise ValueError(f"Validation Failed: {error_msg}")
```

## Anti-Patterns
- **Scattered Validation**: Using `if/else` checks for data integrity inside Service/Repository methods.
- **Silent Failures**: Allowing backend `ValidationError` to crash the API call and result in generic 500 errors.
- **Backend-Only Validation**: Forgetting to provide specific validation messages back to the user.

## Validation Strategy
- Integration tests should test both valid and invalid (e.g., wrong data types, out of range) payloads.
- UI layer should catch validation errors from the backend and trigger `notifyError` toasts.
