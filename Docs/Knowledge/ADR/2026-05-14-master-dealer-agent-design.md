# ADR-003

---

# Title

Master Dealer and Agent Management UI Design

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

To support the risk management and lottery sales operations, the system requires CRUD interfaces for managing both 'Agents' (who sell tickets) and 'Master Dealers' (who handle risk offloading/hold management).

---

# Problem Statement

Provide consistent, intuitive interfaces for managing multiple entities with similar data structures while ensuring backend business logic and database integrity are maintained.

---

# Decision

Use the established **Master-Detail** pattern for both Agents and Master Dealers.

1. **Uniform Pattern**: Both modules will use the same Sidebar-Detail layout as the Draw Management module.
2. **Standardized CRUD**: Both will utilize standard create/edit/delete workflows via `Dialog` components and the `callPython` bridge.
3. **Domain Separation**: Separate services (`AgentService` and `MasterDealerService`) will handle entity-specific logic, even though the data fields are currently identical.
4. **Navigation**: Both will be accessible from the main `Navbar`.

---

# Scope

- `AgentsPage.jsx` and `MasterDealersPage.jsx` components.
- `AgentService` and `MasterDealerService` Python classes.
- Bridge methods: `get_agents`, `create_agent`, `update_agent`, `delete_agent`, `get_master_dealers`, `create_master_dealer`, `update_master_dealer`, `delete_master_dealer`.

---

# Goals

- Maintain UI consistency across all management pages.
- Centralize entity lifecycle management in the backend.
- Ensure efficient CRUD workflows for administrators.

---

# Non-Goals

- Does not include complex risk offloading logic at this stage.
- Does not handle ticket sales or settlement calculations (these will be separate tasks).

---

# Alternatives Considered

## Option 1

Name:
Shared Management Page

Reason Rejected:
Would lead to excessive complexity in state management and navigation; separate modules provide better domain isolation.

---

# Tradeoffs

## Advantages

- **Consistency**: Users learn the UI pattern once and apply it everywhere.
- **Maintainability**: Clear separation of concern in backend services.

## Disadvantages

- **Redundancy**: Similar form fields and layout logic are duplicated in separate files (accepted for domain isolation).

---

# Consequences

- The `agents` and `master_dealers` tables must be kept in sync with the frontend form requirements.
- Any future field additions (e.g., phone numbers, addresses) must be updated in both UI and backend services.

---

# Architectural Impact

- Establishes a scalable pattern for all future entity management modules (e.g., Players, Locations).

---

# Implementation Rules

- Must strictly follow the Master-Detail UI pattern.
- All backend CRUD operations must be delegated to dedicated services.
- Data validation must occur on both the frontend (form level) and backend (service level).

---

# Anti-Patterns

- Copy-pasting the same component logic without reusing generic UI primitives.
- Combining Agents and Master Dealers into a single service or page.

---

# Risks

- **Naming Collisions**: If generic names like `create` or `delete` are used without service-specific context.

---

# Mitigation Strategy

- **Service-specific API endpoints**: Use clearly named methods in `main.py` (`create_agent`, `create_master_dealer`).

---

# Related Rules

- draw-management-rules.md
- bridge-rules.md

---

# Related Patterns

- master-detail-ui-pattern.md
- bridge-communication-pattern.md

---

# Files/Systems Affected

- backend/services/agent_service.py
- backend/services/master_dealer_service.py
- frontend/src/pages/AgentsPage.jsx
- frontend/src/pages/MasterDealersPage.jsx

---

# Validation Strategy

- CRUD operations work as expected via the UI.
- Database records are correctly created/updated/deleted.
- Sidebar selection state remains stable after mutations.

---

# Rollback Plan

- Revert individual service or page files to previous working state.

---

# Notes

This architecture allows for rapid onboarding of new management modules.
