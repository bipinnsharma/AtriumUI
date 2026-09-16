# Atrium UI — Design System

Crafted, copy-paste interface primitives for AI-native medical professional products.

## Philosophy

- **Cool, blue-tinted neutrals** — near-white canvas, white cards, hairline borders (not alpha).
- **One blue accent** — semantic color (green/orange/red) used sparingly as a condiment.
- **Tight radii** — chip `6px` · control `8px` · card `10px` · window `14px` · pill `9999px`.
- **Restrained, layered shadows** — hairline ring first, then smooth stacked layers.
- **Type** — Inter (tight tracking, tabular numerals) + JetBrains Mono.

## Tokens

### Surfaces

| Token | Value (light) | Value (dark) | Usage |
|-------|--------------|-------------|-------|
| `--page` | `oklch(0.985 0.001 286.376)` | `oklch(0.209 0.004 264.477)` | Page background |
| `--canvas` | `oklch(0.961 0.002 247.84)` | `oklch(0.231 0.004 264.487)` | Canvas layer |
| `--surface` | `oklch(1 0 0)` | `oklch(0.26 0.006 271.191)` | Card/panel surface |
| `--inset` | `oklch(0.979 0.002 247.839)` | `oklch(0.243 0.004 264.492)` | Inset areas |
| `--hover` | `oklch(0.97 0.002 247.839)` | `oklch(0.289 0.006 271.22)` | Hover state |
| `--hover-2` | `oklch(0.933 0.003 247.86)` | `oklch(0.318 0.007 274.747)` | Secondary hover |

### Ink Ramp

| Token | Value (light) | Value (dark) | Usage |
|-------|--------------|-------------|-------|
| `--ink` | `oklch(0.247 0.006 258.361)` | `oklch(0.964 0.002 247.839)` | Primary text |
| `--ink-2` | `oklch(0.506 0.01 264.477)` | `oklch(0.731 0.008 260.731)` | Secondary text |
| `--ink-3` | `oklch(0.695 0.009 264.505)` | `oklch(0.541 0.01 264.484)` | Tertiary/muted text |

### Borders

| Token | Value (light) | Value (dark) | Usage |
|-------|--------------|-------------|-------|
| `--line` | `oklch(0.946 0.003 264.542)` | `oklch(0.308 0.006 258.354)` | Default border |
| `--line-strong` | `oklch(0.912 0.005 258.326)` | `oklch(0.356 0.007 264.474)` | Emphasized border |
| `--line-soft` | `oklch(0.966 0.002 264.542)` | `oklch(0.278 0.006 258.354)` | Subtle border |
| `--field` | `oklch(0.961 0.001 286.375)` | `oklch(0.293 0.006 271.223)` | Input field bg |

### Accent

| Token | Value (light) | Value (dark) | Usage |
|-------|--------------|-------------|-------|
| `--accent` | `oklch(0.626 0.205 254.947)` | `oklch(0.68 0.173 253.301)` | Primary accent |
| `--accent-ink` | `oklch(0.556 0.187 255.617)` | `oklch(0.788 0.113 248.33)` | Accent text |
| `--accent-tint` | `oklch(0.96 0.019 252.878)` | `oklch(0.68 0.173 253.301 / 0.16)` | Accent bg tint |

### Semantic

| Token | Value (light) | Value (dark) | Usage |
|-------|--------------|-------------|-------|
| `--green` | `oklch(0.603 0.155 150.883)` | `oklch(0.705 0.154 153.814)` | Success/positive |
| `--green-tint` | `oklch(0.958 0.017 159.118)` | `oklch(0.705 0.154 153.814 / 0.14)` | Success bg |
| `--orange` | `oklch(0.689 0.179 49.902)` | `oklch(0.746 0.156 55.642)` | Warning/pending |
| `--orange-tint` | `oklch(0.964 0.021 67.581)` | `oklch(0.746 0.156 55.642 / 0.14)` | Warning bg |
| `--red` | `oklch(0.621 0.192 23.042)` | `oklch(0.666 0.18 21.433)` | Error/negative |
| `--red-tint` | `oklch(0.956 0.017 17.462)` | `oklch(0.666 0.18 21.433 / 0.14)` | Error bg |

## Typography

- **Sans**: Inter, ui-sans-serif, system-ui — 14px body, tight tracking (-0.01em), tabular numerals.
- **Mono**: JetBrains Mono, ui-monospace, SF Mono — code blocks, data values.
- **Size scale**: 10, 10.5, 11, 11.5, 12, 12.5, 13, 14px.

## Spacing

4px-based grid: `2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32px`.

## Radii

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-chip` | `6px` | Tags, small badges |
| `--radius-control` | `8px` | Buttons, inputs, menus |
| `--radius-card` | `10px` | Cards, panels |
| `--radius-window` | `14px` | Modals, drawers, windows |
| `pill` | `9999px` | Pill buttons, status badges |

## Elevation

Layered shadows — hairline ring first, then smooth stacked layers from `shadow-plugin`:

| Token | Structure | Usage |
|-------|-----------|-------|
| `--shadow-hairline` | `0 0 0 1px var(--line)` | Subtle boundary |
| `--shadow-btn` | ring + `--shadow-xs` | Button lift |
| `--shadow-card` | ring + `--shadow-sm` | Card elevation |
| `--shadow-raised` | ring + `--shadow-md` | Popover/dropdown |
| `--shadow-overlay` | ring + `--shadow-lg` | Modal/drawer |
| `--shadow-inset-field` | `inset 0 1px 2px` | Input fields |

## Motion

### Easing Curves

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out-strong` | `cubic-bezier(0.23, 1, 0.32, 1)` | Enter/hover |
| `--ease-in-out-strong` | `cubic-bezier(0.77, 0, 0.175, 1)` | Transitions |
| `--ease-link` | `cubic-bezier(0.16, 1, 0.3, 1)` | Link underlines |

### Keyframes

| Name | Effect |
|------|--------|
| `fade-in` | Opacity 0 → 1 |
| `fade-up` | Opacity 0 → 1 + translateY 8px → 0 |
| `pop-in` | Opacity 0 → 1 + scale 0.96 → 1 |
| `shimmer-text` | Gradient sweep left → right |
| `spin` | 360° rotation |
| `caret-blink` | Step-end opacity toggle |
| `pencil-wiggle` | Pencil icon wiggle on hover |
| `door-fill` | Door rect height fills on hover |
| `star-spin` | Star badge rotates 90° on hover |

## Usage in Tailwind

Tokens are mapped via `@theme inline` in `globals.css`:

```html
<!-- Colors -->
<div class="bg-surface text-ink">Surface card</div>
<div class="border-line">Bordered element</div>
<div class="text-accent">Accent text</div>

<!-- Shadows -->
<div class="shadow-card">Card elevation</div>
<div class="shadow-overlay">Modal elevation</div>

<!-- Radii -->
<div class="rounded-card">Card radius</div>
<div class="rounded-control">Control radius</div>

<!-- Easing (via arbitrary values) -->
<div class="transition-all duration-150 ease-[var(--ease-out-strong)]">
  Smooth transition
</div>
```
