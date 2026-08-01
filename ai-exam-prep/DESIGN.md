---
name: AI Exam Prep Focal Engine
description: Zero-cost AI study assistant and mock exam generator.
colors:
  background: "#0F172A"
  foreground: "#F8FAFC"
  surface: "#1E293B"
  border: "#334155"
  muted: "#94A3B8"
  clarity: "#2DD4BF"
  math: "#F472B6"
  danger: "#F87171"
typography:
  display:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontWeight: 800
  title:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontWeight: 700
  body:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontWeight: 400
  mono:
    fontFamily: "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace"
rounded:
  sm: "0.125rem"
  md: "0.375rem"
  lg: "0.5rem"
  xl: "0.75rem"
  full: "9999px"
spacing:
  container: "max-w-7xl"
  p6: "1.5rem"
  p12: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.clarity}"
    textColor: "{colors.background}"
    rounded: "{rounded.lg}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.lg}"
  card:
    backgroundColor: "{colors.surface}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.xl}"
---

# Design System: AI Exam Prep Focal Engine

## Overview

**Creative North Star: "The Deep Work Terminal"**

The AI Exam Prep Focal Engine is built for focused, distraction-free academic preparation. It rejects conventional, high-noise SaaS product design in favor of a utilitarian, dark-mode-native sanctuary. Visual noise is minimized to prioritize cognitive clarity. Information architecture is extremely flat, and interactive elements rely on stark contrast rather than superfluous embellishment. There are no marketing popups, no social proofs, and no unnecessary animations.

**Key Characteristics:**
- **High Contrast, Low Noise:** Deep dark background with piercing `clarity` accents.
- **Utilitarian Function:** Components emphasize crisp legibility and flat borders over shadows.
- **Academic Focus:** Tailored typographic hierarchy optimized for reading long passages and math.
- **Privacy-Forward Ephemerality:** The UI reflects its temporary nature—tools for the session, not a persistent archive.

## Colors

The palette is a focused, synthetic dark mode relying on slate neutrals and high-contrast teals.

### Primary
- **Clarity Teal** (#2DD4BF): The sole action color. Used for primary buttons, active states, progress indicators, and syntax highlights.

### Semantic Accents
- **Math Pink** (#F472B6): Used exclusively for LaTeX math callouts and specialized visual syntax.
- **Danger Red** (#F87171): Used for destructive actions (clearing sessions), error states, and incorrect quiz answers.

### Neutral
- **Deep Background** (#0F172A): The void canvas behind all content.
- **Primary Text** (#F8FAFC): High-contrast white for primary reading text.
- **Card Surface** (#1E293B): A slightly lighter slate to group content blocks and sidebars.
- **Muted Text** (#94A3B8): Used for secondary labels, hints, and timestamps.
- **Subtle Borders** (#334155): Defines structure between surfaces without drawing the eye.

**The One Voice Rule.** The `clarity` teal is used sparingly. It highlights primary actions and active selections. It does not exist to decorate surfaces. If everything is teal, nothing is an action.

## Typography

**Display/Body Font:** Geist Sans (with system-ui fallback)
**Label/Mono Font:** Geist Mono (with monospace fallback)

**Character:** Modern, structural, and exceptionally legible. The use of Geist aligns the interface with standard developer-tool ergonomics, reinforcing the "Terminal" metaphor.

### Hierarchy
- **Display** (Extra Bold 800, tracking-tight): Used solely for page titles (`text-3xl`).
- **Title** (Bold 700): Used for section headers and quiz questions.
- **Body** (Regular 400): Standard reading text. Line height is tightened (`leading-relaxed`) in the prose/chat contexts.
- **Label** (Semibold 600, text-xs/sm): Used for metadata, small buttons, and step indicators.
- **Mono** (text-sm): Used for session data presentation, code blocks, and timers.

## Layout

The application scales dynamically from narrow mobile views to large desktop displays.
- **Max Width:** Restrained to `max-w-7xl` centered on large desktop screens to maintain a comfortable reading line length.
- **Grid:** A dual-column layout (`grid-cols-12`) on desktop; an 8-column main study area and a 4-column side panel for upload/management. It collapses to a single column stack on mobile.
- **Rhythm:** Generous spacing (`p-6` to `p-12`) frames the main containers, providing "breathing room" around dense text.

## Elevation & Depth

The system uses **flat and tonal layering**, relying entirely on distinct border strokes to establish depth.

**The Flat-Surface Rule.** There are no blur shadows (`box-shadow`) in this UI. Hierarchy is communicated through surface-color steps (from Background to Surface) bordered by a crisp, 1px stroke.

## Shapes

Form language is moderately rounded, striking a balance between approachable curves and distinct structural lines.
- **Cards/Panels:** `rounded-xl` (0.75rem / 12px) to define major structural areas.
- **Buttons/Inputs:** `rounded-lg` (0.5rem / 8px) for interactive elements.
- **Badges/Counters:** `rounded-full` (capsule shapes) or `rounded-sm` for small tags.

## Components

Utilitarian control surfaces built for speed and clarity.

### Buttons
- **Shape:** Softly curved (`rounded-lg`).
- **Primary:** `bg-clarity` with the darkest text color (`#0F172A`) for maximum stark contrast. Font is bold.
- **Hover/Active:** Scale slightly (`active:scale-98`) and shift brightness.
- **Secondary:** Transparent background with `border-border` and `text-muted`.

### Cards & Panels
- **Shape:** `rounded-xl` with 1px `border-border`.
- **Background:** `bg-surface`.
- **Internal Padding:** `p-6`.

### Inputs (Chat & Form)
- **Shape:** `rounded-full` for the chat bar, `rounded-lg` for dropdowns.
- **Style:** Uses `bg-[#0F172A]` nested inside the `surface` wrapper to create an inset, carved-out appearance.
- **Focus:** No glow—a crisp 1px `border-clarity` stroke.

### File Upload Zone
- **Style:** Transparent background with a dashed `border-border` stroke.
- **Hover:** Shifts to `bg-clarity/5` and `border-clarity`.

## Do's and Don'ts

### Do:
- **Do** rely on `border-border` to segment content blocks instead of relying on different background colors.
- **Do** group related choices behind plain, flat tabs that highlight the active state with `bg-clarity text-[#0F172A]`.
- **Do** keep math and diagram visual outputs tightly padded within their blocks.

### Don't:
- **Don't** add shadows under buttons or cards. Depth is purely tonal.
- **Don't** combine border-radius with thick bottom borders (e.g., `border-b-2` on a rounded component). It breaks the structural line-weight.
- **Don't** use generic stock imagery. The UI relies strictly on layout, typography, and SVG iconography.