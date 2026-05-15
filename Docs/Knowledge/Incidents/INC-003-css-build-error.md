# Incident ID
INC-003
---
# Title
CSS Build Error: Undefined Utility Class
---
# Status
RESOLVED
---
# Severity
LOW
---
# Category
Frontend
---
# Date
2026-05-15
---
# Symptom
Vite build error: `[postcss] ... The bg-surface-container/30 class does not exist.`
---
# Root Cause
The CSS used an unsupported Tailwind utility class (`bg-surface-container/30`). While `surface-container` might be a conceptual design token, it was not explicitly defined as a Tailwind color utility that supports opacity modifiers in the `tailwind.config.js` or `index.css`.
---
# Architectural Mistake
Directly applying a non-standardized utility class inside a `@apply` directive without checking availability in Tailwind's utility registry.
---
# Prevention Principles
- Only use standard Tailwind colors or validated custom design tokens.
- Custom tokens meant for utility usage must be explicitly mapped in `tailwind.config.js`.
---
# Mandatory Prevention Rules
- Avoid using arbitrary opacity modifiers (`/XX`) on classes not in the default or extended Tailwind color theme.
- Verify new utility classes in the dev environment immediately after application.
---
# Resolution Summary
Replaced `bg-surface-container/30` with `bg-slate-900/40`, a verified and consistent utility class already in use.
