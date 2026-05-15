# ADR-006

---

# Title

Sales Engine Aggregation and Calculation Model

---

# Status

ACTIVE

---

# Date

2026-05-15

---

# Decision Makers

- Project Owner
- AI Engineering Workflow

---

# Context

The application requires sophisticated real-time ticket analysis to support risk management (offloading). The "Admin Hold" (House Hold) threshold is a dynamic variable that changes frequently and must instantly update calculations across thousands of ticket records.

---

# Problem Statement

How to perform complex ticket aggregation (Taken vs. Pending) based on a dynamic user-configurable threshold while maintaining UI performance and data integrity.

---

# Decision

Implement a **Reactive Derived State** model in the frontend using React's `useMemo`.

1.  **Formula Standard**:
    - **Total**: $\sum(\text{Sales Amount per Ticket})$
    - **Taken (House)**: $\min(\text{Total}, \text{Admin Hold})$
    - **Pending (Offload)**: $\max(\text{Total} - \text{Admin Hold}, 0)$
2.  **Aggregation Strategy**:
    - Perform all grouping and mathematical calculations in the frontend to provide instant feedback when the "House Hold" input changes.
    - Use `useMemo` with dependencies on both the `sales` array and the `adminHold` value.
3.  **UI Filtering**:
    - Automatically hide tickets with 0 "Pending" amount when in the "Pending" tab to focus administrative attention on offloading needs.
4.  **Summary Tier**:
    - Calculate a global total for the currently active tab's primary metric to ensure high-level visibility.

---

# Scope

- `SalesPage.jsx` logic.
- Ticket calculation formulas.

---

# Goals

- Zero-latency updates when adjusting thresholds.
- Accurate financial reporting for risk management.
- Clean, focused data views for different administrative tasks.

---

# Non-Goals

- This model does not persist the "House Hold" value to the database (session-based for now).
- Does not handle currency conversion or complex commissions (handled in separate services).

---

# Tradeoffs

## Advantages

- **Instant UX**: No network round-trips needed for threshold adjustments.
- **Dynamic Analysis**: Allows "what-if" scenarios for risk management.

## Disadvantages

- **Memory Usage**: Frontend must hold the full sale set for the current draw.

---

# Consequences

- The `sales` dataset for a single draw should be kept under a few thousand records to maintain frontend performance.

---

# Implementation Rules

- Formulas must strictly follow the defined `min/max` logic.
- Numerical data must always be formatted via `toLocaleString()` for readability.
- Numerical columns must use `font-mono`.

---

# Anti-Patterns

- **Backend Round-Trips**: Sending the "House Hold" value to Python for simple arithmetic.
- **Nested Loops**: Calculating aggregates inside the render loop without memoization.

---

# Related Rules

- api-robustness-rules.md
- SSOT.md

---

# Related Patterns

- master-detail-ui-pattern.md

---

# Files/Systems Affected

- frontend/src/pages/SalesPage.jsx

---

# Validation Strategy

- Verify that increasing the "House Hold" increases the "Taken" amount and decreases the "Pending" amount proportionally.
- Ensure the "Total Summary" footer matches the sum of the rows in every tab.

---

# Notes

This engine is the foundation for the upcoming "Offloading" module.
