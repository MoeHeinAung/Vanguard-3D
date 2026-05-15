# ADR-005

---

# Title

Viewport-Relative Containment Architecture

---

# Status

ACTIVE

---

# Date

2026-05-15

---

# Decision Makers

- Project Owner
- AI Engineering Workflow

---

# Context

Standard web layouts often rely on document-level scrolling. For a "desktop-class" management application like Vanguard 3D, this leads to a fragmented user experience where headers, navigation, and critical summary footers (like the Sales Total bar) disappear as the user scrolls through data.

---

# Problem Statement

How to ensure the application UI remains perfectly contained within the 100% height and width of the application window, maintaining persistent visibility of navigation and controls while handling overflow data gracefully.

---

# Decision

Implement a **Nested Flexbox Containment** model across the entire application.

1.  **Global Viewport Lock**: The root `App.jsx` container is locked to `h-screen w-screen overflow-hidden`.
2.  **Flex-Flow Navigation**: Use a vertical flexbox where the `Navbar` is fixed (`flex-none`) and the `main` content area fills the remaining space (`flex-1`).
3.  **Boundary Enforcement**: All page-level components MUST use `h-full overflow-hidden` and `min-h-0` on flex children to prevent them from expanding past the window's boundaries.
4.  **Localized Scrolling**: Only the specific data-heavy sub-containers (e.g., table bodies, sidebars) are permitted to scroll using `overflow-y-auto`.
5.  **Fixed UI Elements**: Headers and Footers (like the "Total Summary" bar) must be wrapped in `flex-none` to ensure they are pinned to the viewport edges.

---

# Scope

- `App.jsx` global layout.
- All page components in `src/pages/`.
- All Master-Detail and Table components.

---

# Goals

- Professional "Native App" feel.
- Zero global page scroll.
- Persistent visibility of "Total" bars and action headers.
- Consistent scrollbar aesthetics via `scrollbar-thin`.

---

# Tradeoffs

## Advantages

- **Context Retention**: Users never lose sight of navigation or totals.
- **Predictable Layout**: Eliminates shifts and accidental document-level scrolling.
- **Improved UX**: Side-by-side scrolling in Master-Detail views.

## Disadvantages

- **CSS Complexity**: Requires careful use of `min-h-0` and nested flexbox rules to avoid common browser layout bugs.

---

# Consequences

- Every new page must strictly follow the flex-containment pattern.
- Over-sized assets or images must be explicitly handled via internal scrolling.

---

# Implementation Rules

- Use `flex flex-col h-full overflow-hidden` for page roots.
- Use `flex-1 min-h-0 overflow-hidden` for wrappers around scrollable content.
- Use `sticky top-0` for table headers within scrollable areas.
- **Never** use `min-h-screen` or rely on the body to scroll.

---

# Anti-Patterns

- **Document Scrolling**: Allowing the `100vh` boundary to be breached.
- **Hidden Footers**: Placing summary data inside a scrolling container instead of a pinned footer.
- **Bypassing min-h-0**: Forgetting to set `min-h-0` on flex items, causing them to ignore parent constraints.

---

# Related Patterns

- master-detail-ui-pattern.md
- viewport-containment-pattern.md (New)

---

# Related Incidents

- INC-003 (Implicitly related to layout instability)

---

# Files/Systems Affected

- frontend/src/App.jsx
- frontend/src/pages/*.jsx

---

# Validation Strategy

- Resize the application window and verify that the "Total Summary" bar remains visible at the bottom.
- Ensure that only internal lists scroll while the Navbar remains static.

---

# Notes

This ADR establishes the "Window-First" layout philosophy of the project.
