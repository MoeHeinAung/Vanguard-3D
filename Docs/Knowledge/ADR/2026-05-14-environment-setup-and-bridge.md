# ADR: Environment Setup and Bridge Connection

## Status
Approved

## Context
We need to set up the foundation for Vanguard 3D, including the frontend UI library and the bridge between Python and React.

## Decision
1. **Frontend UI Library:** Use Material UI (MUI) as specified in SSOT.md.
2. **Backend Structure:** Scaffold `backend/` with `api`, `database`, `models`, and `services` subdirectories.
3. **Bridge:** Use `pywebview` to expose a Python `API` class to the frontend.
4. **Dev Workflow:** Use Vite dev server during development for HMR.

## Alternatives Considered
- **Flask/FastAPI + HTTP:** Rejected in favor of `pywebview`'s native bridge for a tighter desktop integration as per SSOT.md.
- **Tailwind CSS:** Rejected as SSOT.md specifies MUI.

## Consequences
- The frontend will have a dependency on MUI.
- Python methods will be available in JS under `window.pywebview.api`.
- We need to handle the asynchronous nature of the bridge (waiting for `pywebviewready`).
