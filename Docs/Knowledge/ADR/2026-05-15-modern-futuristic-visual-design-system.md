# ADR-004

---

# Title

Modern-Futuristic Visual Design System

---

# Status

ACTIVE

---

# Date

2026-05-15

---

# Decision Makers

- Project Owner
- AI Engineering Workflow

---

# Context

The original frontend styling was built incrementally using Tailwind utilities without a centralized design system. This led to:
- Inconsistent color usage across components
- No typographic scale or font family standards
- Ad-hoc glassmorphism (only a single backdrop blur in the Navbar)
- Basic micro-interactions (only color swaps)
- Scattered utility classes making maintenance difficult
- Accessibility concerns (inconsistent focus styling, insufficient contrast in places)
- No clear methodology for scaling the design language

The product now requires a professional, high-end "Modern-Futuristic" aesthetic that unifies all management interfaces under a single visual language.

---

# Problem Statement

Transform the interface into a modern-futuristic digital product with:
- Sophisticated typography and consistent hierarchy
- Refined color palette (deep neutrals, subtle gradients, purposeful accent glows)
- Glassmorphism effects throughout
- High-fidelity micro-interactions
- Responsive fluidity and accessibility compliance (WCAG)
- Optimized performance and scalable CSS methodology

---

# Decision

Adopt a design token-driven visual architecture:

1. **Design Tokens** (`frontend/src/styles/tokens.css`) – CSS custom properties for typography, color, shadows, glassmorphism, transitions, and radius.

2. **Global Stylesheet** (`frontend/src/index.css`) – Imports tokens, maps legacy Shadcn variables to the new palette, defines custom component utilities via `@layer` (`.glass-navbar`, `.glass-card`, `.btn-primary-gradient`, `.badge-elegant`), and adds elevation/transition helpers.

3. **Typography** – Load Inter (UI) and Space Mono (code) via Google Fonts, set as global defaults.

4. **Component Updates** – All UI components updated to use new tokens:
   - Buttons use gradient primary style with hover lift; secondary/outline/ghost variants get translucent glass treatments.
   - Cards use `glass-card` with `hover-lift`.
   - Inputs/Textareas gain semi-transparent background (`bg-background/60`) and `backdrop-blur-sm`.
   - Dialog uses `glass-card` styling for content.
   - Navbar uses `glass-navbar` and gradient brand title.
   - Page lists (Draws, Agents, Master Dealers) refined hover/active states with accent rings and gradient headings.

5. **Accessibility** – Consistent `:focus-visible` cyan outline; text colors meet WCAG contrast ratios.

6. **Performance** – Tailwind JIT ensures minimal CSS; glass effects limited to key elements; all transitions short-duration.

---

# Scope

- New file: `frontend/src/styles/tokens.css`
- Modified: `frontend/src/index.css`, `frontend/index.html` (fonts), `frontend/src/components/ui/button-variants.js`, `frontend/src/components/ui/card.jsx`, `frontend/src/components/ui/input.jsx`, `frontend/src/components/ui/textarea.jsx`, `frontend/src/components/ui/dialog.jsx`, `frontend/src/components/layout/Navbar.jsx`, `frontend/src/pages/DrawsPage.jsx`, `frontend/src/pages/AgentsPage.jsx`, `frontend/src/pages/MasterDealersPage.jsx`, `frontend/src/App.jsx`
- Affected domain: all frontend UI styling

---

# Goals

- Establish a cohesive, scalable design language
- Elevate perceived quality and professionalism
- Ensure accessibility compliance (contrast, focus)
- Maintain performance via Tailwind's optimizations
- Centralize visual tokens to enable easy theming and consistency
- Provide reusable component utilities for common patterns

---

# Non-Goals

- Implement light theme (future consideration)
- Redesign backend services or data layer
- Introduce motion-heavy animations (only subtle lifts and glows)
- Provide full design documentation beyond code-level tokens (e.g., Figma specs)
- Replace existing component architecture (only visual layer changed)

---

# Alternatives Considered

## Option 1: Extend Shadcn's default Zinc theme

Name: Keep Shadcn Zinc, tweak colors

Reason Rejected: Insufficient to achieve "future tech" aesthetic; limited customization without writing custom CSS anyway.

## Option 2: Adopt a CSS-in-JS solution (Emotion/Styled-Components)

Name: CSS-in-JS with theme provider

Reason Rejected: Additional runtime overhead, larger bundle, complexity. Tailwind already provides optimized static CSS; custom utilities are enough.

## Option 3: Use only Tailwind's utility classes without design tokens

Name: Hardcoded design tokens

Reason Rejected: Impossible to maintain consistency; theming would require massive find-replace. Token system centralizes control.

---

# Tradeoffs

