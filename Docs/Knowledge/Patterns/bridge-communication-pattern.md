# PATTERN-001

---

# Title

Safe Bridge Communication Pattern

---

# Status

ACTIVE

---

# Category

API / Architecture

---

# Purpose

Provides a consistent and safe way to call Python backend methods from the React frontend using the `pywebview` bridge, ensuring the bridge is ready before use and handling errors gracefully.

---

# Problem

The `pywebview` bridge is initialized asynchronously. If a React component attempts to call a Python method before the bridge is fully loaded (`pywebviewready` event), it will fail. Additionally, direct access to `window.pywebview.api` is fragile and leads to repetitive error-handling boilerplate.

---

# Pattern Summary

Wrap the bridge initialization in a Promise-based utility that waits for the `pywebviewready` event. Provide a centralized `callPython` helper that resolves this promise and executes the requested backend method, providing a clean, async/await interface for the frontend.

---

# Applies To

- All frontend-to-backend communication.
- Initial data fetching in `useEffect`.
- Mutation calls from form submissions.

---

# Preconditions

- `pywebview` must be configured with a `js_api` object in `main.py`.
- `window.pywebview` must be available in the global browser context.

---

# Pattern Structure

1.  **Utility Layer (`bridge.js`)**:
    - `getPythonApi()`: Returns a Promise that resolves with `window.pywebview.api`.
    - `callPython(method, ...args)`: Awaits `getPythonApi`, checks if the method exists, and calls it.
2.  **UI Layer**:
    - Uses `async/await` with `callPython`.
    - Handles loading and error states locally.

---

# Implementation Rules

- Never access `window.pywebview` directly in components.
- Always use the `callPython` helper.
- Ensure all Python methods called return JSON-serializable data.
- Handle potential errors from `callPython` using `try/catch`.

---

# Recommended Workflow

1.  Define the method in the Python `API` class in `main.py`.
2.  Import `callPython` in the React component.
3.  Invoke the method inside an `async` function.
4.  Update local component state based on the result.

---

# Good Example

```javascript
// In bridge.js
export const callPython = async (method, ...args) => {
  const api = await getPythonApi();
  if (api[method]) {
    return await api[method](...args);
  }
  throw new Error(`Method ${method} not found`);
};

// In a component
const data = await callPython('get_draws');
setDraws(data);
```

---

# Bad Example

```javascript
// Fragile: might run before bridge is ready
window.pywebview.api.get_draws().then(setDraws);
```

---

# Reusable Template

```javascript
// bridge.js
export const getPythonApi = () => {
  return new Promise((resolve) => {
    if (window.pywebview && window.pywebview.api) {
      resolve(window.pywebview.api);
    } else {
      window.addEventListener('pywebviewready', () => {
        resolve(window.pywebview.api);
      });
    }
  });
};

export const callPython = async (method, ...args) => {
  try {
    const api = await getPythonApi();
    return await api[method](...args);
  } catch (error) {
    console.error(`Bridge Error [${method}]:`, error);
    throw error;
  }
};
```

---

# Anti-Patterns

- Directly calling `window.pywebview.api` inside `useEffect`.
- Forgetting to handle the `pywebviewready` event.
- Passing non-serializable objects (like class instances) across the bridge.

---

# Tradeoffs

Advantages:

- Reliable initialization.
- Clean, standard API for developers.
- Centralized logging/debugging for bridge calls.

Disadvantages:

- Small amount of initialization latency.

---

# Performance Considerations

- The bridge is local, so latency is minimal compared to HTTP.
- Avoid passing extremely large datasets (MBs) in a single call to prevent blocking the UI thread.

---

# Security Considerations

- Validate all arguments on the Python side, as the JS bridge can be manipulated.
- Do not expose sensitive system commands directly to the `API` class.

---

# Edge Cases

- App starting up (bridge not ready).
- Calling a method that doesn't exist on the Python `API` class.
- Backend method throwing an exception (bridge translates this to a JS rejection).

---

# Failure Scenarios

- `pywebview` fails to load the `js_api`.
- Network failure (not applicable here as it's local).

---

# Detection Strategy

- Monitor console for "Method not found" or bridge-related timeouts.

---

# Regression Risks

- Renaming methods in Python without updating the strings in `callPython`.

---

# Related Rules

- SSOT.md

---

# Related ADRs

- ADR-001-environment-setup-and-bridge.md

---

# Related Tasks

- TASK-001-draw-management-ui

---

# Files/Systems Using This Pattern

- frontend/src/utils/bridge.js
- All React pages calling backend logic.

---

# Validation Checklist

- [x] `getPythonApi` uses a Promise.
- [x] `pywebviewready` event listener is implemented.
- [x] `callPython` handles method existence check.
- [x] Components use `async/await` for bridge calls.

---

# Version History

## v1

Initial pattern definition based on `pywebview` requirements.

---

# Notes

This pattern is the backbone of the "desktop-local" architecture.
