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