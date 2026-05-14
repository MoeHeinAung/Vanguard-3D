# Incident ID
INC-000
---
# Title
Short descriptive incident title.
Example:
Async Rendering Crash on User Dashboard
---
# Status
ACTIVE
Possible values:
- ACTIVE
- RESOLVED
- DEPRECATED
---
# Severity
LOW / MEDIUM / HIGH / CRITICAL
---
# Category
Frontend / Backend / Database / API / Architecture / Security / Performance / DevOps
---
# Date
YYYY-MM-DD
---
# Related Feature
Which feature or module was affected?
Example:
User Authentication
Dashboard Analytics
Product API
---
# Symptom
What visible problem happened?
Examples:
- White screen after login
- API returned 500 error
- Infinite loading state
- Form submitted duplicate requests
---
# Error Message
Paste exact error if available.
Example:
TypeError: Cannot read properties of undefined (reading 'map')
---
# Root Cause
What technically caused the issue?
Focus on actual engineering reason, not surface symptoms.
Good Example:
Component rendered before async API response completed.
Bad Example:
users variable broken
---
# Architectural Mistake
What wrong assumption or design decision caused this?
Good Example:
UI assumed synchronous data availability.
Bad Example:
Forgot null check
---
# Trigger Conditions
Under what conditions does this happen?
Examples:
- Slow network
- First render
- Empty database response
- Rapid page navigation
- Expired token
---
# Prevention Principles
High-level engineering lessons.
Examples:
- Never trust async data during first render
- Always validate external API responses
- Avoid duplicated derived state
- Add cleanup for async effects
---
# Mandatory Prevention Rules
Concrete enforceable rules.
Examples:
- Arrays must default to []
- All API responses require schema validation
- useEffect async calls must support cleanup
- All fetches require loading/error state
---
# Reusable Prevention Pattern
Provide reusable safe implementation pattern.
Example:
```ts
const users = response?.users ?? [];
```
---
# Anti-Patterns
Things AI and developers must avoid.
Examples:
* Mapping unknown arrays directly
* Nested async inside useEffect without cleanup
* Direct state mutation
* Creating duplicate global state
---
# Detection Strategy
How to detect this issue early next time.
Examples:
* Add runtime schema validation
* Add loading state assertions
* Add integration test for empty responses
* Add error boundary logging
---
# Regression Risk
What future changes may accidentally reintroduce this issue?
Examples:
* API response shape changes
* New async rendering flow
* State management refactor
---
# Related Rules
List related rule files.
Examples:
* frontend_rules.md
* api_rules.md
---
# Related Patterns
List reusable patterns connected to this incident.
Examples:
* async-state-pattern.md
* api-fetch-pattern.md
---
# Files Involved
List affected files.
Examples:
* src/components/UserTable.tsx
* src/hooks/useUsers.ts
* src/api/userApi.ts
---
# Resolution Summary
Short summary of final fix.
Example:
Added defensive async rendering pattern with schema validation and loading fallback.
---
# Validation Checklist
* [ ] Root cause confirmed
* [ ] Fix tested manually
* [ ] Edge cases tested
* [ ] Regression tested
* [ ] Prevention rules extracted
* [ ] Related patterns updated
* [ ] Documentation updated