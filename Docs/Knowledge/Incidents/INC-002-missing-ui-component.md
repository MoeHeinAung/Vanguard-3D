# Incident ID
INC-002
---
# Title
Dependency Resolution Failure: Missing UI Primitive
---
# Status
RESOLVED
---
# Severity
MEDIUM
---
# Category
Frontend
---
# Date
2026-05-15
---
# Related Feature
Sale Management (TASK-004)
---
# Symptom
Vite build error: `Failed to resolve import "@/components/ui/select"`
---
# Error Message
Failed to resolve import "@/components/ui/select" from "src/pages/SalesPage.jsx"
---
# Root Cause
The `SalesPage` implementation assumed the existence of a `Select` component primitive within `src/components/ui/`, which has not been initialized or installed in this project. 
---
# Architectural Mistake
Assumed availability of standard `shadcn/ui` primitives without verifying the current local `ui/` directory state before implementation.
---
# Prevention Principles
- Always verify component existence in `frontend/src/components/ui/` before importing.
- If a component is missing, either implement it or fallback to existing primitives.
- Architecture should explicitly define which `shadcn` components are initialized.
---
# Mandatory Prevention Rules
- Verify `components/ui/` contents before adding new imports.
- Update `Docs/SSOT.md` or a local registry if new primitives are added.
---
# Resolution Summary
1. Installed `@radix-ui/react-select` dependency.
2. Implemented `frontend/src/components/ui/select.jsx` using the project's Modern-Futuristic design tokens (glassmorphism, `rounded-none`).
---
# Validation Checklist
* [x] Verify file existence before adding `import` statements.
* [x] Initialize missing `shadcn` components using standard CLI or templates.
