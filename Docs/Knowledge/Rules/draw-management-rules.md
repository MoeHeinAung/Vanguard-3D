# Draw Management Rules

## Rationale
Lottery draws are time-sensitive and follow a strict linear lifecycle. Incorrect status management can lead to invalid sales or incorrect settlements.

## Enforcement Guidance
- The `status` field must only be updated via `DrawService`.
- `update_statuses` must be called before any read operation that depends on accurate timing.
- The UI must disable actions that are invalid for the current state.

## Examples

### Good: Automatic status check
```python
def get_draws(self):
    self.draw_service.update_statuses() # Always sync before reading
    return self.draw_service.get_all_draws()
```

### Good: Contextual UI
```jsx
{selectedDraw.status === 'Closed' && (
  <Button onClick={handleSettle}>Settle Draw</Button>
)}
```

## Anti-Patterns
- **Frontend Status Logic**: Calculating if a draw is "Closed" in React based on the current time (this should happen in Python).
- **Manual Status Overrides**: Updating the `status` column in the database directly without going through `DrawService`.
- **Stale Views**: Not refreshing the draw list after a successful creation or settlement.
