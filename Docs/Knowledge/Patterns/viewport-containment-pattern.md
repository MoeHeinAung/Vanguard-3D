# PATTERN-003

---

# Title

Viewport-Relative Containment Pattern

---

# Status

ACTIVE

---

# Category

Frontend / UI / Layout

---

# Purpose

Provides a foolproof structural recipe for ensuring pages perfectly fit the application window (100% height/width) and handle overflow data through internal scrolling, maintaining persistent visibility of controls and summaries.

---

# Problem

In complex management dashboards, long lists or large tables can push essential elements (like footers, navigation, or action buttons) off-screen, forcing the user to scroll the entire document and lose their context.

---

# Pattern Summary

Wrap the page in a fixed-height flexbox container (`h-full flex-col overflow-hidden`). Divide the content into a fixed header/footer area (`flex-none`) and a flexible middle area (`flex-1 min-h-0 overflow-hidden`). Only allow the innermost data-heavy containers to scroll.

---

# Applies To

- All top-level page components.
- Master-Detail sidebar layouts.
- Data tables with summary footers.

---

# Preconditions

- Parent container (`App.jsx` main area) must already be height-constrained.
- Tailwind CSS available.

---

# Pattern Structure

1.  **Page Root**: `h-full flex flex-col overflow-hidden`.
2.  **Header**: `flex-none` (Static height).
3.  **Core Content Wrapper**: `flex-1 min-h-0 overflow-hidden` (This is the critical "Containment" layer).
4.  **Scrollable Child**: `h-full overflow-y-auto scrollbar-thin` (The actual list/table).
5.  **Pinned Footer**: `flex-none` (Always visible summary).

---

# Implementation Rules

- **Always** use `min-h-0` on flex items that are meant to fill but not exceed the parent height.
- **Never** allow the `body` or `html` tags to have a scrollbar.
- Use `sticky top-0` for table headers within the scrollable child to maintain column context.

---

# Good Example (React + Tailwind)

```jsx
<div className="h-full flex flex-col overflow-hidden">
  <header className="flex-none p-4 border-b">Fixed Title</header>
  
  <main className="flex-1 min-h-0 flex overflow-hidden">
    {/* Sidebar */}
    <aside className="w-64 flex-none border-r overflow-y-auto">
       {/* Long list scrolls here */}
    </aside>
    
    {/* Content */}
    <section className="flex-1 flex flex-col min-h-0 overflow-hidden">
       <div className="flex-1 overflow-y-auto p-4">
          {/* Main table scrolls here */}
       </div>
       <footer className="flex-none p-4 border-t bg-muted">
          Pinned Total: $1,000
       </footer>
    </section>
  </main>
</div>
```

---

# Anti-Patterns

- Using `h-screen` in nested components (breaks if parent has padding/navbar).
- Forgetting `overflow-hidden` on the page root.
- Placing a `Total` summary bar inside the scrollable container.

---

# Tradeoffs

Advantages:

- Professional desktop app look and feel.
- High accessibility (navigation always reachable).
- Stable layout on window resize.

Disadvantages:

- Requires discipline in managing nested heights.
- Slightly higher barrier to entry for new developers.

---

# Related Rules

- ui-governance-rules.md
- SSOT.md

---

# Related ADRs

- ADR-005-viewport-relative-containment.md

---

# Files/Systems Using This Pattern

- frontend/src/App.jsx
- frontend/src/pages/SalesPage.jsx
- frontend/src/pages/DrawsPage.jsx
- frontend/src/pages/TicketsPage.jsx

---

# Validation Checklist

- [x] Global window has no scrollbar.
- [x] Footer remains visible when data list is long.
- [x] Header remains visible when data list is long.
- [x] `min-h-0` is present on all expanding flex children.

---

# Version History

## v1

Initial pattern based on Sales Dashboard refactor.
