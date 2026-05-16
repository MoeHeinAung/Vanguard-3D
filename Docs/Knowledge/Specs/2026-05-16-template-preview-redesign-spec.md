# Template Preview Redesign Specification

**Status:** Draft
**Topic:** Risk Management Template Preview UI Refinement
**Date:** 2026-05-16

## 1. Goal
Redesign the `Template Preview` section of the Risk Management page to achieve a professional, contemporary "Technical Sheet" aesthetic. The redesign must balance high-density data presentation with a polished visual hierarchy, ensuring the template is functional, well-proportioned, and fits perfectly within the viewport.

## 2. Structural Requirements
- **Viewport Containment**: The template must occupy 100% of its parent container's width and height. It must use flexbox/grid to ensure it fills available space without overflowing the app's viewport.
- **4-Column Grid**: Maintain the 4-column layout for ticket data.
- **Uniform Row Height**: All rows (data-filled and empty) must have an identical height to maintain a consistent vertical rhythm.
- **Header/Footer Preservation**:
    - **Header**: Maintain positioning of `Kalaw` (Left), `[Date]` (Right), and `Page [N]` (Right).
    - **Footer**: Maintain positioning of `Total Amount - [Number] Ks`.

## 3. Visual & Styling Constraints (Approach 2)
- **Typography**:
    - `KALAW`: Scale down to a balanced size (e.g., `text-2xl` or `text-3xl`) with bold weight and tracking. It should feel like a brand mark, not an oversized header.
    - **Body Text**: Use a clean sans-serif for labels and a monospaced font for ticket numbers and amounts for alignment.
- **Table Body**:
    - **Remove Headers**: All table headers (`Ticket`, `Amount`) within the 4 columns must be removed.
    - **Zebra Striping**: Implement extremely subtle zebra striping (e.g., `bg-black/[0.015]` or `bg-slate-50`) to aid horizontal scanning.
- **Border Logic**:
    - **Subtotal Row**: Top border width must be exactly `1px`.
    - **Template Footer**: Top border width must be exactly `2px`.
- **Spacing**: Use a consistent spacing scale for padding and margins to ensure the sheet looks "designed" rather than just "filled."

## 4. Technical Implementation Notes
- **Container**: The `main` tag in `OffloadPage.jsx` should use `h-full` and `overflow-hidden`.
- **Template Wrapper**: The white "paper" container should use `flex flex-col h-full`.
- **Data Columns**: Use a grid or flex-based approach for the 15 rows in each column to ensure they stretch/shrink uniformly to fill the vertical space of the `flex-1` body area.
- **Empty Rows**: Explicitly render empty rows to maintain the 15-row structure even with partial data.

## 5. Success Criteria
- [ ] Template fits perfectly in the viewport without scrolling.
- [ ] 'KALAW' text is appropriately sized relative to other elements.
- [ ] Subtotal borders are 1px; Footer top border is 2px.
- [ ] No table headers are visible in the body columns.
- [ ] Subtle zebra striping is visible but not distracting.
- [ ] Vertical rhythm is perfectly uniform across all columns.
