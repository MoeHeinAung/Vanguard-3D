# Task ID
TASK-003
---
# Title
Master Dealer CRUD Implementation
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
Implement Master Dealer management functionality to support risk offloading, including database schema update, backend service logic, and a dedicated UI for CRUD operations.
---
# Scope
## Included
- Add `master_dealers` table to SQLite schema.
- Implement `MasterDealerService` in `backend/services/master_dealer_service.py`.
- Expose master dealer methods to Python API in `main.py`.
- Implement `MasterDealersPage.jsx` using Master-Detail pattern.
- Update `Navbar` to include "Master Dealers" link.
## Excluded
- Risk offloading/hold amount calculation logic (future task).
---
# Implementation Plan
## Step 1
Description:
Update `DatabaseManager` to include `master_dealers` table.
---
## Step 2
Description:
Implement `MasterDealerService` with `get_master_dealers`, `create_master_dealer`, `update_master_dealer`, and `delete_master_dealer`.
---
## Step 3
Description:
Expose new service methods via `API` class in `main.py`.
---
## Step 4
Description:
Create `MasterDealersPage.jsx` and add to `App.jsx`.
---
# Files Expected To Change
- backend/database/manager.py
- backend/services/master_dealer_service.py
- main.py
- frontend/src/pages/MasterDealersPage.jsx
- frontend/src/App.jsx
- frontend/src/components/layout/Navbar.jsx
---
# Acceptance Criteria
- Master Dealers can be created, viewed, edited, and deleted.
- UI uses Master-Detail pattern.
- Database schema correctly handles all fields.
