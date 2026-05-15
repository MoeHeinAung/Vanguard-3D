# Task ID
TASK-004
---
# Title
Sale CRUD Implementation
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
Implement Sale management to allow agents to record ticket sales for specific draws. This includes a custom parser for multi-line inputs, database schema definition with relations, and a two-column Master-Detail UI.
---
# Scope
## Included
- Add `sales` table to `vanguard.db` with foreign keys to `draws` and `agents`.
- Implement `SaleService` with batch creation capabilities.
- Custom logic to parse "TICKET = AMOUNT" input format.
- Two-column form: Left (Draw selection, Agent selection), Right (Multi-line input).
## Excluded
- Complex risk offloading (separate task).
- Ticket sales reporting/analytics.
---
# Implementation Plan
## Step 1
Description:
Update `DatabaseManager` to define `sales` table with foreign key constraints.
## Step 2
Description:
Implement `SaleService` in `backend/services/sale_service.py` with bulk insertion logic and grouping by `created_at`.
## Step 3
Description:
Expose `create_sales` and `get_sales` methods in `main.py`.
## Step 4
Description:
Implement `SalesPage.jsx` with the requested two-column layout and input parser.
## Step 5
Description:
Register `SalesPage` in `App.jsx` and `Navbar`.
---
# Files Expected To Change
- backend/database/manager.py
- backend/services/sale_service.py
- main.py
- frontend/src/pages/SalesPage.jsx
- frontend/src/App.jsx
- frontend/src/components/layout/Navbar.jsx
---
# Validation Strategy
- Verify bulk ticket parsing correctly handles valid/invalid formats.
- Verify foreign key integrity (Draw/Agent).
- Ensure entries are grouped correctly by `created_at` timestamp.
