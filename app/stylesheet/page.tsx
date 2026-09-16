"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Chip } from "@/components/atoms/Chip";
import { EntityChip, Monogram } from "@/components/atoms/EntityChip";
import { ProgressRing } from "@/components/atoms/ProgressRing";
import { SegmentedControl } from "@/components/atoms/SegmentedControl";
import { Shimmer } from "@/components/atoms/Shimmer";
import { StatusPill } from "@/components/atoms/StatusPill";
import { StreamText } from "@/components/atoms/StreamText";
import { Switch } from "@/components/atoms/Switch";
import { TextRow } from "@/components/atoms/TextRow";
import { ValuePill } from "@/components/atoms/ValuePill";
import LoadingState from "@/components/primitives/LoadingState";
import ThinkingState from "@/components/primitives/ThinkingState";
import { NewChatIcon, HomeIcon, MailIcon, UserPlusIcon } from "@/components/primitives/Icons";

/* ── Design data ─────────────────────────────────────────── */

const surfaces = [
  { name: "--page", light: "oklch(0.985 0.001 286.376)", dark: "oklch(0.209 0.004 264.477)", cssVar: "var(--page)" },
  { name: "--canvas", light: "oklch(0.961 0.002 247.84)", dark: "oklch(0.231 0.004 264.487)", cssVar: "var(--canvas)" },
  { name: "--surface", light: "oklch(1 0 0)", dark: "oklch(0.26 0.006 271.191)", cssVar: "var(--surface)" },
  { name: "--inset", light: "oklch(0.979 0.002 247.839)", dark: "oklch(0.243 0.004 264.492)", cssVar: "var(--inset)" },
  { name: "--hover", light: "oklch(0.97 0.002 247.839)", dark: "oklch(0.289 0.006 271.22)", cssVar: "var(--hover)" },
  { name: "--hover-2", light: "oklch(0.933 0.003 247.86)", dark: "oklch(0.318 0.007 274.747)", cssVar: "var(--hover-2)" },
];

const inkRamp = [
  { name: "--ink", light: "oklch(0.247 0.006 258.361)", dark: "oklch(0.964 0.002 247.839)", cssVar: "var(--ink)" },
  { name: "--ink-2", light: "oklch(0.506 0.01 264.477)", dark: "oklch(0.731 0.008 260.731)", cssVar: "var(--ink-2)" },
  { name: "--ink-3", light: "oklch(0.695 0.009 264.505)", dark: "oklch(0.541 0.01 264.484)", cssVar: "var(--ink-3)" },
];

const borders = [
  { name: "--line", light: "oklch(0.946 0.003 264.542)", dark: "oklch(0.308 0.006 258.354)", cssVar: "var(--line)" },
  { name: "--line-strong", light: "oklch(0.912 0.005 258.326)", dark: "oklch(0.356 0.007 264.474)", cssVar: "var(--line-strong)" },
  { name: "--line-soft", light: "oklch(0.966 0.002 264.542)", dark: "oklch(0.278 0.006 258.354)", cssVar: "var(--line-soft)" },
  { name: "--field", light: "oklch(0.961 0.001 286.375)", dark: "oklch(0.293 0.006 271.223)", cssVar: "var(--field)" },
];

const accent = [
  { name: "--accent", light: "oklch(0.626 0.205 254.947)", dark: "oklch(0.68 0.173 253.301)", cssVar: "var(--accent)" },
  { name: "--accent-ink", light: "oklch(0.556 0.187 255.617)", dark: "oklch(0.788 0.113 248.33)", cssVar: "var(--accent-ink)" },
  { name: "--accent-tint", light: "oklch(0.96 0.019 252.878)", dark: "oklch(0.68 0.173 253.301 / 0.16)", cssVar: "var(--accent-tint)" },
];

