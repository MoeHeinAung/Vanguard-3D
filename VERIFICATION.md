# Vanguard 3D — UI/UX Overhaul Verification Guide

This document provides step-by-step instructions to verify the aesthetic and functional improvements made to the Vanguard 3D Lottery Management System.

## 1. Prerequisites
Ensure the development server is running. If not, start it with:
\`\`\`bash
cd frontend && npm run dev
\`\`\`
The application will be available at `http://localhost:5173`.

## 2. Global Design System Verification
- **Viewport Containment**: The application should always fit within the browser window. There should be no global scrollbar on the `body`. Individual panels (like the Ticket List or Agent Table) should have their own internal scrollbars.
- **Typography**:
    - UI labels and body text should use **Inter**.
    - Numerical data, currency, and IDs should use **Space Grotesk** (monospaced-feel) for maximum readability.
- **Color Palette**: The UI should follow an "Obsidian & Slate" theme with high-contrast Cyan and Violet accents.

## 3. Page-Specific Checkpoints

### A. Terminal Dashboard (Home)
- **Visuals**: Observe the large "VANGUARD 3D" header with the radial background glow.
- **Interaction**: Hover over the operational cards (Draws, Sales Engine, Risk Management). You should see a "corner-accent" border glow and smooth scale transitions.

### B. Sales Engine
- **Operational Status**: Check the top right for the "Operational Status: Authenticated" indicator.
- **Data Density**: Verify the table uses the high-contrast data-table styling with sticky headers.

### C. Risk Management (Offload)
- **KALAW Template**: Execute an offload or view an offloaded record. The detail view should resemble a professional, high-fidelity monospaced document (the "KALAW" format) rather than a standard UI card.

### D. Ticket Summary
- **Master-Detail Layout**: Clicking a ticket in the left sidebar should instantly update the detail view on the right with a smooth fade-in animation.
- **Filtering**: Use the search bar in the header to filter the ticket list.

## 4. Interaction Polish
- **Page Transitions**: Click through different navbar items. You should see a subtle 0.4s fade-in and slide-up animation.
- **Input Focus**: Click any search input or dropdown. It should feature a Cyan outer glow and border highlight.
- **Scrollbars**: All internal scroll areas should use the custom thin, dark-themed scrollbars.

## 5. Core Logic Integrity
Verify that clicking "Execute Offload" or changing draw statuses still performs the expected backend actions (the bridge to Python remains untouched).
