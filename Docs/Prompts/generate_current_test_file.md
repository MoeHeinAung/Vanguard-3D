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


UI and UX Design Performence
--------------------------------------
Act as an expert Product Designer and Senior UI/UX Engineer. Conduct a rigorous, critical audit of the provided frontend page structure for a desktop-based business intelligence and transaction management application. The application is a high-volume lottery dealership accountability platform designed for Business Admins, where stability, data accuracy, and local control are paramount.

Analyze the codebase and provide harsh, actionable feedback organized into the following four categories and for each and every pages present your findings in a markdown table that facilitates a direct comparison between the "Current Layout" and the "Proposed Layout":

1. Layout & Information Architecture: Critically evaluate the visual hierarchy. Identify deficiencies in the placement of main cards, hero sections, and primary call-to-action buttons.
2. Component Placement & Redundancy: Identify components that are misplaced or create cognitive load, recommending specific moves to other pages. Suggest essential components that are currently missing from headers, footers, or navigation elements.
3. Visual Design & Accessibility: Audit color theory, contrast ratios, and element scaling. For any identified accessibility or aesthetic failures, provide specific alternative hex codes and sizing adjustments.
4. New Page Blueprints: If the existing architecture is insufficient to meet the core user goals, propose a new page structure. Detail the specific components required for these new pages and their exact spatial arrangement.