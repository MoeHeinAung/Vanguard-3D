# UI Accessibility Governance Rule

## Rationale
The `Dialog` component, powered by Radix UI primitives, strictly enforces accessibility via `aria-describedby` associations. Omitting descriptions or `aria-describedby` results in console warnings and fails accessibility compliance for screen reader users.

## Enforcement Guidance
- Every `DialogContent` component must have a clearly associated `DialogDescription` or a valid `aria-describedby` reference.
- If a visible description is undesirable, use the `sr-only` class to hide it visually while maintaining screen reader access.

## Implementation Pattern
```jsx
<DialogContent>
  <DialogHeader>
    <DialogTitle>Title</DialogTitle>
    <DialogDescription>Your accessible description goes here.</DialogDescription>
  </DialogHeader>
</DialogContent>
```

## Anti-Patterns
- **Orphaned Dialogs**: Using `Dialog` components that lack a title or description.
- **Ignoring Warnings**: Allowing console accessibility warnings to persist in the development environment.

## Validation Strategy
- **Development**: AI and developers must monitor the console for `aria-describedby` warnings.
- **Verification**: Ensure every new dialog creation includes a description.
