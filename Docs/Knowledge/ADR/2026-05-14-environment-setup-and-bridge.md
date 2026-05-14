# ADR-001

---

# Title

Environment Setup and Bridge Connection

---

# Status

ACTIVE

---

# Date

2026-05-14

---

# Decision Makers

- Project Owner
- AI Engineering Workflow

---

# Context

The project requires a stable foundation for a desktop-class lottery management system. We need a bridge between a Python backend (for database and system access) and a modern React frontend (for high-fidelity UI).

---

# Problem Statement

How to establish a secure, performant, and developer-friendly connection between Python and React in a standalone desktop environment while maintaining a clean project structure.

---

# Decision

1. **Backend Structure**: Scaffold `backend/` with domain-driven subdirectories: `api`, `database`, `models`, and `services`.
2. **Frontend UI Library**: Use **shadcn/ui** and **Tailwind CSS** for a modern, utility-first design system.
3. **Bridge**: Use **pywebview** to host the React application and expose a Python `API` class to the frontend via the `window.pywebview.api` object.
4. **Dev Workflow**: Use **Vite** as the frontend build tool and development server to enable Hot Module Replacement (HMR).

---

# Scope

- Overall project directory structure.
- Communication layer between Python and JavaScript.
- Frontend styling and component architecture.
- Development environment configuration.

---

# Goals

- Maintain separation of concerns between business logic (Python) and presentation (React).
- Enable rapid UI development with utility classes.
- Provide a seamless desktop experience without a traditional web server in production.

---

# Non-Goals

- Does not cover specific database schema designs.
- Does not address remote API connectivity (purely local/desktop).
- Does not define specific business logic for lottery draws.

---

# Alternatives Considered

## Option 1

Name:
Flask/FastAPI + Standard HTTP

Reason Rejected:
Requires managing a local port, potential firewall issues, and more overhead for a standalone desktop app.

---

## Option 2

Name:
Electron

Reason Rejected:
Heavier footprint; Python is preferred for the backend logic and data processing requirements of this specific project.

---

## Option 3

Name:
Material UI (MUI)

Reason Rejected:
While initially considered, shadcn/ui was selected for better customization, smaller bundle sizes (via Tailwind), and more modern aesthetic control as per SSOT.md.

---

# Tradeoffs

## Advantages

- **Python Ecosystem**: Access to powerful data processing and system libraries.
- **Modern UI**: shadcn/ui provides high-quality Radix UI primitives.
- **Fast Iteration**: Vite + HMR provides near-instant feedback.
- **Direct Bridge**: No network latency or port management for Python/JS communication.

## Disadvantages

- **Bridge Asynchronicity**: Must handle the `pywebviewready` event.
- **No Type Safety across Bridge**: Data passed between Python and JS is dynamically typed.

---

# Consequences

- All backend logic must be organized into the `backend/` directory.
- Frontend components must follow the shadcn/ui structure in `src/components/ui`.
- Communication must go through the `bridge.js` utility.

---

# Architectural Impact

- **Hybrid Architecture**: Combines Python's stability with React's interactivity.
- **Decoupled Design**: The frontend can be developed and tested (mostly) independently of the backend using the Vite dev server.

---

# Implementation Rules

- Business logic belongs in `backend/services`.
- Database access belongs in `backend/database/manager.py`.
- All Python calls from React must use the `callPython` wrapper in `utils/bridge.js`.
- Frontend styling must exclusively use Tailwind CSS utility classes.

---

# Anti-Patterns

- Calling Python methods directly from UI components without the `bridge.js` wrapper.
- Mixing business logic into the `API` class in `main.py` (it should delegate to services).
- Using inline styles instead of Tailwind classes.

---

# Risks

- **Race Conditions**: Calling Python API before the bridge is ready.
- **Serialization Issues**: Passing complex non-serializable objects across the bridge.

---

# Mitigation Strategy

- **Bridge Utility**: `getPythonApi` promise in `bridge.js` ensures the bridge is ready before execution.
- **Data Transfer Objects**: Use simple dictionaries/JSON-serializable objects for bridge communication.

---

# Related Rules

- SSOT.md

---

# Related Patterns

- bridge-pattern.md

---

# Related Incidents

None.

---

# Files/Systems Affected

- main.py
- backend/*
- frontend/*
- Docs/SSOT.md

---

# Validation Strategy

- Verify `main.py` launches the window correctly.
- Verify `callPython('hello')` returns expected data in the console.
- Verify Tailwind styles are applied in the dev server.

---

# Rollback Plan

- Revert to standard HTTP (Flask/FastAPI) if `pywebview` bridge proves unstable for complex data.
- Switch to standard CSS/MUI if Tailwind complexity becomes unmanageable.

---

# Future Re-Evaluation Conditions

- Need for multi-window support beyond `pywebview` capabilities.
- Requirement for a web-based (non-desktop) version of the application.

---

# Superseded By

Empty.

---

# Notes

This setup prioritizes a "desktop-first" experience using modern web technologies.
