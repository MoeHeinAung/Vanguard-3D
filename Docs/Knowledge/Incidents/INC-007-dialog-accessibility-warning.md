# Incident ID
INC-007
---
# Title
Accessibility Warning: Missing Dialog Description
---
# Status
RESOLVED
---
# Severity
LOW
---
# Category
Frontend / Accessibility
---
# Date
2026-05-16
---
# Related Feature
All Entity Management Pages (Draws, Agents, Dealers, Sales)
---
# Symptom
Console warning: `Warning: Missing Description or aria-describedby={undefined} for {DialogContent}.`
---
# Root Cause
Radix UI (which underpins our shadcn/ui Dialog component) strictly enforces that every dialog must have an accessible description. The initial implementation focused on `DialogTitle` but omitted `DialogDescription`, triggering accessibility warnings in development.
---
# Architectural Mistake
Inconsistent usage of Shadcn/Radix UI primitives. The `Dialog` component was implemented without respecting the mandatory accessibility contract required by the underlying library.
---
# Prevention Principles
- Dialog components MUST always include either a `DialogDescription` or an `aria-describedby` attribute.
- Accessibility is not an optional "nice-to-have"; it is part of the core component contract.
---
# Mandatory Prevention Rules
- Any implementation of a `Dialog` MUST verify accessibility compliance during local testing.
- AI-generated code involving `DialogContent` MUST include `DialogDescription` by default.
---
# Reusable Prevention Pattern
Always include a description when using Dialog:
```jsx
<DialogContent>
  <DialogHeader>
    <DialogTitle>Title</DialogTitle>
    <DialogDescription>Accessible description here.</DialogDescription>
  </DialogHeader>
</DialogContent>
```
If no visual description is desired, use `sr-only` to hide it while keeping it accessible:
```jsx
<DialogDescription className="sr-only">Screen reader only description</DialogDescription>
```
---
# Anti-Patterns
- Using Dialogs without descriptions.
- Ignoring console warnings about accessibility.
---
# Resolution Summary
Updated all `DialogContent` implementations to include `DialogDescription` or `sr-only` descriptions, resolving all console warnings.
---
# Validation Checklist
* [x] All dialogs verified for accessibility compliance.
* [x] Console warnings resolved.
