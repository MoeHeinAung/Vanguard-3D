# ADR-002

---

# Title

Draw Management UI Design Specification

---

# Status

ACTIVE

---

# Date

2026-05-14

---

# Decision Makers

- Project Owner
- AI Engineering Workflow

---

# Context

The system requires a dedicated interface for managing the lifecycle of lottery draws. This includes creating draws, monitoring their status (Open, Closed, Settled), and performing administrative actions like settling draws.

---

# Problem Statement

How to provide an intuitive and efficient interface for administrators to manage multiple draws simultaneously while ensuring data consistency between the frontend and the SQLite database.

---

# Decision

Implement a **Master-Detail** layout with a persistent sidebar for historical navigation.

1.  **Sidebar**: Displays a scrollable list of all draws, ordered by date (newest first). Each item shows the draw date and a color-coded status badge.
2.  **Main Area**: Displays comprehensive details for the selected draw, including cutoff time, creation timestamp, and administrative notes.
3.  **Contextual Actions**: Provide status-aware buttons (e.g., "Settle Draw" only appears when status is 'Closed').
4.  **Creation Workflow**: Use a modal dialog (Shadcn Dialog) for creating new draws with validation for date and time.
5.  **Status Sync**: Automatically trigger `update_statuses` on the backend whenever the draw list is requested to ensure temporal statuses (Open -> Closed) are always accurate.

---

# Scope

- `DrawsPage.jsx` component.
- `DrawService` Python class.
- Bridge methods: `get_draws`, `create_draw`, `settle_draw`.

---

# Goals

- High visibility into draw history.
- Easy identification of current draw status.
- Simplified creation process for new draws.
- Automatic status transitions based on system time.

---

# Non-Goals

- Does not cover ticket sales or offloading (separate modules).
- Does not handle user authentication for administrators.
- Does not include complex reporting/analytics in this view.

---

# Alternatives Considered

## Option 1

Name:
Single Table View

Reason Rejected:
Limited space for detailed actions and notes; harder to navigate a long history of draws.

---

## Option 2

Name:
Multi-Page Navigation

Reason Rejected:
Increases latency and breaks the "desktop app" feel; Master-Detail is more efficient for high-frequency management tasks.

---

# Tradeoffs

## Advantages

- **Context Preservation**: Users can switch between draws without losing their place in the history.
- **Dynamic UI**: Status-aware actions prevent illegal state transitions (e.g., settling an open draw).
- **Temporal Accuracy**: Background status updates ensure the UI reflects reality without manual intervention.

## Disadvantages

- **Screen Real Estate**: Master-Detail requires a wider screen (optimized for desktop, as per project goals).

---

# Consequences

- The `draws` table in SQLite must support `Open`, `Closed`, and `Settled` statuses.
- Every page load/refresh must call `update_statuses` to maintain consistency.

---

# Architectural Impact

- Centralizes draw lifecycle management in a single domain.
- Establishes a pattern for other management modules (e.g., Sales, Agents).

---

# Implementation Rules

- Use `Badge` component for all status indicators.
- All date/time inputs must be clearly labeled and validated.
- Refresh the entire draw list after any mutation (create/settle) to ensure sync.

---

# Anti-Patterns

- Hardcoding status logic in the frontend (status logic belongs in `DrawService`).
- Allowing status changes to bypass the `DrawService` logic.

---

# Risks

- **Timezone Mismatches**: Python's `datetime.now()` must align with the user's local expectations for cutoffs.
- **Stale Data**: If the user leaves the app open for a long time, statuses might become stale until the next refresh.

---

# Mitigation Strategy

- **Backend-Driven Status**: Python handles all time comparisons.
- **Frequent Refreshes**: Trigger `get_draws` (which includes status updates) on component mount and after key actions.

---

# Related Rules

- SSOT.md

---

# Related Patterns

- master-detail-pattern.md
- status-lifecycle-pattern.md

---

# Related Incidents

None.

---

# Files/Systems Affected

- backend/services/draw_service.py
- frontend/src/pages/DrawsPage.jsx
- backend/database/vanguard.db

---

# Validation Strategy

- Create a draw with a cutoff time in the past and verify it appears as 'Closed'.
- Create a draw with a cutoff time in the future and verify it appears as 'Open'.
- Settle a closed draw and verify the status updates to 'Settled'.

---

# Rollback Plan

- Revert to a simpler table-based view if the Master-Detail becomes too complex for small screens.

---

# Future Re-Evaluation Conditions

- Need for filtering/searching draws if the history becomes extremely large (thousands of draws).

---

# Superseded By

Empty.

---

# Notes

This design is the primary entry point for administrators and sets the tone for the rest of the application's management interfaces.
