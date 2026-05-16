# Template Preview Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Template Preview table in the Risk Management page to a professional "Contemporary Technical Sheet" aesthetic with specific border and typography constraints.

**Architecture:** Refactor the `OffloadPage.jsx` main content area. Replace the standard table structure with a more flexible flexbox/grid layout that ensures uniform row heights and viewport containment. Apply Tailwind CSS classes for subtle zebra striping and specific border widths.

**Tech Stack:** React, Tailwind CSS, Lucide React (icons).

---

### Task 1: Refactor Template Header and Viewport Containment

**Files:**
- Modify: `frontend/src/pages/OffloadPage.jsx`

- [ ] **Step 1: Adjust `main` container and template wrapper for 100% fill**

Modify the `<main>` and the white template container to ensure they take up full height and prevent overflow.

```jsx
// Around line 290
<main className="flex-1 bg-black/40 p-6 overflow-hidden flex flex-col items-center justify-center">
  {templateBatch.length > 0 ? (
    <div className="w-full h-full bg-white text-black p-10 shadow-2xl relative overflow-hidden flex flex-col">
```

- [ ] **Step 2: Redesign 'KALAW' and Header layout**

Update typography for 'KALAW' and adjust the header border.

```jsx
// Template Header section
<div className="flex justify-between items-baseline border-b-2 border-black pb-4 mb-6">
  <div>
    <h1 className="text-3xl font-bold uppercase tracking-[0.2em] leading-none">KALAW</h1>
  </div>
  <div className="flex items-baseline gap-6 text-right">
    <p className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest">{selectedDraw?.draw_date}</p>
    <p className="text-lg font-bold uppercase tracking-widest leading-none">
      <span className="text-[10px] mr-2 opacity-30">PAGE</span> {pageNumber}
    </p>
  </div>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/OffloadPage.jsx
git commit -m "style: refactor template header and container for viewport containment"
```

### Task 2: Refactor 4-Column Grid and Row Styling

**Files:**
- Modify: `frontend/src/pages/OffloadPage.jsx`

- [ ] **Step 1: Update grid structure and remove table headers**

Replace the table-based columns with a more flexible structure that supports zebra striping and uniform row heights.

```jsx
// Template Body section
<div className="flex-1 grid grid-cols-4 gap-8 min-h-0 overflow-hidden">
  {templateGrid.map((column, colIdx) => (
    <div key={colIdx} className="flex flex-col h-full border-r border-black/5 last:border-r-0 pr-4 last:pr-0">
      <div className="flex-1 flex flex-col min-h-0">
        {Array.from({ length: 15 }).map((_, rowIdx) => {
          const item = column[rowIdx];
          return (
            <div 
              key={rowIdx} 
              className={`flex justify-between items-center px-2 py-1.5 flex-1 min-h-[28px] ${
                rowIdx % 2 === 0 ? 'bg-black/[0.015]' : ''
              }`}
            >
              <span className="font-mono text-sm font-bold tracking-tight">
                {item?.ticket || ''}
              </span>
              <span className="font-mono text-sm font-bold">
                {item ? item.amount.toLocaleString() : ''}
              </span>
            </div>
          );
        })}
      </div>
      {/* Subtotal row with 1px border */}
      <div className="mt-auto pt-2 border-t border-black flex justify-end items-center px-2">
        <span className="font-mono text-lg font-bold">
          {column.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
        </span>
      </div>
    </div>
  ))}
</div>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/OffloadPage.jsx
git commit -m "style: implement 4-column grid with zebra striping and 1px subtotal border"
```

### Task 3: Redesign Template Footer

**Files:**
- Modify: `frontend/src/pages/OffloadPage.jsx`

- [ ] **Step 1: Implement 2px border and professional footer styling**

Update the footer to match the specification's border and typography requirements.

```jsx
// Template Footer section
<div className="mt-6 pt-6 border-t-2 border-black flex justify-between items-center">
  <div className="flex flex-col">
    <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Security Verification</span>
    <span className="font-mono text-[9px] text-gray-400">V3D-OFFLOAD-SYS-REF-{selectedDraw?.id}</span>
  </div>
  <div className="flex items-baseline gap-4">
    <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Total Amount Offloaded</span>
    <div className="flex items-baseline gap-2">
      <span className="text-4xl font-bold font-mono">
        {batchTotal.toLocaleString()}
      </span>
      <span className="text-xl font-bold italic opacity-60">Ks</span>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Final verification of viewport fit**

Ensure `p-10` on the wrapper and the gaps/paddings allow for 15 rows to fit without overflow.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/OffloadPage.jsx
git commit -m "style: implement 2px footer border and polished footer layout"
```
