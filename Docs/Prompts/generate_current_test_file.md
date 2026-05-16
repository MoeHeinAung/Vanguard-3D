Convert the provided feature request into a production-grade CURRENT_TASK.md file by analyzing the following source documents: SSOT.md, related rules, related patterns, related ADRs, and related incidents.

The feature request is: "Only one open draw can exist at a time. When the cut off time is passed, current open draw should change to closed and don't accept sales from Agents anymore. After Admin added winning tickets, current draw status should change to Settled and generate detailed reports."

The resulting CURRENT_TASK.md must adhere to these requirements:
- Decompose the work into very small, stable, and incremental implementation slices.
- Prevent large implementation scopes by strictly defining included vs. excluded scope.
- Define specific architectural constraints and identify all technical dependencies.
- Detail potential edge cases, implementation risks, and necessary validation steps.
- Mandate the reuse of existing patterns and explicitly forbid unnecessary abstractions.


When asking to write code
-----------------------------------------
Before writing any code, conduct a thorough review of the following documentation to ensure alignment with project standards and context: SSOT.md, CURRENT_TASK.md, all relevant rules, recent incidents, established patterns, and applicable Architectural Decision Records (ADRs). Once the review is complete, proceed to implement the work by completing one task at a time, pausing to request user review and approval before moving on to the subsequent task.


When getting errors
--------------------------------
Analyze the following error logs. Before proposing any code fixes or solutions, perform a comprehensive review of the following documentation to ensure no regressions occur and that existing solutions are not duplicated:

- SSOT.md
- CURRENT_TASK.md
- Relevant project rules
- Relevant incident reports
- Relevant design patterns
- Relevant Architectural Decision Records (ADRs)

Ensure that your proposed solution adheres to established patterns and specifically avoids reintroducing errors or incidents that have already been resolved.