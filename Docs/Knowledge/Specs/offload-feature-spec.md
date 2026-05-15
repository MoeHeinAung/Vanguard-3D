# Spec: Sales Offloading Feature

## Objective
Implement a risk management system that allows Administrators to offload high-risk ("hot") tickets to Master Dealers. This controls the House's exposure by transferring liability for amounts exceeding the established House Hold.

### User Stories
- As an Admin, I want to see which tickets exceed my risk limit.
- As an Admin, I want to select a Master Dealer and record offloaded amounts for specific tickets.
- As an Admin, I want to maintain a permanent record of all offloaded tickets for auditing and settlement.

## Tech Stack
- **Backend**: Python 3.12+ (existing)
- **Frontend**: React JSX + Tailwind CSS + shadcn/ui (existing)
- **Database**: SQLite3 (existing)
- **Bridge**: pywebview (existing)

## Commands
- **Dev (Frontend)**: `npm run dev` (in `frontend/`)
- **Dev (Full App)**: `python main.py` (in root)
- **Build**: `npm run build` (in `frontend/`)

## Project Structure
- `backend/services/offload_service.py` → Logic for managing offloads.
- `frontend/src/pages/OffloadPage.jsx` → UI for offloading.
- `backend/database/manager.py` → Schema updates.
- `Docs/Knowledge/ADR/2026-05-15-risk-offloading-strategy.md` → Architecture decision.

## Code Style
### Frontend (React)
```jsx
const handleOffload = async () => {
  const result = await callPython('create_offload', {
    draw_id: selectedDraw.id,
    master_dealer_id: selectedDealer.id,
    input_text: "123 = 5000\n456 = 10000",
    notes: "Hot tickets offload"
  });
};
```
### Backend (Python)
```python
def create_offload(self, draw_id, md_id, input_text, notes=None):
    # Reuse TICKET = AMOUNT parser logic
    # Insert into offloaded_tickets
```

## Testing Strategy
- **Manual Verification**:
  1. Record sales for a draw.
  2. Go to Offload Page.
  3. Select a Master Dealer.
  4. Enter ticket/amount pairs to offload.
  5. Verify "Pending" amounts in Sales Page decrease (future implementation, for now just record the offload).
- **Relational Integrity**: Verify `offloaded_tickets` correctly references `draws` and `master_dealers`.

## Boundaries
- **Always**: Use `callPython` for IO, follow `PATTERN-003` (Viewport Containment).
- **Ask first**: Complex automatic auto-offloading (not in current scope).
- **Never**: Hardcode Master Dealer IDs or bypass service layer.

## Success Criteria
- [ ] New `offloaded_tickets` table exists in `vanguard.db`.
- [ ] `OffloadService` implemented with bulk creation and retrieval.
- [ ] `OffloadPage` exists with Agent-Sales-style layout (Dealer sidebar, data table).
- [ ] "TICKET = AMOUNT" parser reused for offloading.
- [ ] UI perfectly contained within window boundaries (`PATTERN-003`).
- [ ] All `main.py` methods wrapped in `try-except` (`api-robustness-rules`).

## Open Questions
1. Should offloading a ticket automatically deduct from the "Pending" amount shown on the `SalesPage`? (User mentioned "ignore for now" in Pending formula, but I'll add the DB infrastructure to support it).
2. Do we need a "History" tab on the Offload page, similar to Sales? (Assuming yes, as it "mirrors" Agent Sales).
