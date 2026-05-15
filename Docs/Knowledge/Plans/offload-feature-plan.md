# Plan: Sales Offloading Implementation

## 1. Database Schema Update
- **Target**: `backend/database/manager.py`
- **Action**: Add `offloaded_tickets` table definition to `_create_tables`.
- **Schema**:
  ```sql
  CREATE TABLE IF NOT EXISTS offloaded_tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      draw_id INTEGER NOT NULL,
      master_dealer_id TEXT NOT NULL,
      ticket TEXT NOT NULL,
      amount REAL NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (draw_id) REFERENCES draws (id),
      FOREIGN KEY (master_dealer_id) REFERENCES master_dealers (id)
  )
  ```

## 2. Backend Service Logic
- **Target**: `backend/services/offload_service.py`
- **Action**:
  - Implement `OffloadService` class.
  - Implement `create_offload(draw_id, md_id, input_text, notes)`:
    - Reuse ticket parsing logic (Move parser to a utility or share between services).
    - Bulk insert into `offloaded_tickets`.
  - Implement `get_offloads()`:
    - Retrieve offloads with joined dealer names and draw dates.

## 3. Python API Bridge
- **Target**: `main.py`
- **Action**:
  - Initialize `OffloadService(self.db)`.
  - Expose `get_offloads()` and `create_offload(data)`.
  - Wrap both in `try-except` with logging to `stderr`.

## 4. Frontend UI Development
- **Target**: `frontend/src/pages/OffloadPage.jsx`
- **Action**:
  - Copy layout structure from `SalesPage.jsx`.
  - Sidebar: List Master Dealers (fetch via `get_master_dealers`).
  - Search functionality for dealers.
  - Main Panel:
    - Tab: `History` (Grouped offload records).
    - Tab: `Totals` (Sum per ticket).
  - Modal: `Record Offload` for the selected dealer.
  - Logic: Calculate global totals and formatted displays.

## 5. Navigation & Integration
- **Target**: `frontend/src/App.jsx`, `frontend/src/components/layout/Navbar.jsx`
- **Action**:
  - Register `OffloadPage` in `App.jsx` router.
  - Add "Offloading" link to `Navbar.jsx`.

## 6. Verification
- Run DB initialization.
- Manually create an offload record via UI.
- Verify entry in DB.
- Verify "History" expansion works.
- Check viewport containment (no window scroll).
