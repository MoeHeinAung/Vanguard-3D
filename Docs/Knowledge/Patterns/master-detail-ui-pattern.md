# PATTERN-002

---

# Title

Master-Detail Sidebar Navigation Pattern

---

# Status

ACTIVE

---

# Category

Frontend / UI

---

# Purpose

Provides a consistent layout for managing collections of entities (e.g., Draws, Sales, Agents), allowing users to browse a list and view/edit details without losing context.

---

# Problem

Navigating between a long list of items and their detailed views often leads to "pogo-sticking" (frequent back-and-forth navigation), which is inefficient for administrative tasks and breaks the flow of desktop applications.

---

# Pattern Summary

Use a split-pane layout where the left column (Master) contains a scrollable list of entity summaries, and the right area (Detail) displays the full information and actions for the currently selected entity. The state of the selection is managed at the page level.

---

# Applies To

- `DrawsPage.jsx`
- Future Agent management pages.
- Future Sales and Settlement pages.

---

# Preconditions

- Entity collection must be fetchable as an array of objects.
- Each entity must have a unique identifier (ID).

---

# Pattern Structure

1.  **Container**: A grid or flex container with `lg:grid-cols-3` or similar.
2.  **Master (Sidebar)**:
    - Card component.
    - Scrollable list of buttons.
    - Each button displays key identifying info (e.g., Date, Status).
    - Highlights the currently selected item.
3.  **Detail (Main Area)**:
    - Displays detailed fields (e.g., Cutoff Time, Notes).
    - Shows contextual action buttons based on status.
    - Displays an "empty state" if no item is selected.

---

# Implementation Rules

- The Master list must be ordered logically (e.g., newest first).
- Statuses must be visually distinct (using `Badge` colors).
- Selecting an item must update the URL or local state immediately.
- The layout must handle empty states gracefully.

---

# Recommended Workflow

1.  Define the list and selection state using `useState`.
2.  Fetch data on mount and update the list.
3.  Implement the Sidebar using a `map` over the entity array.
4.  Implement the Detail view to render based on the `selectedEntity`.
5.  Add contextual actions to the Detail view.

---

# Good Example

```jsx
<div className="grid grid-cols-3 gap-6">
  {/* Master */}
  <Card className="col-span-1">
    {entities.map(e => (
      <button onClick={() => setSelected(e)} className={selected.id === e.id ? 'bg-accent' : ''}>
        {e.name}
      </button>
    ))}
  </Card>
  
  {/* Detail */}
  <Card className="col-span-2">
    {selected ? <EntityDetail item={selected} /> : <EmptyState />}
  </Card>
</div>
```

---

# Bad Example

```jsx
// Navigating to a completely new page for every detail view
// requires the user to constantly click "Back" to see the list again.
```

---

# Reusable Template

```jsx
function ManagementPage() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        {/* Scrollable list here */}
      </Card>
      <div className="lg:col-span-2">
        {selected ? (
          <DetailCard item={selected} />
        ) : (
          <Card>Select an item to view details</Card>
        )}
      </div>
    </div>
  );
}
```

---

# Anti-Patterns

- Hiding the Sidebar on desktop when an item is selected.
- Not highlighting the selected item in the list.
- Re-fetching the entire list every time a selection changes (unless a mutation occurred).

---

# Tradeoffs

Advantages:

- High efficiency for browsing.
- Contextual persistence.
- Professional desktop-app feel.

Disadvantages:

- Requires more horizontal space.
- Slightly more complex state management.

---

# Performance Considerations

- For very large lists, consider virtualization (e.g., `react-window`).
- Ensure the detail view doesn't perform heavy re-renders when the list updates.

---

# Security Considerations

- Ensure the user has permissions to view the details of the selected item.

---

# Edge Cases

- Empty collections.
- Extremely long lists.
- Very long text in sidebar labels (use truncation).

---

# Failure Scenarios

- Selection state getting out of sync with the underlying data after a mutation.

---

# Detection Strategy

- Visual inspection of the Master-Detail layout.
- Verify selection highlights move correctly.

---

# Regression Risks

- Adding too much content to the Master sidebar, making it cluttered.

---

# Related Rules

- SSOT.md

---

# Related ADRs

- ADR-002-draw-management-ui-spec.md

---

# Related Tasks

- TASK-001-draw-management-ui

---

# Files/Systems Using This Pattern

- frontend/src/pages/DrawsPage.jsx

---

# Validation Checklist

- [x] Sidebar exists and is scrollable.
- [x] Selected item is highlighted.
- [x] Detail view updates when selection changes.
- [x] Empty state handled.
- [x] Actions are contextual to the selection.

---

# Version History

## v1

Initial pattern definition based on `DrawsPage` implementation.

---

# Notes

This is the standard layout for all management interfaces in Vanguard 3D.
