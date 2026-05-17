# Template Preview Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Template Preview UI to achieve a professional "Technical Sheet" aesthetic, ensuring 100% viewport containment and uniform vertical rhythm.

**Architecture:** Refactor the existing React template component to use CSS grid/flexbox for viewport-relative sizing, removing headers and implementing strict zebra striping and border logic as per the specification.

**Tech Stack:** React, Tailwind CSS.

---

### Task 1: Setup Viewport-Relative Container

**Files:**
- Modify: `frontend/src/pages/OffloadPage.jsx`

- [ ] **Step 1: Set up the main container to fill the viewport**
Modify the `main` tag in `OffloadPage.jsx` to include `h-full overflow-hidden`. Ensure the parent element is also sized correctly.

- [ ] **Step 2: Update the Template Wrapper**
Ensure the white "paper" container uses `flex flex-col h-full`.

- [ ] **Step 3: Commit**
```bash
git add frontend/src/pages/OffloadPage.jsx
git commit -m "feat: setup viewport-relative container for template"
```

### Task 2: Redesign Template Visuals

**Files:**
- Modify: `frontend/src/components/features/draws/TemplatePreview.jsx` (I assume this exists based on the spec, verify if needed)

- [ ] **Step 1: Implement the 4-column data grid**
Use CSS grid to maintain 4 columns for ticket data, ensuring uniform row height.

- [ ] **Step 2: Remove Table Headers**
Strip out all header rows from the 4-column data area.

- [ ] **Step 3: Implement Zebra Striping and Borders**
Add `bg-black/[0.015]` to alternating rows. Set subtotal row border to 1px and footer border to 2px.

- [ ] **Step 4: Refine Typography**
Resize 'KALAW' to `text-2xl` and switch body labels to sans-serif, ticket values to monospaced.

- [ ] **Step 5: Ensure 15-row uniformity**
Force the rendering of 15 rows in each column, even if empty, using array mapping.

- [ ] **Step 6: Commit**
```bash
git add frontend/src/components/features/draws/TemplatePreview.jsx
git commit -m "feat: redesign template preview with new aesthetic"
```

### Task 3: Final Verification

**Files:**
- Test: Manual visual inspection in the app.

- [ ] **Step 1: Run application and verify visual criteria**
Ensure the template fits, borders are correct, and rhythm is uniform.

- [ ] **Step 2: Commit**
```bash
git commit -m "chore: verify template preview redesign"
```
