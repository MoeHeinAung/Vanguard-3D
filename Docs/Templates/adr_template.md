# ADR ID

ADR-000

---

# Title

Short descriptive architecture decision title.

Example:
Use React Query for Server State Management

---

# Status

ACTIVE

Possible values:
- ACTIVE
- DEPRECATED
- SUPERSEDED
- EXPERIMENTAL

---

# Date

YYYY-MM-DD

---

# Decision Makers

List people or systems involved in the decision.

Examples:
- Project Owner
- Lead Developer
- AI Engineering Workflow

---

# Context

Describe the technical or architectural problem.

Good Example:
The application performs many async API requests and requires caching, loading states, and automatic refetching.

Bad Example:
Need better state management

---

# Problem Statement

What exact problem must be solved?

Examples:
- Reduce duplicated server state
- Simplify async data fetching
- Prevent stale API data
- Improve cache consistency

---

# Decision

Clearly state the chosen solution.

Good Example:
Use React Query for all server-state management.

Bad Example:
Use React Query maybe

---

# Scope

Define where this decision applies.

Examples:
- Frontend API requests
- User session handling
- Dashboard analytics data

---

# Goals

What outcomes are expected?

Examples:
- Reduce duplicated fetch logic
- Improve loading state consistency
- Simplify cache invalidation

---

# Non-Goals

What this decision does NOT attempt to solve.

Examples:
- Does not replace local UI state
- Does not manage websocket events
- Does not replace backend caching

---

# Alternatives Considered

## Option 1

Name:
Redux Toolkit

Reason Rejected:
Too much boilerplate for server-state heavy workflow.

---

## Option 2

Name:
Custom Fetch Hooks

Reason Rejected:
Hard to maintain cache consistency and retry logic.

---

## Option 3

Name:
React Query

Reason Selected:
Provides caching, retries, invalidation, and async state management.

---

# Tradeoffs

## Advantages

- Reduced boilerplate
- Built-in caching
- Better async state handling
- Easier retries/refetching

## Disadvantages

- Additional dependency
- Learning curve
- Requires query key discipline

---

# Consequences

What future constraints or responsibilities now exist?

Examples:
- All server state must use query hooks
- Query keys must remain consistent
- Cache invalidation rules required

---

# Architectural Impact

Describe how architecture changes because of this decision.

Examples:
- API state separated from UI state
- Centralized async data management
- Reduced duplicated fetch logic

---

# Implementation Rules

Concrete engineering rules introduced by this ADR.

Examples:
- Never fetch server data directly inside components
- All API requests must use query hooks
- Mutations must invalidate related queries

---

# Anti-Patterns

Things AI/developers must avoid after this decision.

Examples:
- Direct fetch inside useEffect
- Duplicated API caching
- Mixing server state with form state

---

# Risks

Potential risks introduced by this decision.

Examples:
- Incorrect cache invalidation
- Query key inconsistency
- Over-fetching

---

# Mitigation Strategy

How risks will be reduced.

Examples:
- Standardized query key naming
- Shared fetch utilities
- Query hook templates

---

# Related Rules

Examples:
- frontend_rules.md
- api_rules.md

---

# Related Patterns

Examples:
- api-fetch-pattern.md
- query-hook-pattern.md

---

# Related Incidents

Examples:
- stale-state-race.md
- duplicated-fetch-logic.md

---

# Files/Systems Affected

Examples:
- src/api/*
- src/hooks/*
- frontend data layer

---

# Validation Strategy

How success of this decision will be evaluated.

Examples:
- Reduced duplicated API calls
- Stable loading/error handling
- Consistent cache updates

---

# Rollback Plan

How to revert this decision safely if needed.

Examples:
- Restore previous fetch hooks
- Remove React Query provider
- Revert query-based API layer

---

# Future Re-Evaluation Conditions

When this ADR should be reconsidered.

Examples:
- App scales to real-time architecture
- Query complexity becomes excessive
- Performance bottlenecks appear

---

# Superseded By

Leave empty unless replaced by another ADR.

Example:
ADR-005

---

# Notes

Additional important context or observations.