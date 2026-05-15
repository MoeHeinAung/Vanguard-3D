# SSOT.md

# Single Source of Truth

This document defines the authoritative engineering rules, architecture decisions, development workflow, and AI collaboration strategy for this project.

All AI-generated code and engineering decisions must follow this document.

---

# Project Overview

## Project Name

Vanguard 3D

---

## Purpose

Vanguard 3D is a lottery ticket management system for dealers and agents to handle draws, sales, offloads, and settlements.

---

## Tech Stack

Backend - Python
Frontend - React JSX (not TSX) + shadcn/ui + Tailwind CSS
Database - Sqlite3
Bridge - pywebview

---

## UI Design System

### Framework
- **shadcn/ui** - Modern component library built on Radix UI primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons/Lucide** - Icon library

### Theme
- Dark mode by default with futuristic aesthetic
- CSS variables for consistent theming
- Glassmorphism effects via backdrop-filter
- Radial gradient background for depth

### Component Structure
```
src/components/ui/      # shadcn primitive components
  ├── button.jsx
  ├── card.jsx
  ├── dialog.jsx
  ├── input.jsx
  ├── label.jsx
  ├── badge.jsx
  └── textarea.jsx
```

---

## Architecture Structure 

```
Vanguard-3D/
├── backend/          # Python server layer
│   ├── api/          # Endpoint handlers by domain
│   ├── database/     # SQLite connection + schema management
│   ├── models/       # ORM-style data models
│   └── services/     # Business logic
│
├── frontend/         # React application
│   ├── src/
│   │   ├── pages/            # Route-level components
│   │   ├── components/
│   │   │   ├── features/     # Domain-specific components (forms, tables)
│   │   │   ├── layout/       # Navbar navigation
│   │   │   └── ui/           # Primitive components (Button, Card, Textarea, Dialog)
│   │   ├── services/         # API abstraction layer
│   │   ├── context/          # Notification state provider
│   │   └── utils/            # pywebview bridge utility
│   └── ...
│
└── main.py          # pywebview entry point (desktop wrapper)
```

---

# Core Engineering Philosophy

- Build small stable slices first.
- Scale incrementally.
- Avoid premature abstraction.
- Reuse proven patterns before introducing new systems.
- Stability is more important than speed.
- Every feature must preserve backward compatibility.
- Every bug must generate reusable engineering knowledge.

---

# AI Collaboration Strategy

AI is treated as:
- an implementation assistant
- a pattern reuse engine
- a reasoning assistant

AI is NOT trusted as:
- final architecture authority
- automatic system designer
- unrestricted refactoring engine

---

# AI Behavior Rules

Before generating code, AI must:

1. Read Docs/CURRENT_TASK.md
2. Read relevant rules
3. Read relevant incidents
4. Read relevant patterns
5. Reuse existing architecture whenever possible

AI must:
- avoid architectural mistakes, not variable names
- explain tradeoffs before major refactors
- preserve existing stable patterns
- avoid introducing unnecessary abstractions
- avoid large-scale rewrites without approval

---

# Development Workflow

## Standard Workflow

1. Define small feature
2. Create CURRENT_TASK.md
3. Read relevant rules/incidents/patterns
4. Generate implementation plan
5. Implement small stable slice
6. Validate manually
7. Fix issues
8. Extract lessons learned
9. Update incidents/rules/patterns/logs
10. Move to next feature

---

# Architecture Principles

- Keep business logic separated from UI
- Prefer composition over inheritance
- Avoid hidden side effects
- Keep data flow predictable
- Avoid duplicated state
- Prefer explicitness over magic abstractions

---

# State Management Policy

- Local UI state stays local
- Server state must use centralized fetch patterns
- Avoid duplicated derived state
- Async state must always support:
  - loading state
  - error state
  - cleanup handling

---

# API Policy

- All API responses require validation
- API access must go through shared API layer
- Never call APIs directly inside presentation components
- All async operations require error handling

---

# Error Prevention Policy

Every resolved bug must generate:
- root cause analysis
- prevention rules
- reusable patterns
- anti-patterns

AI must review relevant incidents before implementation.

---

# Documentation Rules

## Incidents

Must contain:
- root cause
- architectural mistake
- prevention rules
- anti-patterns

---

## Rules

Must contain:
- rationale
- enforcement guidance
- examples
- anti-patterns

---

## ADRs

Must explain:
- why decision exists
- alternatives considered
- tradeoffs
- future consequences

---

# Architectural Decision Policy

Major architectural changes require ADR documentation.

Examples:
- state management changes
- routing changes
- authentication redesign
- database strategy changes

---

# Refactoring Policy

Refactoring is allowed ONLY when:
- duplication becomes harmful
- complexity becomes unstable
- performance problems exist
- architecture inconsistency becomes dangerous

Avoid refactoring stable working systems unnecessarily.

---

# Testing Philosophy

Minimum required validation:
- manual validation
- edge case testing
- regression testing

Critical systems require:
- integration testing
- runtime validation
- failure scenario testing

---

# Knowledge Management Strategy

Knowledge is divided into:
- rules
- incidents
- patterns
- ADRs
- implementation logs

Do NOT overload AI with unnecessary historical context.

Load only relevant knowledge.

---

# Context Loading Rules

AI must NEVER read all project documents at once.

Load only:
- current task
- relevant rules
- relevant incidents
- relevant patterns
- relevant ADRs

---

# Stability Rules

NEVER:
- generate massive features at once
- rewrite entire architecture without reason
- introduce multiple abstractions simultaneously
- ignore existing patterns

ALWAYS:
- implement incrementally
- validate before scaling
- reuse proven structures
- extract reusable lessons from failures

---

# Definition of Done

A feature is considered complete only if:
- functionality works
- edge cases handled
- regression tested
- logs updated
- incidents documented if needed
- reusable knowledge extracted

---

# Future Scaling Strategy

Scale using:
- stable patterns
- reusable architecture
- incremental feature growth
- validated abstractions

Avoid:
- speculative architecture
- overengineering
- premature optimization

---

# Final Engineering Principle

Small stable systems evolve better than large unstable systems.