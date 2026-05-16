# Task ID
TASK-1.4
---
# Title
Add Input Validation to Ticket Parsing
---
# Status
COMPLETED
---
# Priority
HIGH
---
# Type
Refactor
---
# Goal
Implement robust validation logic in the backend ticket parsers (`sale_service.py` and `offload_service.py`) to prevent negative, non-numeric, or out-of-bounds monetary values.
---
# Scope
## Included
- Modify `parse_tickets` method in `backend/services/sale_service.py`.
- Modify `parse_tickets` method in `backend/services/offload_service.py`.
- Implement bounds validation (0 < amount < 1,000,000).
- Implement error handling for non-numeric conversion.
## Excluded
- UI-level input validation (though recommended, this task focuses on the backend parser integrity).
---
# Business Value
- Prevents financial data corruption from malformed inputs.
- Improves application stability by preventing runtime crashes during conversion.
---
# Related Features
- Sale Management, Offload Management.
---
# Dependencies
- None.
---
# Relevant Knowledge
- Rules: api-robustness-rules.md
---
# Architectural Constraints
- Validation must be silent (skip invalid lines) to maintain batch processing continuity.
- Indentation must remain compliant with Python 4-space rules.
---
# Assumptions
- Ticket input format is consistently "TICKET = AMOUNT".
---
# Risks
- Misinterpretation of valid tickets that don't match the new strict criteria.
---
# Edge Cases
- Empty lines, lines with missing "=", non-numeric amounts, negative amounts, amounts > 1M.
---
# Implementation Plan
## Step 1
Description:
Locate `parse_tickets` in `backend/services/sale_service.py` and `backend/services/offload_service.py`.
Expected Output:
Identified target methods.
Validation:
- [x] Files located.
---
## Step 2
Description:
Implement try-except validation and range bounds (0 < amount < 1,000,000).
Expected Output:
Updated `parse_tickets` implementation in both files.
Validation:
- [x] Code properly inserted and indented (4 spaces).
---
## Step 3
Description:
Perform manual testing for edge cases (negative, non-numeric, zero, too large).
Expected Output:
Invalid inputs are correctly skipped.
Validation:
- [x] All test cases from plan pass.
---
# Files Expected To Change
- backend/services/sale_service.py
- backend/services/offload_service.py
---
# Testing Strategy
## Manual Testing
- Simulate invalid inputs and verify backend output.
---
# Acceptance Criteria
- `parse_tickets` ignores invalid/out-of-bound inputs.
- No system crashes on malformed data.
- Range (0, 1M) is strictly enforced.
---
# Anti-Patterns
- Crashing on `float()` conversion.
- Accepting negative financial values.
---
# Rollback Plan
- Revert changes to `sale_service.py` and `offload_service.py`.
---
# Completion Notes
- Implemented robust input validation in `SaleService` and `OffloadService`.
- Added try-except blocks and range checks (0 < x < 1,000,000).
- Verified with manual edge-case tests.
