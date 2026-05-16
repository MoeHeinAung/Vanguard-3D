# Task ID
TASK-005
---
# Title
Risk Management (Offloading) Redesign
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
Redesign the Risk Management page with a sidebar-main layout and implement a constrained offloading template system.
---
# Scope
## Included
- Reconfigure `OffloadPage.jsx` layout: Narrow sidebar (Pending list) and Wide main area (Template preview).
- Implement "Perform Offload" logic:
    - Limit by `Max Offload Amount` per ticket.
    - Limit by `Max Offload Ticket` (batch size).
    - Formula: `Offloaded = min(Pending, Max Offload Amount)`.
- Implement Template UI:
    - Header: "Kalaw", Draw Date, Page Number (auto-increment).
    - Body: 4 horizontal tables of 15 records each (no headers, subtotal per table).
    - Footer: "Total Amount Offloaded - [Sum] Ks".
- Persistence: Record offloads in `offloaded_tickets` table via `create_offload`.
- Automatic Image Export: Trigger PNG download using `html2canvas` upon successful offload.
- History View: Sidebar toggle between "Ticket" and "History" views, with chronological pagination and batch re-preview capability.
## Excluded
- Automatic (scheduled) offloading.
- PDF/Print export.
---
# Validation Strategy
- Verify transfer logic respects Max Amount/Ticket constraints.
- Verify template layout (4 columns, 15 rows) fills correctly.
- Ensure pending list recalculates after offload.
- Verify page number incrementation.
- Verify PNG export triggers upon offload and respects naming convention.
- Verify History View groups records by timestamp and enables correct template re-preview.
---
# Completion Notes
- Redesigned `OffloadPage.jsx` with sidebar-main layout.
- Implemented "Kalaw" template engine with 4x15 grid.
- Integrated persistent settings for Page Number and Risk Constraints.
- Verified real-time pending list recalculation.
- Added automated image export via `html2canvas`.
- Implemented History View with chronological pagination and re-preview logic.