const semantic = [
  { name: "--green", light: "oklch(0.603 0.155 150.883)", dark: "oklch(0.705 0.154 153.814)", cssVar: "var(--green)" },
  { name: "--green-tint", light: "oklch(0.958 0.017 159.118)", dark: "oklch(0.705 0.154 153.814 / 0.14)", cssVar: "var(--green-tint)" },
  { name: "--orange", light: "oklch(0.689 0.179 49.902)", dark: "oklch(0.746 0.156 55.642)", cssVar: "var(--orange)" },
  { name: "--orange-tint", light: "oklch(0.964 0.021 67.581)", dark: "oklch(0.746 0.156 55.642 / 0.14)", cssVar: "var(--orange-tint)" },
  { name: "--red", light: "oklch(0.621 0.192 23.042)", dark: "oklch(0.666 0.18 21.433)", cssVar: "var(--red)" },
  { name: "--red-tint", light: "oklch(0.956 0.017 17.462)", dark: "oklch(0.666 0.18 21.433 / 0.14)", cssVar: "var(--red-tint)" },
];

const typeScale = [10, 10.5, 11, 11.5, 12, 12.5, 13, 14];
const spacingScale = [2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32];
const radii = [
  { name: "chip", value: "6px", token: "--radius-chip" },
  { name: "control", value: "8px", token: "--radius-control" },
  { name: "card", value: "10px", token: "--radius-card" },
  { name: "window", value: "14px", token: "--radius-window" },
  { name: "pill", value: "9999px", token: "pill" },
];

const shadows = [
  { name: "hairline", token: "--shadow-hairline", usage: "Subtle boundary" },
  { name: "btn", token: "--shadow-btn", usage: "Button lift" },
  { name: "card", token: "--shadow-card", usage: "Card elevation" },
  { name: "raised", token: "--shadow-raised", usage: "Popover/dropdown" },
  { name: "overlay", token: "--shadow-overlay", usage: "Modal/drawer" },
  { name: "inset-field", token: "--shadow-inset-field", usage: "Input fields" },
];

const easings = [
  { name: "--ease-out-strong", value: "cubic-bezier(0.23, 1, 0.32, 1)", usage: "Enter/hover" },
  { name: "--ease-in-out-strong", value: "cubic-bezier(0.77, 0, 0.175, 1)", usage: "Transitions" },
  { name: "--ease-link", value: "cubic-bezier(0.16, 1, 0.3, 1)", usage: "Link underlines" },
];

const keyframes = [
  { name: "fade-in", effect: "Opacity 0 → 1" },
  { name: "fade-up", effect: "Opacity 0 → 1 + translateY 8px → 0" },
  { name: "pop-in", effect: "Opacity 0 → 1 + scale 0.96 → 1" },
  { name: "shimmer-text", effect: "Gradient sweep left → right" },
  { name: "spin", effect: "360° rotation" },
  { name: "caret-blink", effect: "Step-end opacity toggle" },
  { name: "pencil-wiggle", effect: "Pencil icon wiggle on hover" },
  { name: "door-fill", effect: "Door rect height fills on hover" },
  { name: "star-spin", effect: "Star badge rotates 90° on hover" },
];

