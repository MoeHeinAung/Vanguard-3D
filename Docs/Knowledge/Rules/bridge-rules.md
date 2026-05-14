# Bridge Communication Rules

## Rationale
The `pywebview` bridge is the single point of failure for communication between the frontend and backend. Ensuring it is used correctly prevents race conditions, runtime crashes, and data inconsistency.

## Enforcement Guidance
- All developers must use the `callPython` utility.
- Code reviews must flag any direct usage of `window.pywebview`.
- Automated tests (if implemented) should mock the bridge using the same Promise-based structure.

## Examples

### Good: Using the wrapper
```javascript
import { callPython } from '@/utils/bridge';

const fetchData = async () => {
  try {
    const draws = await callPython('get_draws');
    setDraws(draws);
  } catch (err) {
    notifyError(err);
  }
};
```

### Good: Backend validation
```python
def create_draw(self, data):
    # Validate data is a dict and has required keys
    if not isinstance(data, dict) or 'draw_date' not in data:
        raise ValueError("Invalid draw data")
    return self.draw_service.create_draw(...)
```

## Anti-Patterns
- **Direct Access**: `window.pywebview.api.method()` (Race condition risk).
- **Business Logic in Bridge**: Implementing complex logic inside `main.py` instead of delegating to services.
- **Non-Serializable Returns**: Returning Python objects that cannot be converted to JSON.
- **Silent Failures**: Not using `try/catch` around `callPython` calls.
