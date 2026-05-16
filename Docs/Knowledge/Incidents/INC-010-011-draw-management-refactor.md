# Implementation Log: Draw Lifecycle & Status Management

## Overview
Implemented complete draw lifecycle management including "only one open draw" constraint, manual status updates, and full CRUD (Create, Edit, Delete).

## Lessons Learned
- **Status State Machine**: The draw status lifecycle ('Open' -> 'Closed' -> 'Settled') is highly sensitive. Business rules (e.g., preventing deletion of settled draws) must be enforced at the service layer to prevent data corruption.
- **Dependency Propagation**: When adding status validation, ensure that ALL service methods (API, sales creation, settlement) independently verify the status of the entity. Do not rely on UI state as the source of truth.
- **Error Propagation**: Always use explicit exceptions (`ValueError`) for domain validation failures. This allows the bridge layer to propagate readable messages to the UI without exposing stack traces.

## Reusable Knowledge
- **Rule**: Every service method that accepts a `draw_id` MUST validate the draw status if the operation depends on that status (e.g., Sales creation, Deletion).
- **Pattern**: Status-Aware UI. Use status-based rendering (e.g., removing 'Edit/Delete' controls for 'Settled' draws) combined with backend-side validation to provide defense-in-depth.

## Incidents Identified/Prevented
- **INC-010-Uncaught-ReferenceError**: Caused by missing imports after component refactoring. 
  - *Prevention*: Always verify component imports after any code replacement that touches the import section.
- **INC-011-Bridge-Argument-Mismatch**: Caused by passing an object instead of positional arguments for bridge methods.
  - *Prevention*: Maintain strict parity between backend `API` class signatures and frontend bridge `callPython` arguments.

## Architectural Constraints
- Only one 'Open' draw allowed globally.
- Status transitions are unidirectional for non-error paths (Open -> Closed -> Settled).
- Deletion of 'Closed' or 'Settled' draws is strictly prohibited.