**Advantages:**
- Single source of truth for visual properties
- Easy to adjust palette or spacing globally
- Consistent elevation, blur, radius values
- Glassmorphism creates depth and premium feel
- Micro-interactions improve perceived responsiveness
- Tailwind JIT keeps CSS size small (~22KB gzipped)
- Accessibility built-in from the start

**Disadvantages:**
- Requires discipline to use token-based classes
- `backdrop-filter` may impact low-end GPU performance (used selectively)
- Additional file (`tokens.css`) to maintain
- Some design decisions (e.g., color values) now hidden behind variables, making on-the-fly tweaks slightly more indirect

---

# Consequences

- All future UI work must use the new token system; avoid hardcoded color values.
- Code reviews should verify usage of `glass-card`, `btn-primary-gradient`, etc.
- New components will automatically inherit the design language when using token utilities.
- Potential for token value regressions if modified without testing.

---

# Architectural Impact

- Introduces a formal design system layer on top of Tailwind.
- Decouples visual decisions from component markup.
- Enables potential future theming (e.g., light mode) by redefining tokens.
- Sets precedent for tokenizing non-visual concerns (spacing, typography) as well.

---

# Implementation Rules

- All colors must reference CSS variables (e.g., `hsl(var(--primary))`); never hardcode hex/hsl.
- Primary action buttons must use `btn-primary-gradient` class.
- Content panels must use `glass-card`; Navbar must use `glass-navbar`.
- Form controls must include `backdrop-blur-sm` and background opacity (`bg-background/60`).
- Interactive list items must have either `hover-lift` or subtle background change on hover.
- Active selections should use an accent ring: `ring-1 ring-primary/10`.
- Focus styling must rely on `:focus-visible` provided by global styles.
- Typography uses Inter; monospace uses Space Mono; do not override globally.

---

# Anti-Patterns

- **Hardcoded Colors**: Using `bg-[#123456]` or arbitrary HSL values.
- **Solid Overlay**: Placing solid backgrounds over glass cards, destroying depth.
- **Focus Outline Removal**: Overriding focus-visible for aesthetic reasons.
- **Token Bypass**: Creating new CSS variables for one-off colors instead of reusing existing tokens.
- **Excessive Glow**: Applying `.glow-lg` on many elements, causing visual clutter and performance cost.

---

# Risks

- **Inconsistent Adoption**: Developers may bypass token system due to convenience.
- **Browser Support**: `backdrop-filter` not supported in very old browsers; acceptable as progressive enhancement.
- **Maintenance Overhead**: Tokens file may become bloated if not curated.

**Mitigation:**
- Add ESLint rule suggestions to warn on hardcoded colors (future).
- Enforce token usage during code reviews.
- Provide clear examples in documentation.

---

# Mitigation Strategy

- Keep tokens file well-organized with comments.
- Periodically audit components for token compliance.
- Add a stylelint config if project expands.

---

# Related Incidents

None.

---

# Files/Systems Affected

- `frontend/src/styles/tokens.css` (new)
- `frontend/src/index.css`
- `frontend/index.html`
- `frontend/src/components/ui/button-variants.js`
- `frontend/src/components/ui/card.jsx`
- `frontend/src/components/ui/input.jsx`
- `frontend/src/components/ui/textarea.jsx`
- `frontend/src/components/ui/dialog.jsx`
- `frontend/src/components/layout/Navbar.jsx`
- `frontend/src/pages/DrawsPage.jsx`
- `frontend/src/pages/AgentsPage.jsx`
- `frontend/src/pages/MasterDealersPage.jsx`
- `frontend/src/App.jsx`

---

# Validation Strategy

- **Visual Checks**: Ensure all pages render with glassmorphism and gradient accents; no visual glitches.
- **Accessibility Audit**: Run axe or Lighthouse; verify no contrast or focus issues.
- **Performance**: Bundle size under historic thresholds; frame rate >30 during interactions.
- **Cross-Browser**: Chrome, Edge, Firefox visual parity.
- **Regression**: Compare screenshots before/after to confirm uniformity.

---

# Rollback Plan

1. Revert all changes listed above to last known good commit.
2. Restore original `index.css` and remove `tokens.css`.
3. Rebuild and redeploy.
4. Verify UI returns to previous state.

---

# Future Re-Evaluation Conditions

- Major branding change requiring different aesthetic
- Persistent performance issues on target hardware
- Migration to a different UI framework
- Introduction of a comprehensive design system library (e.g., Material-UI)

---

# Superseded By

(Empty)

---

# Notes

This ADR establishes the visual foundation for Vanguard 3D. All subsequent UI work should follow the design tokens and component utilities defined herein. The system is designed to be both cohesive and flexible, enabling rapid iteration while maintaining high visual standards.
