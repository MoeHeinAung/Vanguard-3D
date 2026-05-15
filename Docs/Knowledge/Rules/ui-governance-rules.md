# UI Component Governance Rules

## Rationale
Inconsistent availability of UI primitives across pages leads to build failures and architectural drift.

## Enforcement Guidance
- Before using a new component (e.g., `Select`, `Table`), verify its existence in `src/components/ui/`.
- If the component is missing, you MUST:
  1.  Check `shadcn/ui` documentation for the primitive.
  2.  Create the file in `src/components/ui/` if the project style allows, or
  3.  Use existing primitives if a similar pattern suffices.

## Examples

### Good: Component Verification
```bash
# Check if file exists before importing
ls src/components/ui/select.jsx
```

## Anti-Patterns
- **Assumption-based Imports**: Assuming a component exists because it's part of the standard `shadcn` library.
- **Bypassing UI Primitives**: Importing directly from third-party libraries (`@mui`, `radix-ui`) instead of local primitives.
