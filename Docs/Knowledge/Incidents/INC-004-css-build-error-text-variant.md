# Incident ID
INC-004
---
# Title
CSS Build Error: Undefined Utility Class 'text-on-surface-variant'
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
# Related Feature
General Frontend Styling
---
# Symptom
Vite build error: `[postcss] ... The text-on-surface-variant class does not exist.`
---
# Error Message
Failed to resolve import "text-on-surface-variant" in index.css
---
# Root Cause
The CSS used an unsupported Tailwind utility class (`text-on-surface-variant`). While this was a conceptual token name, it was not defined as an actual CSS class in the `index.css` or Tailwind configuration.
---
# Architectural Mistake
Directly applying a non-standardized utility class inside an `@apply` directive without checking availability in Tailwind's utility registry.
---
# Prevention Principles
- Only use standard Tailwind colors or validated custom design tokens.
- Custom tokens meant for utility usage must be explicitly mapped in `tailwind.config.js` or defined in `index.css` under the `@layer utilities` directive.
---
# Mandatory Prevention Rules
- Avoid using arbitrary tokens in `@apply` without registering them as utilities or Tailwind theme extensions.
- Verify new utility classes in the dev environment immediately after application.
---
# Resolution Summary
Replaced `text-on-surface-variant` with `text-muted-foreground`, which is the standard, pre-defined Tailwind utility in this project for secondary-level text.
