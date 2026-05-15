# Incident ID
INC-005
---
# Title
ReferenceError: React is not defined
---
# Status
RESOLVED
---
# Severity
LOW
---
# Category
Frontend
---
# Date
2026-05-15
---
# Related Feature
Sale Management (TASK-004)
---
# Symptom
`Uncaught ReferenceError: React is not defined`
---
# Root Cause
The `SalesPage.jsx` used `React.Fragment` implicitly for mapping inside JSX, but `React` was not explicitly imported. In the current project configuration, the JSX transform requires `React` to be in scope if `React.Fragment` (or the `<React.Fragment>` syntax) is used explicitly or implicitly in some contexts.
---
# Architectural Mistake
Inconsistent React import practices across the project components.
---
# Prevention Principles
- Always import `React` if using `React.Fragment` or legacy JSX patterns.
- Ensure all components follow the project's consistent import style.
---
# Mandatory Prevention Rules
- Components using explicit `React.Fragment` or standard JSX must either import `React` or confirm that the build environment's JSX transform is configured to handle `React` being undefined.
---
# Resolution Summary
Explicitly imported `React` in `SalesPage.jsx` to resolve the reference error.
