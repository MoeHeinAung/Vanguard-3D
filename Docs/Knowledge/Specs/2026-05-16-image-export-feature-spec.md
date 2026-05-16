# Automatic Image Export Specification

**Status:** Draft
**Topic:** Risk Management Template Preview Image Export
**Date:** 2026-05-16

## 1. Goal
Implement an automatic image export feature that captures the "Template Preview" as a PNG image and triggers a browser download when an Administrator successfully performs an offload. This facilitates easy sharing of offload records with Master Dealers.

## 2. Requirements
- **Automatic Trigger**: Image export must trigger immediately after a successful "Perform Offload" action.
- **Client-Side Generation**: Use `html2canvas` to capture the DOM element as an image.
- **Direct Download**: Trigger a browser download of the generated PNG.
- **Naming Convention**: Files should be named `KALAW_OFFLOAD_[DATE]_PAGE_[PAGE_NUMBER].png`.
- **Target Element**: Specifically capture the white "paper" container of the template preview.

## 3. Technical Design
### Frontend Integration
- **Dependency**: Add `html2canvas` to `frontend/package.json`.
- **Component**: Update `OffloadPage.jsx`.
- **Reference**: Use `useRef` to target the template container.
- **Logic**:
    - Create a `downloadTemplateAsImage` helper function.
    - This function will:
        1. Capture the targeted ref using `html2canvas`.
        2. Set `scale: 2` (or similar) for high-resolution output.
        3. Convert the canvas to a PNG Data URL.
        4. Create a temporary `<a>` element and click it to trigger download.

### Workflow
1. User clicks "Perform Offload".
2. `handlePerformOffload` is called.
3. `callPython('create_offload', ...)` is executed.
4. On success:
    - Call `downloadTemplateAsImage()`.
    - Update settings (page number).
    - Refresh data.

## 4. Success Criteria
- [ ] `html2canvas` is installed and functional.
- [ ] Clicking "Perform Offload" results in a successful data offload AND a PNG download.
- [ ] Exported image accurately reflects the UI preview.
- [ ] Exported image has a professional file name.
- [ ] The process does not block the user significantly or cause UI glitches.