const DESIGN_MD = `# Atrium UI — Design System

Crafted, copy-paste interface primitives for AI-native medical professional products.

## Philosophy

- **Cool, blue-tinted neutrals** — near-white canvas, white cards, hairline borders (not alpha).
- **One blue accent** — semantic color (green/orange/red) used sparingly as a condiment.
- **Tight radii** — chip 6px · control 8px · card 10px · window 14px · pill 9999px.
- **Restrained, layered shadows** — hairline ring first, then smooth stacked layers.
- **Type** — Inter (tight tracking, tabular numerals) + JetBrains Mono.

## Tokens

### Surfaces
--page: oklch(0.985 0.001 286.376) / oklch(0.209 0.004 264.477) — Page background
--canvas: oklch(0.961 0.002 247.84) / oklch(0.231 0.004 264.487) — Canvas layer
--surface: oklch(1 0 0) / oklch(0.26 0.006 271.191) — Card/panel surface
--inset: oklch(0.979 0.002 247.839) / oklch(0.243 0.004 264.492) — Inset areas
--hover: oklch(0.97 0.002 247.839) / oklch(0.289 0.006 271.22) — Hover state
--hover-2: oklch(0.933 0.003 247.86) / oklch(0.318 0.007 274.747) — Secondary hover

### Ink Ramp
--ink: oklch(0.247 0.006 258.361) / oklch(0.964 0.002 247.839) — Primary text
--ink-2: oklch(0.506 0.01 264.477) / oklch(0.731 0.008 260.731) — Secondary text
--ink-3: oklch(0.695 0.009 264.505) / oklch(0.541 0.01 264.484) — Tertiary/muted

### Borders
--line: oklch(0.946 0.003 264.542) / oklch(0.308 0.006 258.354) — Default border
--line-strong: oklch(0.912 0.005 258.326) / oklch(0.356 0.007 264.474) — Emphasized border
--line-soft: oklch(0.966 0.002 264.542) / oklch(0.278 0.006 258.354) — Subtle border
--field: oklch(0.961 0.001 286.375) / oklch(0.293 0.006 271.223) — Input field bg

### Accent
--accent: oklch(0.626 0.205 254.947) / oklch(0.68 0.173 253.301) — Primary accent
--accent-ink: oklch(0.556 0.187 255.617) / oklch(0.788 0.113 248.33) — Accent text
--accent-tint: oklch(0.96 0.019 252.878) / oklch(0.68 0.173 253.301 / 0.16) — Accent bg tint

### Semantic
--green / --green-tint — Success/positive
--orange / --orange-tint — Warning/pending
--red / --red-tint — Error/negative

## Typography
Sans: Inter, ui-sans-serif, system-ui — 14px body, tight tracking (-0.01em)
Mono: JetBrains Mono, ui-monospace, SF Mono — code blocks, data values
Size scale: 10, 10.5, 11, 11.5, 12, 12.5, 13, 14px

## Spacing
4px-based grid: 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32px

## Radii
chip: 6px — Tags, small badges
control: 8px — Buttons, inputs, menus
card: 10px — Cards, panels
window: 14px — Modals, drawers, windows
pill: 9999px — Pill buttons, status badges

## Elevation
Layered shadows — hairline ring first, then smooth stacked layers:
hairline: 0 0 0 1px var(--line) — Subtle boundary
btn: ring + xs — Button lift
card: ring + sm — Card elevation
raised: ring + md — Popover/dropdown
overlay: ring + lg — Modal/drawer
inset-field: inset 0 1px 2px — Input fields

## Motion
Easing: ease-out-strong, ease-in-out-strong, ease-link
Keyframes: fade-in, fade-up, pop-in, shimmer-text, spin, caret-blink,
           pencil-wiggle, door-fill, star-spin`;

/* ── Section wrapper ─────────────────────────────────────── */

