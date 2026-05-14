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