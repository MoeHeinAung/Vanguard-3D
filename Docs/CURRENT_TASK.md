# Task ID
TASK-005
---
# Title
Risk Offloading Implementation
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
Implement Risk Offloading system to transfer liability of high-risk ('hot') tickets to Master Dealers.
---
# Scope
## Included
- Add `offloaded_tickets` table to `vanguard.db`.
- Implement `OffloadService` with bulk insertion logic.
- Expose `get_offloads` and `create_offload` in `main.py` with robust error handling.
- Build `OffloadPage.jsx` using Master-Detail layout and reactive calculation model.
- Integrated into `App.jsx` and `Navbar.jsx`.
## Excluded
- Automatic offloading logic.
---
# Validation Strategy
- Verify bulk ticket parsing.
- Verify relational integrity (Draw/Dealer).
- Ensure "Total Summary" footer is pinned and visible at 100vh.

