# Master Prompts Collection

## AI Code Generation Workflow
PROMPT — AI Code Generation Workflow

Before generating code:

Read:
- SSOT.md
- CURRENT_TASK.md
- relevant rules
- relevant incidents
- relevant patterns
- relevant ADRs

Then:

1. Explain implementation plan
2. Explain reused patterns
3. Identify architectural risks
4. Explain regression prevention strategy
5. Identify edge cases
6. Explain tradeoffs
7. Only then generate code

Requirements:
- avoid architectural drift
- avoid unnecessary abstractions
- avoid rewriting stable systems
- preserve existing patterns
- avoid duplicated state
- avoid hidden side effects
- prioritize stability over cleverness

---

## Generate Current Test File
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

---

## Generate New ADR
PROMPT — Generate New ADR

Read:
- SSOT.md
- related rules
- related patterns
- current architecture

Task:
Generate a complete Architecture Decision Record using ADR_Template.md.

Requirements:
- explain context clearly
- compare alternatives
- explain tradeoffs honestly
- describe architectural consequences
- define implementation rules
- define anti-patterns
- avoid vague justifications

---

## Generate New Incident File
PROMPT — Generate New Incident File

Read:
- SSOT.md
- related implementation logs
- related rules

Task:
Analyze the bug/error and generate a complete incident markdown file using Incident_Template.md.

Requirements:
- identify root cause
- identify architectural mistake
- extract reusable prevention principles
- generate anti-patterns
- avoid shallow explanations
- focus on engineering reasoning
- explain regression risks
- generate reusable prevention patterns

---

## Generate New Rules File
PROMPT — Generate New Rules File

Read:
- SSOT.md
- relevant incidents
- relevant patterns

Task:
Generate a production-grade engineering rules markdown file.

Requirements:
- follow Rules_Template.md structure
- focus on architectural prevention, not naming conventions
- include rationale, anti-patterns, enforcement, validation strategy
- make rules reusable and scalable
- avoid vague advice
- include practical examples

---

## Generate Tasks From Features
PROMPT — Generate Tasks From Features

Read:
- SSOT.md
- relevant ADRs
- relevant rules
- relevant patterns
- relevant incidents

Task:
Analyze the feature request and break it into incremental engineering tasks.

Requirements:
- use Task_Template.md structure
- create small stable implementation slices
- avoid giant tasks
- preserve architectural consistency
- identify dependencies
- identify risks
- identify edge cases
- define validation strategy
- reuse existing patterns
- prevent regressions from known incidents

Output Rules:
- tasks must be implementation-ready
- each task must be independently testable
- each task must have clear scope boundaries
- tasks must avoid hidden architectural coupling

---

## Post-Implementation Knowledge Extraction
PROMPT — Post-Implementation Knowledge Extraction

Read:
- CURRENT_TASK.md
- implementation result
- errors encountered
- implementation logs

Task:
Analyze the completed implementation and extract reusable engineering knowledge.

Generate:
- implementation log updates
- new incidents if needed
- new rules if needed
- new patterns if needed
- ADR updates if architecture changed

Requirements:
- focus on reusable engineering lessons
- identify architectural mistakes
- identify regression risks
- generate anti-patterns
- avoid shallow summaries