function Section({ title, id, children }: { title: string; id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="border-b border-line py-10">
      <h2 className="mb-6 text-[20px] font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}

/* ── Swatch ──────────────────────────────────────────────── */

function Swatch({ name, cssVar, light, dark }: { name: string; cssVar: string; light: string; dark: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-14 w-full rounded-card border border-line"
        style={{ background: cssVar }}
      />
      <div className="text-[11px] font-medium text-ink">{name}</div>
      <div className="text-[10px] text-ink-3 font-mono leading-tight">
        <span className="block">L: {light}</span>
        <span className="block">D: {dark}</span>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */

export default function StylesheetPage() {
  const [motionTrack, setMotionTrack] = useState(0);

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <h1 className="text-[15px] font-semibold text-ink">Atrium UI — Stylesheet</h1>
          <nav className="flex gap-4 text-[12px] text-ink-2">
            <a href="#palette" className="hover:text-ink transition-colors">Palette</a>
            <a href="#type" className="hover:text-ink transition-colors">Type</a>
            <a href="#spacing" className="hover:text-ink transition-colors">Spacing</a>
            <a href="#radius" className="hover:text-ink transition-colors">Radius</a>
            <a href="#elevation" className="hover:text-ink transition-colors">Elevation</a>
            <a href="#motion" className="hover:text-ink transition-colors">Motion</a>
            <a href="#components" className="hover:text-ink transition-colors">Components</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">

        {/* ── 1. Design System (design.md) ──────────────────── */}
        <Section title="Design System" id="design-system">
          <div className="rounded-card border border-line bg-surface p-6">
            <pre className="max-h-[500px] overflow-auto text-[12px] leading-relaxed text-ink font-mono whitespace-pre-wrap scroll-hover">
              {DESIGN_MD}
            </pre>
          </div>
        </Section>

        {/* ── 2. Palette ────────────────────────────────────── */}
        <Section title="Palette" id="palette">
          <div className="space-y-8">
            {/* Surfaces */}
            <div>
              <h3 className="mb-3 text-[13px] font-medium text-ink-2">Surfaces</h3>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
                {surfaces.map((s) => <Swatch key={s.name} {...s} />)}
              </div>
            </div>
            {/* Ink */}
            <div>
              <h3 className="mb-3 text-[13px] font-medium text-ink-2">Ink Ramp</h3>
              <div className="grid grid-cols-3 gap-4">
                {inkRamp.map((s) => <Swatch key={s.name} {...s} />)}
              </div>
            </div>
            {/* Borders */}
            <div>
              <h3 className="mb-3 text-[13px] font-medium text-ink-2">Borders</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {borders.map((s) => <Swatch key={s.name} {...s} />)}
              </div>
            </div>
            {/* Accent */}
            <div>
              <h3 className="mb-3 text-[13px] font-medium text-ink-2">Accent</h3>
              <div className="grid grid-cols-3 gap-4">
                {accent.map((s) => <Swatch key={s.name} {...s} />)}
              </div>
            </div>
            {/* Semantic */}
            <div>
              <h3 className="mb-3 text-[13px] font-medium text-ink-2">Semantic</h3>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
                {semantic.map((s) => <Swatch key={s.name} {...s} />)}
              </div>
            </div>
          </div>
        </Section>

        {/* ── 3. Type Ramp ──────────────────────────────────── */}
        <Section title="Type Ramp" id="type">
          <div className="space-y-6">
            <div className="space-y-3">
              {typeScale.map((size) => (
                <div key={size} className="flex items-baseline gap-4">
                  <span className="w-12 shrink-0 text-right text-[11px] font-mono text-ink-3">{size}px</span>
                  <span style={{ fontSize: size }} className="text-ink">
                    The quick brown fox jumps over the lazy dog
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-6">
              <div className="rounded-card border border-line px-4 py-3">
                <div className="text-[11px] text-ink-3 mb-1">Sans</div>
                <div className="text-[14px] font-sans text-ink">Inter, ui-sans-serif, system-ui</div>
              </div>
              <div className="rounded-card border border-line px-4 py-3">
                <div className="text-[11px] text-ink-3 mb-1">Mono</div>
                <div className="text-[14px] font-mono text-ink">JetBrains Mono, ui-monospace</div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 4. Spacing Grid ───────────────────────────────── */}
        <Section title="Spacing Grid" id="spacing">
          <div className="flex flex-wrap items-end gap-3">
            {spacingScale.map((px) => (
              <div key={px} className="flex flex-col items-center gap-1.5">
                <div
                  className="rounded-sm bg-accent/30 border border-accent/20"
                  style={{ width: px, height: px }}
                />
                <span className="text-[10px] font-mono text-ink-3">{px}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 5. Radius ─────────────────────────────────────── */}
        <Section title="Radius" id="radius">
          <div className="flex flex-wrap gap-4">
            {radii.map((r) => (
              <div key={r.name} className="flex flex-col items-center gap-2">
                <div
                  className="h-16 w-20 border-2 border-accent/40 bg-accent/10"
                  style={{ borderRadius: r.value }}
                />
                <div className="text-center">
                  <div className="text-[11px] font-medium text-ink">{r.name}</div>
                  <div className="text-[10px] font-mono text-ink-3">{r.value}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 6. Elevation ──────────────────────────────────── */}
        <Section title="Elevation" id="elevation">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {shadows.map((s) => (
              <div
                key={s.name}
                className="rounded-card bg-surface px-4 py-5"
                style={{ boxShadow: `var(${s.token})` }}
              >
                <div className="text-[12px] font-medium text-ink">{s.name}</div>
                <div className="text-[10px] font-mono text-ink-3 mt-0.5">{s.token}</div>
                <div className="text-[11px] text-ink-2 mt-2">{s.usage}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 7. Motion ─────────────────────────────────────── */}
        <Section title="Motion" id="motion">
          <div className="space-y-8">
            {/* Easing curves */}
            <div>
              <h3 className="mb-4 text-[13px] font-medium text-ink-2">Easing Curves</h3>
              <div className="space-y-4">
                {easings.map((e) => (
                  <div key={e.name} className="flex items-center gap-4">
                    <div className="w-40 shrink-0">
                      <div className="text-[11px] font-medium text-ink">{e.name}</div>
                      <div className="text-[10px] font-mono text-ink-3">{e.usage}</div>
                    </div>
                    <div className="relative h-2 flex-1 rounded-full bg-line-soft">
                      <div
                        className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-accent shadow-sm"
                        style={{
                          animation: `easing-demo 2s infinite`,
                          animationTimingFunction: e.value,
                        }}
                      />
                    </div>
                    <div className="w-36 shrink-0 text-right text-[10px] font-mono text-ink-3">
                      {e.value.replace("cubic-bezier", "")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Keyframes */}
            <div>
              <h3 className="mb-4 text-[13px] font-medium text-ink-2">Keyframes</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {keyframes.map((k) => (
                  <div key={k.name} className="rounded-card border border-line px-3 py-2">
                    <div className="text-[11px] font-medium text-ink font-mono">{k.name}</div>
                    <div className="text-[10px] text-ink-3 mt-0.5">{k.effect}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Keyframe for easing demo */}
          <style>{`
            @keyframes easing-demo {
              0% { left: 0; }
              50% { left: calc(100% - 14px); }
              100% { left: 0; }
            }
          `}</style>
        </Section>

        {/* ── 8. Components ─────────────────────────────────── */}
        <Section title="Components" id="components">
          <div className="space-y-10">

            {/* ── Atoms ────────────────────────────────────── */}
            <div>
              <h3 className="mb-4 text-[14px] font-semibold text-ink">Atoms</h3>
              <div className="space-y-8">

                {/* Button */}
                <div>
                  <div className="mb-2 text-[12px] font-medium text-ink-2">Button</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="accent">Accent</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="quiet">Quiet</Button>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Button variant="secondary" size="xs">xs</Button>
                    <Button variant="secondary" size="sm">sm</Button>
                    <Button variant="secondary" size="md">md</Button>
                  </div>
                </div>

                {/* Chip */}
                <div>
                  <div className="mb-2 text-[12px] font-medium text-ink-2">Chip</div>
                  <div className="flex flex-wrap gap-2">
                    <Chip>neutral</Chip>
                    <Chip tone="accent">accent</Chip>
                    <Chip tone="orange">orange</Chip>
                  </div>
                </div>

                {/* EntityChip + Monogram */}
                <div>
                  <div className="mb-2 text-[12px] font-medium text-ink-2">EntityChip + Monogram</div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Monogram color="#6366f1">DR</Monogram>
                    <EntityChip name="Dr. Rivera" color="#6366f1" />
                    <EntityChip name="Dr. Höller" color="#10b981" monogram="DH" />
                  </div>
                </div>

                {/* ProgressRing */}
                <div>
                  <div className="mb-2 text-[12px] font-medium text-ink-2">ProgressRing</div>
                  <div className="flex flex-wrap items-center gap-4">
                    <ProgressRing progress={0.25} tone="orange"><span className="text-[10px]">25%</span></ProgressRing>
                    <ProgressRing progress={0.5} tone="accent"><span className="text-[10px]">50%</span></ProgressRing>
                    <ProgressRing progress={0.75} tone="green"><span className="text-[10px]">75%</span></ProgressRing>
                    <ProgressRing progress={0.9} tone="red"><span className="text-[10px]">90%</span></ProgressRing>
                  </div>
                </div>

                {/* SegmentedControl */}
                <div>
                  <div className="mb-2 text-[12px] font-medium text-ink-2">SegmentedControl</div>
                  <SegmentedControl
                    options={["Overview", "Details", "History"] as const}
                    value="Overview"
                    onChange={() => {}}
                  />
                </div>

                {/* Shimmer */}
                <div>
                  <div className="mb-2 text-[12px] font-medium text-ink-2">Shimmer</div>
                  <Shimmer className="text-[14px] font-medium">Processing analysis...</Shimmer>
                </div>

                {/* StatusPill */}
                <div>
                  <div className="mb-2 text-[12px] font-medium text-ink-2">StatusPill</div>
                  <div className="flex flex-wrap gap-2">
                    <StatusPill tone="green">Completed</StatusPill>
                    <StatusPill tone="orange">Pending</StatusPill>
                    <StatusPill tone="red">Failed</StatusPill>
                    <StatusPill tone="accent">Active</StatusPill>
                    <StatusPill tone="neutral">Draft</StatusPill>
                  </div>
                </div>

                {/* StreamText */}
                <div>
                  <div className="mb-2 text-[12px] font-medium text-ink-2">StreamText</div>
                  <div className="rounded-card border border-line px-4 py-3 max-w-md">
                    <StreamText
                      text="The patient's lab results show improved kidney function. eGFR has increased from 42 to 58 mL/min."
                      caret
                    />
                  </div>
                </div>

                {/* Switch */}
                <div>
                  <div className="mb-2 text-[12px] font-medium text-ink-2">Switch</div>
                  <div className="flex items-center gap-4">
                    <Switch checked={false} onChange={() => {}} label="Off" />
                    <Switch checked onChange={() => {}} label="On" />
                  </div>
                </div>

                {/* TextRow */}
                <div>
                  <div className="mb-2 text-[12px] font-medium text-ink-2">TextRow</div>
                  <div className="max-w-sm rounded-card border border-line">
                    <TextRow label="Medication" value="Lisinopril 10mg" />
                    <TextRow label="Frequency" value="Once daily" />
                    <TextRow label="Refill" value="30 tablets" meta="Auto-refill enabled" />
                  </div>
                </div>

                {/* ValuePill */}
                <div>
                  <div className="mb-2 text-[12px] font-medium text-ink-2">ValuePill</div>
                  <div className="flex flex-wrap gap-2">
                    <ValuePill>10mg</ValuePill>
                    <ValuePill tone="green">Normal</ValuePill>
                    <ValuePill tone="orange">Elevated</ValuePill>
                    <ValuePill tone="red">Critical</ValuePill>
                    <ValuePill tone="accent">Primary</ValuePill>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Primitives ────────────────────────────────── */}
            <div>
              <h3 className="mb-4 text-[14px] font-semibold text-ink">Primitives</h3>
              <div className="space-y-8">

                {/* LoadingState */}
                <div>
                  <div className="mb-2 text-[12px] font-medium text-ink-2">LoadingState</div>
                  <div className="flex flex-wrap gap-6">
                    <LoadingState label="Analyzing" variant="Drive" />
                    <LoadingState label="Composing" variant="Dots" />
                    <LoadingState label="Syncing" variant="Orbit" />
                  </div>
                </div>

                {/* ThinkingState */}
                <div>
                  <div className="mb-2 text-[12px] font-medium text-ink-2">ThinkingState</div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ThinkingState variant="Steps" />
                    <ThinkingState variant="Reasoning" />
                    <ThinkingState variant="Search" />
                    <ThinkingState variant="Coding" />
                  </div>
                </div>

                {/* Icons */}
                <div>
                  <div className="mb-2 text-[12px] font-medium text-ink-2">Icons</div>
                  <div className="flex items-center gap-6">
                    <div className="group flex flex-col items-center gap-1">
                      <div className="flex h-9 w-9 items-center justify-center rounded-control bg-hover transition-colors group-hover:bg-accent-tint">
                        <NewChatIcon />
                      </div>
                      <span className="text-[10px] text-ink-3">NewChat</span>
                    </div>
                    <div className="group flex flex-col items-center gap-1">
                      <div className="flex h-9 w-9 items-center justify-center rounded-control bg-hover transition-colors group-hover:bg-accent-tint">
                        <HomeIcon />
                      </div>
                      <span className="text-[10px] text-ink-3">Home</span>
                    </div>
                    <div className="group flex flex-col items-center gap-1">
                      <div className="flex h-9 w-9 items-center justify-center rounded-control bg-hover transition-colors group-hover:bg-accent-tint">
                        <MailIcon />
                      </div>
                      <span className="text-[10px] text-ink-3">Mail</span>
                    </div>
                    <div className="group flex flex-col items-center gap-1">
                      <div className="flex h-9 w-9 items-center justify-center rounded-control bg-hover transition-colors group-hover:bg-accent-tint">
                        <UserPlusIcon />
                      </div>
                      <span className="text-[10px] text-ink-3">UserPlus</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </Section>

      </main>

      {/* Footer */}
      <footer className="border-t border-line py-8 text-center text-[12px] text-ink-3">
        Atrium UI — Crafted primitives for AI-native interfaces
      </footer>
    </div>
  );
}
