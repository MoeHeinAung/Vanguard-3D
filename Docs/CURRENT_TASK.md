# Task ID
TASK-001
---
# Title
Draw Management UI Implementation
---
# Status
COMPLETED
---
# Priority
HIGH
---
# Type
Feature
---
# Goal
Implement a complete UI for managing lottery draws, including creation, listing, and lifecycle status management.
---
# Scope
## Included
- Backend domain structure (api, database, models, services)
- `pywebview` bridge setup
- `DrawService` with status lifecycle logic
- Frontend Master-Detail layout for Draws
- Shadcn/UI integration with Tailwind CSS
- Draw creation dialog with validation
## Excluded
- Ticket sales management
- Agent management
- Reports/Analytics
---
# Business Value
Provides the foundational interface for managing the core entity of the system: lottery draws.
---
# Related Features
- Database Management
- Python/React Bridge
---
# Dependencies
- SQLite database initialization
- `pywebview` library installation
- Shadcn/UI and Tailwind CSS configuration
---
# Relevant Knowledge
## Rules
- SSOT.md
## ADRs
- ADR-001-environment-setup-and-bridge.md
- ADR-002-draw-management-ui-spec.md
---
# Architectural Constraints
- Must use `pywebview` for the bridge.
- Must use `shadcn/ui` and `Tailwind CSS` as per SSOT.md.
- Must keep business logic in Python services.
---
# Assumptions
- Application runs in a desktop environment via `pywebview`.
- SQLite is available for local storage.
---
# Risks
- Bridge initialization race conditions.
- UI framework mismatch (corrected from MUI to Shadcn).
---
# Edge Cases
- Empty draw list.
- Creating draws in the past (handled by `update_statuses`).
- Settling already settled draws.
---
# Implementation Plan
## Step 1
Description:
Scaffold backend and initialize database.
Expected Output:
`vanguard.db` exists with `draws` table.
Validation:
- [x] Database manager creates table.
---
## Step 2
Description:
Setup `pywebview` bridge.
Expected Output:
Python methods callable from JS.
Validation:
- [x] `callPython('hello')` works.
---
## Step 3
Description:
Implement Draw Management UI.
Expected Output:
Functional Draws page with Sidebar and Details.
Validation:
- [x] Draws can be created.
- [x] Draw history is visible.
- [x] Status updates work correctly.
---
# Files Expected To Change
- main.py
- backend/database/manager.py
- backend/services/draw_service.py
- frontend/src/utils/bridge.js
- frontend/src/pages/DrawsPage.jsx
- frontend/src/App.jsx
---
# Testing Strategy
## Manual Testing
- Create new draws with various dates.
- Switch between draws in the sidebar.
- Verify status badges reflect the correct state.
---
# Acceptance Criteria
- [x] Backend follows the domain structure.
- [x] Bridge communication is stable.
- [x] UI uses Shadcn and Tailwind.
- [x] Master-Detail layout is responsive and intuitive.
---
# Anti-Patterns
- Using Material UI (MUI) instead of Shadcn/Tailwind.
- Implementing business logic in the React layer.
---
# Rollback Plan
- Revert to initial scaffold if bridge fails.
---
# Completion Notes
Implementation completed using Shadcn/UI and Tailwind CSS. The bridge is stable using a promise-based utility. All business logic for draws is centralized in the `DrawService`.
