---
name: Quantum Admin
colors:
  surface: '#0d1516'
  surface-dim: '#0d1516'
  surface-bright: '#333a3c'
  surface-container-lowest: '#080f11'
  surface-container-low: '#151d1e'
  surface-container: '#192122'
  surface-container-high: '#242b2d'
  surface-container-highest: '#2e3638'
  on-surface: '#dce4e5'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#dce4e5'
  inverse-on-surface: '#2a3233'
  outline: '#849396'
  outline-variant: '#3b494c'
  surface-tint: '#00daf3'
  primary: '#c3f5ff'
  on-primary: '#00363d'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#006875'
  secondary: '#a5c8ff'
  on-secondary: '#00315f'
  secondary-container: '#2792ff'
  on-secondary-container: '#002a53'
  tertiary: '#aeffbb'
  on-tertiary: '#003917'
  tertiary-container: '#00ef77'
  on-tertiary-container: '#00672f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#d4e3ff'
  secondary-fixed-dim: '#a5c8ff'
  on-secondary-fixed: '#001c3a'
  on-secondary-fixed-variant: '#004786'
  tertiary-fixed: '#63ff93'
  tertiary-fixed-dim: '#00e471'
  on-tertiary-fixed: '#00210b'
  on-tertiary-fixed-variant: '#005224'
  background: '#0d1516'
  on-background: '#dce4e5'
  surface-variant: '#2e3638'
typography:
  h1-display:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: 2px
  h2-header:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.5px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-lg:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.5px
  data-sm:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 1px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 16px
  margin: 24px
---

## Brand & Style

This design system is engineered for high-performance enterprise environments that require rapid data synthesis and a commanding "mission control" aesthetic. The brand personality is authoritative, visionary, and hyper-precise.

The visual direction combines **Glassmorphism** with **Cybernetic Minimalism**. It utilizes translucent layering and background blurs to create depth without clutter, while "L-shaped" corner accents and hairline borders evoke a high-tech, tactical interface. The emotional response is one of total control and future-readiness, tailored for technical operators and executive decision-makers in fields like cybersecurity, fintech, or aerospace.

## Colors

The palette is anchored in **Deep Space Blue**, providing a low-fatigue foundation for long-duration monitoring. High-energy accents like **Primary Cyan** and **Primary Blue** are reserved for critical interactive states and data visualization paths. 

Color is used functionally: Cyan indicates the "current" or "active" focus, while Blue handles secondary navigational cues. Neutral tones are pushed toward the cool spectrum to maintain the cybernetic atmosphere. Backgrounds should leverage the `surface_glass` value with a `10px` backdrop-filter blur to maintain legibility over complex data visualizations.

## Typography

This system uses a dual-font approach to separate narrative content from technical data. **Inter** provides a clean, geometric foundation for all UI labels and body text, ensuring maximum readability at small sizes. 

**Space Grotesk** is utilized exclusively for numerical data, metrics, and technical readouts. Its monospaced-adjacent character prevents "jumping" in real-time data updates and reinforces the futuristic, scientific aesthetic. All primary headings (H1) must be uppercase with wide tracking to serve as architectural anchors on the page.

## Layout & Spacing

The system follows a **Fluid Grid** model with a high-density configuration. This reflects the "data-dense" requirement of an enterprise SaaS, allowing more information to be visible without scrolling.

A strict 4px base unit governs all dimensions. Layouts are typically structured on a 12-column grid. Modules and cards should utilize narrow gutters (16px) to maintain a cohesive, "single-machine" appearance. Information density is prioritized over whitespace, but vertical rhythm is maintained through consistent `md` (16px) padding inside components.

## Elevation & Depth

Depth is achieved through **transparency and optical glows** rather than traditional drop shadows. 

1.  **Base Layer:** The Deep Space Blue background.
2.  **Surface Layer:** Glassmorphic cards with a 1px white border (`rgba(255, 255, 255, 0.1)`) and 10px blur.
3.  **Active State:** Elements in focus or active status emit a Cyan glow (`0 0 15px rgba(0, 229, 255, 0.3)`).

Hierarchy is reinforced by the "L-shaped" corner accents. These decorative hairlines should be placed on the top-left and bottom-right corners of primary cards to "bracket" the content, signaling its importance within the system's grid.

## Shapes

To maintain a "cybernetic" and professional tone, the system uses **Sharp (0px)** corners for all primary containers, buttons, and input fields. 

Rounded corners are strictly forbidden as they conflict with the technical, architectural nature of the UI. The "L-shaped" corner accents further emphasize this 90-degree geometry. Small icons or status indicators may use circular forms, but any structural container must remain strictly rectangular.

## Components

### Buttons
- **Primary:** Solid Cyan background, black text, sharp corners. On hover, apply the Cyan glow effect.
- **Ghost:** Transparent background, 1px Cyan border, Cyan text.
- **Actionable:** Icons within buttons should be 16px and vertically centered.

### Cards
- **Construction:** Use the glassmorphism variables. 
- **Accents:** Add 2px thick, 10px long L-shaped accents in the corners of "Featured" or "High Priority" cards using the Primary Cyan color.
- **Header:** Card titles should use `label-caps` typography with a subtle bottom border.

### Inputs & Form Fields
- **Styling:** 1px white border (`rgba(255,255,255,0.1)`), dark background. 
- **Focus:** Border changes to Primary Cyan with a subtle glow.
- **Labels:** Always use `label-caps` placed above the input field.

### Data Visualization
- **Charts:** Use Primary Blue and Cyan for main data series. Use Success Green and Error Red only for status-based metrics.
- **Monospace:** All chart axis labels and tooltips must use `data-sm` (Space Grotesk).

### Status Chips
- **Style:** Rectangular, subtle background tint of the status color (e.g., 10% opacity Red), with a 1px solid border of the same color. Text is always uppercase.