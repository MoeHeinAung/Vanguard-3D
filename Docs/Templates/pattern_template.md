# Pattern ID

PATTERN-000

---

# Title

Short descriptive pattern title.

Example:
Safe Async API Fetch Pattern

---

# Status

ACTIVE

Possible values:
- ACTIVE
- DEPRECATED
- EXPERIMENTAL
- SUPERSEDED

---

# Category

Frontend / Backend / Database / API / Architecture / Security / Performance / DevOps

---

# Purpose

Describe what problem this pattern solves.

Good Example:
Provides a consistent and safe structure for handling async API requests with loading, error handling, and response validation.

Bad Example:
Better API code

---

# Problem

Describe the recurring engineering problem.

Examples:
- Duplicate async fetch logic
- Missing loading states
- Runtime crashes from undefined data
- Inconsistent error handling

---

# Pattern Summary

Short high-level explanation of the solution approach.

Good Example:
Centralize API requests using reusable fetch utilities with validation, loading states, cleanup handling, and standardized error management.

---

# Applies To

Where this pattern should be used.

Examples:
- React query hooks
- API service layer
- Authentication requests
- Dashboard data fetching

---

# Preconditions

Requirements before using this pattern.

Examples:
- Shared API client exists
- Validation utilities available
- Error handling utilities configured

---

# Pattern Structure

Describe the architectural structure.

Examples:
- UI layer triggers async request
- Shared API layer performs request
- Validation layer verifies response
- State layer manages loading/error/data
- Cleanup prevents stale updates

---

# Implementation Rules

Mandatory implementation requirements.

Examples:
- Always provide loading state
- Always provide error handling
- Always validate API responses
- Always support cleanup handling
- Never expose raw API responses directly to UI

---

# Recommended Workflow

Step-by-step recommended implementation flow.

1. Create API service method
2. Add response validation
3. Create async state handler
4. Handle loading/error states
5. Add cleanup handling
6. Add regression validation

---

# Good Example

```
const users = response?.users ?? [];

if (!Array.isArray(users)) {
  throw new Error("Invalid users response");
}
```

---

# Bad Example

```ts id="n4j8tw"
response.users.map(...)
```

---

# Reusable Template

Provide reusable implementation structure.

```ts
async function fetchData() {
  try {
    setLoading(true);

    const response = await api.get();

    validateResponse(response);

    setData(response.data ?? []);

  } catch (error) {
    handleError(error);
  } finally {
    setLoading(false);
  }
}
```

---

# Anti-Patterns

Things AI/developers must avoid.

Examples:

* Direct fetch inside render logic
* Missing cleanup handling
* Ignoring loading states
* Duplicated fetch logic
* Mutating async state directly

---

# Tradeoffs

Explain engineering tradeoffs.

Advantages:

* Consistent behavior
* Safer async handling
* Easier debugging

Disadvantages:

* Slightly more boilerplate
* Additional abstraction layer

---

# Performance Considerations

Examples:

* Avoid duplicate API calls
* Prevent unnecessary re-renders
* Cache repeated requests carefully

---

# Security Considerations

Examples:

* Sanitize external input
* Avoid exposing sensitive API responses
* Validate all external data

---

# Edge Cases

Examples:

* Empty responses
* Slow network
* Request cancellation
* Expired tokens
* Invalid response shape

---

# Failure Scenarios

Describe what can still fail even with this pattern.

Examples:

* Backend outage
* Invalid schema updates
* Race conditions from external systems

---

# Detection Strategy

How misuse of this pattern can be detected.

Examples:

* Runtime validation
* Integration tests
* ESLint rules
* Manual review checklist

---

# Regression Risks

What future changes may break this pattern.

Examples:

* API response structure changes
* Refactoring fetch layer
* State management redesign

---

# Related Rules

Examples:

* frontend_rules.md
* api_rules.md

---

# Related Incidents

Examples:

* async-rendering-crash.md
* stale-state-race.md

---

# Related ADRs

Examples:

* ADR-001-state-management.md
* ADR-004-api-layer.md

---

# Related Tasks

Examples:

* TASK-014-login-flow
* TASK-021-dashboard-fetch

---

# Files/Systems Using This Pattern

Examples:

* src/hooks/useUsers.ts
* src/api/*
* authentication module

---

# Validation Checklist

* [ ] Loading state handled
* [ ] Error state handled
* [ ] Response validated
* [ ] Cleanup supported
* [ ] Edge cases tested
* [ ] No duplicated logic
* [ ] Regression tested

---

# Version History

## v1

Initial pattern definition.

---

# Notes

Additional important context or implementation guidance.