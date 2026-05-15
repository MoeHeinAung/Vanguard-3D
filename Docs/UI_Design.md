# UI Design System — Vanguard 3D

> **Purpose:** Authoritative reference for all UI components, design tokens, patterns, and architectural decisions in the Vanguard 3D lottery management system.
>
> **Last Updated:** 2026-05-15
>
> **Source of Truth:** `frontend/src/styles/tokens.css`, `frontend/src/index.css`, `Docs/Design_to_Extract/DESIGN.md`

---

## Table of Contents

1. [Design Tokens](#1-design-tokens)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Dimensions](#4-spacing--dimensions)
5. [Elevation & Shadows](#5-elevation--shadows)
6. [Glassmorphism](#6-glassmorphism)
7. [Border Radius](#8-border-radius)
8. [Transitions & Animations](#8-transitions--animations)
9. [Components](#9-components)
10. [Page Layouts](#10-page-layouts)
11. [Patterns & Conventions](#11-patterns--conventions)
12. [Accessibility](#12-accessibility)
13. [Adding New Components](#13-adding-new-components)

---

## 1. Design Tokens

All visual properties are defined as CSS custom properties in `frontend/src/styles/tokens.css` using HSL color space. Tokens are organized into semantic categories.

### Token Categories

| Category | Prefix | Example |
|----------|--------|---------|
| Color - Neutrals | `--color-` | `--color-void`, `--color-obsidian`, `--color-slate` |
| Color - Foreground | `--color-` | `--color-mist`, `--color-ash`, `--color-wisp` |
| Color - Brand | `--brand-` | `--brand-cyan-default`, `--brand-violet-dim` |
| Color - Status | `--status-` | `--status-success-bg`, `--status-error-text` |
| Shadow | `--shadow-` | `--shadow-xs`, `--shadow-lg`, `--shadow-xl` |
| Glass | `--glass-` | `--glass-bg`, `--glass-border`, `--glass-blur` |
| Transition | `--transition-` | `--transition-fast`, `--transition-base` |
| Timing | `--ease-` | `--ease-out`, `--ease-in`, `--ease-in-out` |
| Radius | `--radius-` | `--radius-sm`, `--radius-md`, `--radius-lg` |
| Font | `--font-` | `--font-primary`, `--font-mono` |
| Size | `--text-`, `--leading-`, `--tracking-` | `--text-base`, `--leading-normal` |

### How to Add a New Token

1. Add the token to `:root` in `tokens.css` under the appropriate category.
2. Reference it in components using `hsl(var(--your-token))` for colors or `var(--your-token)` for other values.
3. If it maps to a shadcn/ui semantic variable, add the mapping in `index.css` under `:root`.

---

## 2. Color System

### Core Palette (Dark Theme)

```
Background:        hsl(var(--color-obsidian))    →  deep space blue-black
Surface Base:      hsl(var(--color-slate))       →  dark blue-gray
Surface Elevated:  hsl(var(--color-stone))       →  medium blue-gray
Card Surface:      hsl(var(--color-graphite))    →  subtle warm gray-blue
Muted Surface:     hsl(var(--color-pearl))       →  light blue-gray

Primary Text:      hsl(var(--color-mist))        →  bright cool white
Secondary Text:    hsl(var(--color-ash))         →  soft gray
Tertiary Text:     hsl(var(--color-wisp))        →  muted blue-gray
```

### Brand Colors

```
Cyan (Primary):    hsl(var(--brand-cyan-default))    →  #00f7ff  (active/primary)
Cyan Dim:          hsl(var(--brand-cyan-dim))         →  #00d4d4  (hover/subtle)
Violet (Secondary):hsl(var(--brand-violet-default))   →  #c44dff  (secondary actions)
Violet Dim:        hsl(var(--brand-violet-dim))       →  #a840e6  (secondary subtle)
Emerald:           hsl(var(--brand-emerald-default))  →  #00ffa3  (success/positive)
Amber:             hsl(var(--brand-amber-default))    →  #ffb020  (warning)
```

### Status Colors

| Status | Background Token | Text Token | Hex Preview |
|--------|-----------------|------------|-------------|
| Success | `--status-success-bg` (150 100% 15%) | `--status-success-text` (150 100% 75%) | 🟢 Green |
| Warning | `--status-warning-bg` (35 100% 20%) | `--status-warning-text` (35 100% 65%) | 🟡 Amber |
| Error | `--status-error-bg` (0 100% 25%) | `--status-error-text` (0 100% 65%) | 🔴 Red |
| Info | `--status-info-bg` (210 100% 20%) | `--status-info-text` (210 100% 75%) | 🔵 Blue |

### Shadcn/ui Semantic Color Mapping (`index.css`)

The following shadcn/ui semantic variables are mapped in `@layer base :root`:

| Semantic Variable | Token | Hex Equivalent |
|---|---|---|
| `--background` | `--color-void` | ~#05080a |
| `--foreground` | `--color-mist` | ~#e8e8ef |
| `--card` | `--color-graphite` | ~#262630 |
| `--card-foreground` | `--color-mist` | ~#e8e8ef |
| `--primary` | `--brand-cyan` | #00f7ff |
| `--primary-foreground` | `--color-void` | ~#05080a |
| `--secondary` | `--brand-violet` | #c44dff |
| `--muted` | `--color-slate` | ~#14141c |
| `--muted-foreground` | `--color-wisp` | ~#8c8c9e |
| `--accent` | `--brand-cyan-dim` | #00d4d4 |
| `--destructive` | `--status-error` | ~#ff4d4d |
| `--border` | `--color-pearl` | ~#363644 |
| `--input` | `--color-graphite` | ~#262630 |
| `--ring` | `--brand-cyan` | #00f7ff |

### Gradient Background (body)

Applied via `@layer base body`:
```css
background-image:
  radial-gradient(ellipse 80% 50% at 50% -20%, hsla(185, 100%, 35%, 0.08), transparent 50%),
  radial-gradient(ellipse 60% 40% at 100% 100%, hsla(260, 100%, 45%, 0.06), transparent 50%);
```

---

## 3. Typography

### Font Stacks

```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
--font-mono: 'Space Mono', 'SF Mono', 'Fira Code', 'Consolas', monospace;
```

### Type Scale

| Token | Size | Usage |
|-------|------|-------|
| `--text-xs` | 0.75rem (12px) | Labels, captions |
| `--text-sm` | 0.875rem (14px) | Body small, secondary text |
| `--text-base` | 1rem (16px) | Body text |
| `--text-lg` | 1.125rem (18px) | H3, large body |
| `--text-xl` | 1.25rem (20px) | H2 |
| `--text-2xl` | 1.5rem (24px) | H1 |
| `--text-3xl` | 1.875rem (30px) | Display |
| `--text-4xl` | 2.25rem (36px) | Hero display |
| `--text-5xl` | 3rem (48px) | Large hero |

### Line Heights

| Token | Value |
|-------|-------|
| `--leading-none` | 1 |
| `--leading-tight` | 1.25 |
| `--leading-snug` | 1.375 |
| `--leading-normal` | 1.5 |
| `--leading-relaxed` | 1.625 |
| `--leading-loose` | 2 |

### Letter Spacing

| Token | Value |
|-------|-------|
| `--tracking-tighter` | -0.05em |
| `--tracking-tight` | -0.025em |
| `--tracking-normal` | 0 |
| `--tracking-wide` | 0.025em |
| `--tracking-wider` | 0.05em |
| `--tracking-widest` | 0.1em |

### Font Weights

| Token | Value |
|-------|-------|
| `--font-normal` | 400 |
| `--font-medium` | 500 |
| `--font-semibold` | 600 |
| `--font-bold` | 700 |
| `--font-extrabold` | 800 |

### Design Spec Typography (from DESIGN.md)

These are the named typographic styles used in the design spec. Map them to tokens above:

| Style | Font | Size | Weight | LineHeight | LetterSpacing |
|-------|------|------|--------|------------|---------------|
| h1-display | Inter | 24px | 700 | 32px | 2px |
| h2-header | Inter | 18px | 600 | 24px | 0.5px |
| body-md | Inter | 14px | 400 | 20px | — |
| data-lg | Space Grotesk | 20px | 600 | 24px | 0.5px |
| data-sm | Space Grotesk | 12px | 500 | 16px | — |
| label-caps | Inter | 11px | 700 | 14px | 1px |

**Rule:** Use `Space Grotesk` exclusively for numerical data/metrics. Use `Inter` for all UI labels and body text.

### Gradient Text

Apply via `text-gradient` utility class:
```css
background: linear-gradient(135deg, hsl(var(--brand-cyan-dim)), hsl(var(--brand-violet-dim)));
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## 4. Spacing & Dimensions

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--unit` | 4px | Base unit |
| `--xs` | 4px (1 unit) | Tight gaps |
| `--sm` | 8px (2 units) | Small padding |
| `--md` | 16px (4 units) | Standard padding/gutter |
| `--lg` | 24px (6 units) | Large spacing |
| `--xl` | 40px (10 units) | Section spacing |
| `--gutter` | 16px | Grid gutter |
| `--margin` | 24px | Default margin |

### Border Radius

| Token | Value | usage |
|-------|-------|-------|
| `--radius-sm` | 0.375rem | Subtle rounding (inputs, selects) |
| `--radius-md` | 0.5rem | Default (cards via shadcn) |
| `--radius-lg` | 0.75rem | Large modals |
| `--radius-xl` | 1rem | Dialogs |
| `--radius-2xl` | 1.5rem | Banners |
| `--radius-full` | 9999px | Pills, badges |

**Design spec override:** The DESIGN.md specifies all primary containers should use **sharp corners (0px / none)**. This conflicts with the default `rounded-xl` on `.glass-card`. Use `rounded-none` on structural containers per the design spec.

---

## 5. Elevation & Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-xs` | `0 1px 2px rgb(0 0 0 / 0.5), inset 0 1px 0 rgb(255 255 255 / 0.03)` | Subtle |
| `--shadow-sm` | `0 2px 4px rgb(0 0 0 / 0.6), inset 0 1px 0 rgb(255 255 255 / 0.04)` | Cards (rest) |
| `--shadow-md` | `0 4px 8px rgb(0 0 0 / 0.7), inset 0 1px 0 rgb(255 255 255 / 0.05)` | Cards (hover) |
| `--shadow-lg` | `0 8px 16px rgb(0 0 0 / 0.8), inset 0 1px 0 rgb(255 255 255 / 0.06)` | Elevated |
| `--shadow-xl` | `0 16px 32px rgb(0 0 0 / 0.9), inset 0 1px 0 rgb(255 255 255 / 0.07)` | Overlays |
| `--shadow-inner` | `inset 0 2px 4px rgb(0 0 0 / 0.6), inset 0 1px 0 rgb(255 255 255 / 0.03)` | Inset |

### Utility Classes

```html
<div class="elevation-1">  <!-- xs shadow --></div>
<div class="elevation-2">  <!-- sm shadow --></div>
<div class="elevation-3">  <!-- md shadow --></div>
<div class="elevation-4">  <!-- lg shadow --></div>
<div class="elevation-5">  <!-- xl shadow --></div>
```

### Active State Glow

```css
.glow { box-shadow: 0 0 12px hsl(var(--brand-cyan-dim) / 0.4); }
.glow-sm { box-shadow: 0 0 8px hsl(var(--brand-cyan-dim) / 0.3); }
.glow-lg { box-shadow: 0 0 20px hsl(var(--brand-cyan-dim) / 0.5); }
```

---

## 6. Glassmorphism

Depth is achieved through **transparency + backdrop blur + hairline borders** rather than opaque surfaces.

### Glass Layers

| Class | Background | Blur | Border | Usage |
|-------|-----------|------|--------|-------|
| `.glass-sm` | `rgba(255,255,255,0.02)` | 8px | `rgba(255,255,255,0.06)` 1px | Subtle panels |
| `.glass` (default) | `rgba(255,255,255,0.03)` | 12px | `rgba(255,255,255,0.08)` 1px | Standard cards |
| `.glass-lg` | `rgba(255,255,255,0.05)` | 16px | `rgba(255,255,255,0.1)` 1px | Overlays |

### Glass Card (shadcn/ui Card)

```css
.glass-card {
  @apply rounded-xl border bg-card/50 shadow-sm backdrop-blur-sm transition-all duration-200;
  border-color: rgba(255,255,255,0.06);
  background: linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
  box-shadow: var(--shadow-md), inset 0 1px 0 var(--glass-highlight);
}
```

### Navbar

```css
.glass-navbar {
  @apply sticky top-0 z-50 border-b backdrop-blur-md;
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
}
```

---

## 7. Corner Accents (L-Shape Brackets)

Decorative hairlines placed on **top-left** and **bottom-right** corners of primary/highlighted cards to signal importance (from DESIGN.md).

```css
.corner-accent::before {
  content: '';
  position: absolute;
  top: -1px; left: -1px;
  width: 48px; height: 16px;
  border-top: 2px solid #00daf3;
  border-left: 2px solid #00daf3;
  z-index: 10;
}

.corner-accent::after {
  content: '';
  position: absolute;
  bottom: -1px; right: -1px;
  width: 48px; height: 16px;
  border-bottom: 2px solid #00daf3;
  border-right: 2px solid #00daf3;
  z-index: 10;
}
```

**Usage:** Apply `.corner-accent` + `position: relative` on the card element.

---

### Transitions

```html
<div class="transition-fast">  <!-- 150ms ease-out --></div>
<div class="transition-base"> <!-- 200ms ease-out --></div>
<div class="transition-slow"> <!-- 300ms ease-out --></div>
```

### Focus Ring

```css
:focus-visible {
  outline: 2px solid hsl(var(--brand-cyan-default));
  outline-offset: 2px;
}
```

### Active Element Glow

```css
.glow-accent { box-shadow: 0 0 12px hsl(var(--brand-cyan-default) / 0.3); }
```

---

## 9. Components

All components live in `frontend/src/components/ui/` and follow shadcn/ui patterns.

### 9.1 Button (`button.jsx`, `button-variants.js`)

**Variants** (from `button-variants.js`):

| Variant | Style |
|---------|-------|
| `default` | `btn-primary-gradient` — Cyan→Violet gradient, dark text |
| `destructive` | Red background, white text |
| `outline` | Border + hover accent bg |
| `secondary` | Subtle secondary fill |
| `ghost` | Transparent, hover accent |
| `link` | Underline text |

**Sizes:** `default` (h-9), `sm` (h-8), `lg` (h-10), `icon` (h-9 w-9)

**Special classes:**
- `.btn-primary-gradient` — Gradient from `--brand-cyan-default` to `--brand-violet-default` with shadow and hover lift
- `.btn-special` — Ghost with cyan border, hover gradient sweep (from DESIGN.md spec)
- `.btn-dynamic-border` — Animated border with gradient edges (from DESIGN.md spec)

**Usage:**
```jsx
<Button variant="default" size="lg">Primary Action</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="outline" size="sm">Secondary</Button>
```

### 9.2 Card (`card.jsx`)

Uses `.glass-card` class (glassmorphism). All children auto-inherit from card context.

**Sub-components:**

| Component | Purpose |
|-----------|---------|
| `<Card>` | Container — `.glass-card` |
| `<CardHeader>` | Top section with `p-6` spacing |
| `<CardTitle>` | Bold heading |
| `<CardDescription>` | Muted secondary text |
| `<CardContent>` | Body — `p-6 pt-0` |
| `<CardFooter>` | Bottom actions bar — `p-6 pt-0` |

**Usage:**
```jsx
<Card className="corner-accent relative">
  <CardHeader>
    <CardTitle>Section Title</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### 9.3 Input (`input.jsx`)

Styled input with glassmorphism: `bg-background/60`, backdrop-blur, border, focus ring.

### 9.4 Textarea (`textarea.jsx`)

Styled textarea matching Input design: `min-h-[80px]`, same border/focus behavior.

### 9.5 Label (`label.jsx`)

Thin label: `text-sm font-medium leading-none`.

### 9.6 Badge (`badge.jsx`, `badge-variants.js`)

**Variants:**

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| `default` | Primary | Primary-foreground | Transparent |
| `secondary` | Secondary | Secondary-foreground | Transparent |
| `destructive` | Red | Red-foreground | Transparent |
| `outline` | — | Foreground | Transparent |
| `success` | Green 20% | Green-400 | Transparent |
| `warning` | Yellow 20% | Yellow-400 | Transparent |
| `info` | Blue 20% | Blue-400 | Transparent |

**Design-spec "Elegant" badges** (from `index.css`):

```html
<span class="badge-elegant badge-elegant-success">ACTIVE</span>
<span class="badge-elegant badge-elegant-warning">PENDING</span>
<span class="badge-elegant badge-elegant-error">ERROR</span>
<span class="badge-elegant badge-elegant-info">INFO</span>
```

These are rectangular (no `rounded-full`) with subtle tinted backgrounds and matching border tints. **Use these for status indicators, not the shadcn/Badge component.**

### 9.7 Dialog (`dialog.jsx`)

Full Radix dialog suite with glassmorphism overlay and slide-in animation.

**Sub-components:** `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`, `DialogPortal`, `DialogOverlay`

### 9.8 Select (`select.jsx`)

Radix-based select with glassmorphism treatment.

**Sub-components:** `Select`, `SelectGroup`, `SelectValue`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectSeparator`

---

## 10. Page Layouts

### Architectural Mandate: Viewport Containment

Every page MUST fit exactly within the window dimensions. Global document-level scrolling is prohibited.

**Structural Recipe:**
1. Root: `h-full flex flex-col overflow-hidden`
2. Middle Wrapper: `flex-1 min-h-0 overflow-hidden` (enables children to fill height)
3. Content: `h-full overflow-y-auto` (internal scroll only)

### Pattern A: Master-Detail Grid (Data Entities)

Used by: `DrawsPage`, `AgentsPage`, `MasterDealersPage`

- Header remains fixed.
- Sidebar and Detail scroll independently.
- Summary footers remain pinned.

### Pattern B: Risk Management Dashboard

Used by: `OffloadPage`

**Logic Model:**
- **Admin Hold**: Max liability per ticket.
- **Max Offload Amount**: Upper limit for batch operations.
- **Max Offload Ticket**: Max unique tickets per batch.
- **Holding**: `min(Total, Admin Hold)`
- **Pending**: `max(Total - Admin Hold - Offloaded, 0)`

**Layout:**
- **Control Bar**: Flex header with 3 numerical inputs and a primary action button.
- **Dynamic Data Grid**: 2-column flex container.
  - **Left (Main)**: Tabbed table with views for `Holding`, `Pending`, and `Offloaded` tickets.
  - **Right (Preview)**: Toggle-driven container for template export preparation.

### Pattern C: Data Table

Standard table structure:
```
┌─────────────────────────────────────────────┐
│ CardHeader: Title + right-side count/badge  │
├─────────────────────────────────────────────┤
│ thead: sticky top-0, uppercase label-caps   │
├─────────────────────────────────────────────┤
│ tbody: overflow-y-auto data rows            │
├─────────────────────────────────────────────┤
│ Footer: flex-none pinned summary row        │
└─────────────────────────────────────────────┘
```

**Numerical data:** Always use `font-mono` (Space Mono or monospace fallback) to prevent value jumping during real-time updates.

### Pattern D: Sales Dashboard

Used by: `SalesPage`

**Layout:**
- **Header**: Active draw context.
- **Sidebar**: Interactive agent profiles with search and `+` sale shortcut.
- **Detail**: Dynamic summary card + transaction history list.

### Navbar

Fixed top, glassmorphism, with gradient "VANGUARD 3D" title and ghost-button navigation links.

---

## 11. Patterns & Conventions

### 11.1 API Bridge

All frontend → backend communication goes through `callPython()` in `frontend/src/utils/bridge.js`:
```js
const data = await callPython('endpoint_name', { /* optional payload */ });
```

### 11.2 Data Fetching

```js
const [data, setData] = useState([]);

useEffect(() => {
  const load = async () => {
    try {
      const result = await callPython('get_...');
      setData(result);
    } catch (error) {
      console.error('Failed:', error);
    }
  };
  load();
}, []);
```

**Always include error handling** in `try/catch` around `callPython()`.

### 11.3 Add/Edit/Delete Flow

1. **Sidebar** lists entities; clicking selects one
2. **Detail panel** shows selected item info
3. **Dialog** with Form (triggered by "New" or edit/delete icons)
4. **Form** has Input fields, Labels, Cancel/Save buttons
5. On save: `callPython`, close dialog, reload list, clear selection

### 11.4 Class Name Ordering Convention

When composing multiple classes, follow this order:
1. Structural (layout: `flex`, `grid-cols-*`, `gap-*`, `p-*`)
2. Visual (appearance: `bg-*`, `border`, `rounded`, `shadow`)
3. State (interaction: `hover:*`, `focus-*`, `disabled:*`)
4. Custom/project (`glass-card`, `text-gradient`, `corner-accent`)

### 11.5 Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| React components | PascalCase | `SalesPage`, `AgentForm` |
| CSS classes | kebab-case | `btn-primary-gradient`, `glass-card` |
| API methods | camelCase (JS) / snake_case (Python) | `getAgents` → `get_agents` |
| CSS custom properties | kebab-case with `--` prefix | `--brand-cyan-default` |
| HSL color channels | Semantic naming | `var(--brand-cyan-default)` not raw HSL |

### 11.6 Status Chip Pattern

For domain-specific statuses (Active, Pending, Closed, Settled), use the **Elegant Badge** pattern:
```html
<span class="badge-elegant badge-elegant-success">ACTIVE</span>
```
Always uppercase text, rectangular (no rounded-full), with tinted background + matching border.

---

## 12. Accessibility

- **Focus states:** All interactive elements must have `:focus-visible` ring (cyan, 2px, 2px offset)
- **Semantic HTML:** Use `<button>`, `<nav>`, `<header>`, `<main>` appropriately
- **Color contrast:** Verify text/background pairs meet WCAG AA
- **`sr-only` class:** Use for screen-reader-only labels (e.g., Dialog close button)
- **`disabled` state:** Use `disabled:cursor-not-allowed disabled:opacity-50`

---

## 13. Adding New Components

### Step-by-Step Guide

1. **Check if the component already exists** in `src/components/ui/`.

2. **If creating a new primitive:**
   - Create `src/components/ui/<component>.jsx`
   - Follow shadcn/ui patterns (forwardRef, displayName, cn utility)
   - Import and compose only from local primitives (not third-party UI libs)

3. **If adding a styled variant:**
   - Define styles in `src/styles/tokens.css` under the relevant `@layer`
   - If it's a component variant, update the component's variants file

4. **If adding design tokens:**
   - Add to `:root` in `src/styles/tokens.css`
   - If mapping to shadcn semantic vars, also update `index.css`

5. **Verify:**
   - File exists before importing (`ls src/components/ui/<name>.jsx`)
   - No direct imports from `@mui`, `radix-ui` (except in own wrappers)
   - Follows `src/components/ui/` convention

### Example: New Component Template

```jsx
// src/components/ui/toggle.jsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Toggle = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm ...",
      className
    )}
    {...props}
  />
))
Toggle.displayName = "Toggle"

export { Toggle }
```

---

## File Map

| File | Purpose |
|------|---------|
| `frontend/src/styles/tokens.css` | Design tokens, color vars, typography, shadows, glass, utilities |
| `frontend/src/index.css` | Tailwind config mappings, component styles, gradients, glows |
| `frontend/tailwind.config.js` | Theme extension with CSS var bindings, borderRadius |
| `frontend/src/components/ui/button.jsx` | Button primitive with variants |
| `frontend/src/components/ui/button-variants.js` | Button variant definitions (CVA) |
| `frontend/src/components/ui/card.jsx` | Card + CardHeader/Title/Description/Content/Footer |
| `frontend/src/components/ui/input.jsx` | Input primitive |
| `frontend/src/components/ui/textarea.jsx` | Textarea primitive |
| `frontend/src/components/ui/label.jsx` | Label primitive |
| `frontend/src/components/ui/badge.jsx` | Badge primitive |
| `frontend/src/components/ui/badge-variants.js` | Badge variant definitions |
| `frontend/src/components/ui/dialog.jsx` | Full Dialog suite |
| `frontend/src/components/layout/Navbar.jsx` | Top navigation bar |
| `frontend/src/components/ui/*.jsx` | All UI primitives |
| `frontend/src/lib/utils.js` | `cn()` utility (clsx + tailwind-merge) |
| `Docs/Design_to_Extract/DESIGN.md` | Original design spec (reference) |
| `Docs/Knowledge/Rules/ui-governance-rules.md` | Component governance rules |