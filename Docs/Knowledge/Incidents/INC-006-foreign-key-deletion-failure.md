# Incident ID
INC-006
---
# Title
Deletion Failure Due to Unhandled Foreign Key Constraints
---
# Status
RESOLVED
---
# Severity
MEDIUM
---
# Category
Database / API
---
# Date
2026-05-16
---
# Related Feature
Agent and Master Dealer Management
---
# Symptom
Deleting an Agent or Master Dealer returns a "success" notification, but the entity remains in the database and the UI.
---
# Root Cause
The `BaseEntityService.delete()` method was swallowing `sqlite3.IntegrityError` exceptions caused by foreign key violations (e.g., trying to delete an agent associated with existing sales). The frontend API call received no error, leading to a misleading successful notification.
---
# Architectural Mistake
The service layer lacked explicit handling for database integrity constraints, failing to propagate database-level enforcement back to the UI/User.
---
# Prevention Principles
- Database integrity errors (Foreign Key constraints) MUST be caught and re-raised as meaningful user-facing validation errors.
- Backend API methods must handle service-layer exceptions and propagate them through the bridge.
---
# Mandatory Prevention Rules
- `BaseEntityService.delete()` must specifically catch `sqlite3.IntegrityError` for foreign keys.
- API layer methods must differentiate between generic system errors and user-actionable validation errors (like foreign key conflicts).
---
# Resolution Summary
Refactored `BaseEntityService.delete` to catch `sqlite3.IntegrityError` and raise a `ValueError` with a descriptive message. Updated `main.py` API methods to propagate this `ValueError` to the frontend, which is then correctly caught by the notification system.
---
# Validation Checklist
* [x] Database foreign key constraint handling verified in `BaseEntityService`.
* [x] Deletion of referenced entity now raises correct validation error.
* [x] Notification system correctly displays foreign key error message to user.
