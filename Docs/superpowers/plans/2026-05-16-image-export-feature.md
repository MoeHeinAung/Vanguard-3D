# Image Export Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement automatic PNG image export of the Template Preview when performing an offload.

**Architecture:** Use `html2canvas` on the frontend to capture a React ref of the template container. Trigger the capture and download as part of the successful offload workflow in `OffloadPage.jsx`.

**Tech Stack:** React, html2canvas.

---

### Task 1: Install Dependencies

**Files:**
- Modify: `frontend/package.json`

- [ ] **Step 1: Install `html2canvas`**

Run: `npm install html2canvas --prefix frontend`
Expected: `html2canvas` added to dependencies.

- [ ] **Step 2: Commit**

```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "build: add html2canvas dependency"
```

### Task 2: Setup Reference and Export Logic

**Files:**
- Modify: `frontend/src/pages/OffloadPage.jsx`

- [ ] **Step 1: Import `html2canvas` and create `useRef`**

```jsx
// Top of file
import html2canvas from 'html2canvas';
import React, { useState, useEffect, useMemo, useRef } from 'react';

// Inside OffloadPage component
const templateRef = useRef(null);
```

- [ ] **Step 2: Implement `downloadTemplateAsImage` function**

```jsx
const downloadTemplateAsImage = async () => {
  if (!templateRef.current) return;
  
  try {
    const canvas = await html2canvas(templateRef.current, {
      scale: 2, // High resolution
      useCORS: true,
      backgroundColor: '#ffffff'
    });
    
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    const dateStr = selectedDraw?.draw_date || new Date().toISOString().split('T')[0];
    link.href = image;
    link.download = `KALAW_OFFLOAD_${dateStr}_PAGE_${pageNumber}.png`;
    link.click();
  } catch (error) {
    console.error("Image export failed:", error);
  }
};
```

- [ ] **Step 3: Attach `templateRef` to the paper container**

```jsx
// Locate the paper container div (around line 290)
<div ref={templateRef} className="w-full h-full bg-white text-black p-10 shadow-2xl relative overflow-hidden flex flex-col">
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/OffloadPage.jsx
git commit -m "feat: add image capture logic and template reference"
```

### Task 3: Integrate with Offload Workflow

**Files:**
- Modify: `frontend/src/pages/OffloadPage.jsx`

- [ ] **Step 1: Trigger download in `handlePerformOffload`**

```jsx
const handlePerformOffload = async () => {
  if (templateBatch.length === 0 || !selectedDealerId || !selectedDraw) return;
  
  setIsLoading(true);
  try {
    const inputText = templateBatch.map(b => `${b.ticket} = ${b.amount}`).join('\n');
    
    await callPython('create_offload', {
      draw_id: selectedDraw.id,
      master_dealer_id: selectedDealerId,
      input_text: inputText,
      notes: `Offload Page ${pageNumber}`
    });
    
    // Trigger image export BEFORE updating state/refreshing
    await downloadTemplateAsImage();
    
    const nextPg = pageNumber + 1;
    await handleSettingChange('page_number', nextPg);
    
    await fetchData();
  } catch (error) {
    console.error('Offload failed:', error);
  } finally {
    setIsLoading(false);
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/OffloadPage.jsx
git commit -m "feat: trigger automatic image export on successful offload"
```
