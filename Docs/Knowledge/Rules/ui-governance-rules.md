# UI Component Governance Rules

## Rationale
Inconsistent availability of UI primitives across pages leads to build failures, while non-standardized layout structures cause "pogo-sticking" and hidden summary data.

## Enforcement Guidance
- **Primitive Check**: Before using a new component (e.g., `Select`, `Table`), verify its existence in `src/components/ui/`.
- **Viewport Lock**: All pages MUST fit 100% within the window height. Use the `flex flex-col h-full overflow-hidden` pattern.
- **Scroll Management**: Only individual data containers are allowed to scroll. Use `scrollbar-thin` for visual consistency.
- **Pinned Summaries**: Critical summary data (Totals) must never be hidden inside a scrollable area.

## Examples

### Good: Component Verification
```bash
# Check if file exists before importing
ls src/components/ui/select.jsx
```

### Good: Layout Containment
```jsx
<div className="h-full flex flex-col overflow-hidden">
  <div className="flex-1 min-h-0 overflow-hidden">
     <div className="h-full overflow-y-auto">...</div>
  </div>
</div>
```

## Anti-Patterns
- **Assumption-based Imports**: Assuming a component exists because it's part of the standard `shadcn` library.
- **Document Scroll**: Relying on the browser's global scrollbar.
- **Bypassing min-h-0**: Omitting `min-h-0` on flex items, causing overflow leakage.
- **Bypassing UI Primitives**: Importing directly from third-party libraries (`@mui`, `radix-ui`) instead of local primitives.

