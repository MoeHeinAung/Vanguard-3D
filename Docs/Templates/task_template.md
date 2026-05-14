```md id="q6e2x9"
# Task ID
TASK-000
---
# Title
Short descriptive task title.
Example:
Implement Login Form Validation
---
# Status
PLANNING
Possible values:
- PLANNING
- IN_PROGRESS
- BLOCKED
- TESTING
- COMPLETED
- DEPRECATED
---
# Priority
LOW / MEDIUM / HIGH / CRITICAL
---
# Type
Feature / Bugfix / Refactor / Optimization / Research / Infrastructure
---
# Goal
Describe the exact objective of this task.
Good Example:
Implement secure email/password login flow with validation and loading states.
Bad Example:
Build auth system
---
# Scope
Clearly define included and excluded work.
## Included
- Login form UI
- Validation
- API integration
- Error handling
- Session token storage
## Excluded
- OAuth login
- Password reset
- Remember me feature
- Multi-factor authentication
---
# Business Value
Why this task matters.
Examples:
- Enables user authentication
- Prevents invalid form submission
- Improves system stability
- Reduces duplicate requests
---
# Related Features
List connected features/modules.
Examples:
- User Authentication
- Session Management
- Dashboard Access Control
---
# Dependencies
List required prerequisites.
Examples:
- API endpoint must exist
- Form validation pattern must be implemented
- Session storage utility required
---
# Relevant Knowledge
List related rules, incidents, patterns, and ADRs.
## Rules
- frontend_rules.md
- api_rules.md
## Patterns
- form-validation-pattern.md
- api-fetch-pattern.md
## Incidents
- async-rendering-crash.md
- stale-state-race.md
## ADRs
- ADR-001-auth-strategy.md
---
# Architectural Constraints
Hard constraints AI/developers must follow.
Examples:
- Must reuse existing API client
- Must not introduce new global state
- Must preserve current routing structure
- Must use existing validation utilities
- Must avoid duplicated server state
---
# Assumptions
List assumptions currently being made.
Examples:
- API returns JWT token
- Session storage is already configured
- User model already exists
---
# Risks
Potential technical risks.
Examples:
- Race conditions during login
- Invalid API response shape
- Session persistence inconsistency
---
# Edge Cases
List important edge cases.
Examples:
- Empty form submission
- Slow network response
- Expired token
- Invalid credentials
- API timeout
- Double-click submit
---
# Implementation Plan
Break task into small stable slices.
## Step 1
Description:
Create login form UI.
Expected Output:
Static form renders correctly.
Validation:
- [ ] Form renders
- [ ] Inputs update correctly
---
## Step 2
Description:
Add form validation.
Expected Output:
Invalid input prevented.
Validation:
- [ ] Email validation works
- [ ] Password validation works
---
## Step 3
Description:
Connect API endpoint.
Expected Output:
Login request succeeds.
Validation:
- [ ] API request sent correctly
- [ ] Loading state visible
- [ ] Error state handled
---
# Files Expected To Change
Examples:
- src/pages/LoginPage.tsx
- src/components/LoginForm.tsx
- src/api/authApi.ts
---
# Testing Strategy
Describe testing approach.
## Manual Testing
- Valid login
- Invalid login
- Empty fields
- Slow network simulation
## Regression Testing
- Existing routes still work
- Session persistence unaffected
---
# Acceptance Criteria
Concrete completion requirements.
Examples:
- User can log in successfully
- Invalid forms blocked
- Errors displayed correctly
- No console errors
- No duplicate requests
---
# Anti-Patterns
Things AI/developers must avoid.
Examples:
- Direct API calls inside UI components
- Duplicated auth state
- Skipping loading/error states
- Creating unnecessary abstractions
---
# Rollback Plan
How to safely revert if implementation fails.
Examples:
- Revert auth API integration
- Disable feature flag
- Restore previous session handling
---
# Completion Notes
Summary after task is finished.
Examples:
- Validation pattern reused successfully
- Added loading/error handling
- No regression detected