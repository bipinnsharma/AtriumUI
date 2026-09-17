"use client";

import { useState, useCallback, useEffect } from "react";
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
import StreamingText from "@/components/primitives/StreamingText";
import ApprovalCard from "@/components/primitives/ApprovalCard";
import ToolChips from "@/components/primitives/ToolChips";
import TaskRows from "@/components/primitives/TaskRows";
import ChatComposer from "@/components/primitives/ChatComposer";
import PromptBar from "@/components/primitives/PromptBar";
import RecommendationCard from "@/components/primitives/RecommendationCard";
import ContextCards from "@/components/primitives/ContextCards";
import DiffTable from "@/components/primitives/DiffTable";
import RecordsTable from "@/components/primitives/RecordsTable";
import FilterTable from "@/components/primitives/FilterTable";
import InsightCards from "@/components/primitives/InsightCards";
import CodeBlock from "@/components/primitives/CodeBlock";
import SelectionActions from "@/components/primitives/SelectionActions";
import VitalSignsMonitor from "@/components/primitives/VitalSignsMonitor";
import LabResultPanel from "@/components/primitives/LabResultPanel";
import MedicationCard from "@/components/primitives/MedicationCard";
import ClinicalTimeline from "@/components/primitives/ClinicalTimeline";
import ClinicalAlert from "@/components/primitives/ClinicalAlert";

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
  const [buttonSize, setButtonSize] = useState<"xs" | "sm" | "md">("md");
  const [segmentedValue, setSegmentedValue] = useState("Overview");
  const [switchOn, setSwitchOn] = useState(false);
  const [thinkingVariant, setThinkingVariant] = useState<"Steps" | "Reasoning" | "Search" | "Coding">("Steps");
  const [copied, setCopied] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      setDark(localStorage.getItem("bui-theme") !== "light");
    } catch {}
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;
    root.classList.add("theme-switching");
    root.classList.toggle("dark", next);
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
    try {
      localStorage.setItem("bui-theme", next ? "dark" : "light");
    } catch {}
  };

  const copyDesignMd = useCallback(() => {
    navigator.clipboard.writeText(DESIGN_MD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <img src="/Scape.svg" alt="Atrium" className="size-5" />
          </div>
          <div className="flex items-center gap-3">
            <nav className="flex gap-4 text-[12px] text-ink-2">
              <a href="#palette" className="hover:text-ink transition-colors">Palette</a>
              <a href="#type" className="hover:text-ink transition-colors">Type</a>
              <a href="#spacing" className="hover:text-ink transition-colors">Spacing</a>
              <a href="#radius" className="hover:text-ink transition-colors">Radius</a>
              <a href="#elevation" className="hover:text-ink transition-colors">Elevation</a>
              <a href="#motion" className="hover:text-ink transition-colors">Motion</a>
              <a href="#components" className="hover:text-ink transition-colors">Components</a>
            </nav>
            <button
              onClick={toggleTheme}
              className="flex h-7 w-7 items-center justify-center rounded-control text-ink-2 transition-colors hover:bg-hover hover:text-ink"
              aria-label="Toggle dark mode"
            >
              {dark ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">

        {/* ── 1. Design System (design.md) ──────────────────── */}
        <Section title="Design System" id="design-system">
          <div className="rounded-card border border-line bg-surface p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-ink-3">design.md</span>
              <button
                onClick={copyDesignMd}
                className="flex items-center gap-1.5 rounded-control px-2.5 py-1 text-[11px] font-medium text-ink-2 transition-colors hover:bg-hover hover:text-ink"
              >
                {copied ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                    Copy
                  </>
                )}
              </button>
            </div>
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
                    <div className="relative h-2 flex-1 rounded-full bg-surface">
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
        <div className="pt-10">
          <h2 className="mb-2 text-[20px] font-semibold text-ink">Components</h2>
          <p className="mb-8 text-[13px] text-ink-3">Live rendered atoms and primitives from the library.</p>

          {/* 01 Button */}
          <section id="button" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 0ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">01</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Button</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Pill-shaped button with 6 variants and 3 sizes.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 200 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto space-y-4">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button variant="primary" size={buttonSize}>Primary</Button>
                  <Button variant="secondary" size={buttonSize}>Secondary</Button>
                  <Button variant="ghost" size={buttonSize}>Ghost</Button>
                  <Button variant="accent" size={buttonSize}>Accent</Button>
                  <Button variant="success" size={buttonSize}>Success</Button>
                  <Button variant="quiet" size={buttonSize}>Quiet</Button>
                </div>
                <div className="flex justify-center">
                  <SegmentedControl
                    options={["xs", "sm", "md"] as const}
                    value={buttonSize}
                    onChange={(v) => setButtonSize(v)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 02 Chip */}
          <section id="chip" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 60ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">02</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Chip</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Monospace token chip for inline code values.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 160 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto flex flex-wrap items-center justify-center gap-2">
                <Chip>neutral</Chip>
                <Chip tone="accent">accent</Chip>
                <Chip tone="orange">orange</Chip>
              </div>
            </div>
          </section>

          {/* 03 EntityChip */}
          <section id="entity-chip" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 120ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">03</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">EntityChip</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Inline entity reference — monogram disc + name pill.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 160 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto flex flex-wrap items-center justify-center gap-3">
                <Monogram color="#6366f1">DR</Monogram>
                <EntityChip name="Dr. Rivera" color="#6366f1" />
                <EntityChip name="Dr. Höller" color="#10b981" monogram="DH" />
              </div>
            </div>
          </section>

          {/* 04 ProgressRing */}
          <section id="progress-ring" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 180ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">04</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">ProgressRing</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">SVG progress ring with center content.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 160 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto flex flex-wrap items-center justify-center gap-6">
                <ProgressRing progress={0.25} tone="orange" size={40}><span className="text-[11px]">25%</span></ProgressRing>
                <ProgressRing progress={0.5} tone="accent" size={40}><span className="text-[11px]">50%</span></ProgressRing>
                <ProgressRing progress={0.75} tone="green" size={40}><span className="text-[11px]">75%</span></ProgressRing>
                <ProgressRing progress={0.9} tone="red" size={40}><span className="text-[11px]">90%</span></ProgressRing>
              </div>
            </div>
          </section>

          {/* 05 SegmentedControl */}
          <section id="segmented-control" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 240ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">05</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">SegmentedControl</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Equal-width segmented control with sliding thumb.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 160 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto flex justify-center">
                <SegmentedControl options={["Overview", "Details", "History"] as const} value={segmentedValue} onChange={setSegmentedValue} />
              </div>
            </div>
          </section>

          {/* 06 Shimmer */}
          <section id="shimmer" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 300ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">06</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Shimmer</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Shimmering gradient text label for processing states.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 120 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto flex justify-center">
                <Shimmer className="text-[14px] font-medium">Processing analysis...</Shimmer>
              </div>
            </div>
          </section>

          {/* 07 StatusPill */}
          <section id="status-pill" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 360ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">07</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">StatusPill</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Status pill with optional leading color dot.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 160 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto flex flex-wrap items-center justify-center gap-2">
                <StatusPill tone="green">Completed</StatusPill>
                <StatusPill tone="orange">Pending</StatusPill>
                <StatusPill tone="red">Failed</StatusPill>
                <StatusPill tone="accent">Active</StatusPill>
                <StatusPill tone="neutral">Draft</StatusPill>
              </div>
            </div>
          </section>

          {/* 08 StreamText */}
          <section id="stream-text" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 420ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">08</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">StreamText</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Character-by-character streaming text reveal with blur edge and caret.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 200 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto max-w-md mx-auto rounded-card border border-line px-4 py-3">
                <StreamText text="The patient's lab results show improved kidney function. eGFR has increased from 42 to 58 mL/min." caret />
              </div>
            </div>
          </section>

          {/* 09 Switch */}
          <section id="switch" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 480ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">09</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Switch</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Toggle switch with animated knob.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 120 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto flex items-center justify-center gap-6">
                <div className="flex items-center gap-3">
                  <Switch checked={switchOn} onChange={setSwitchOn} label="Toggle" />

                </div>
              </div>
            </div>
          </section>

          {/* 10 TextRow */}
          <section id="text-row" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 540ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">10</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">TextRow</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Label-left / value-right row for cards.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 200 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto max-w-sm mx-auto rounded-card border border-line">
                <TextRow label="Medication" value="Lisinopril 10mg" />
                <TextRow label="Frequency" value="Once daily" />
                <TextRow label="Refill" value="30 tablets" meta="Auto-refill enabled" />
              </div>
            </div>
          </section>

          {/* 11 ValuePill */}
          <section id="value-pill" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 600ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">11</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">ValuePill</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Inline value badge for plain values in prose.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 120 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto flex flex-wrap items-center justify-center gap-2">
                <ValuePill>10mg</ValuePill>
                <ValuePill tone="green">Normal</ValuePill>
                <ValuePill tone="orange">Elevated</ValuePill>
                <ValuePill tone="red">Critical</ValuePill>
                <ValuePill tone="accent">Primary</ValuePill>
              </div>
            </div>
          </section>

          {/* 12 LoadingState */}
          <section id="loading-state" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 0ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">12</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Loading State</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Pixel-grid loader with shimmer and elapsed time.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 272 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto flex flex-wrap items-center justify-center gap-8">
                <LoadingState label="Analyzing" variant="Drive" />
                <LoadingState label="Composing" variant="Dots" />
                <LoadingState label="Syncing" variant="Orbit" />
              </div>
            </div>
          </section>

          {/* 13 ThinkingState */}
          <section id="thinking-state" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 60ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">13</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Thinking State</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Expandable agent trace with four variants.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 400 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto space-y-4">
                <div className="flex justify-center">
                  <SegmentedControl
                    options={["Steps", "Reasoning", "Search", "Coding"] as const}
                    value={thinkingVariant}
                    onChange={(v) => setThinkingVariant(v)}
                  />
                </div>
                <div className="flex justify-center">
                  <ThinkingState key={thinkingVariant} variant={thinkingVariant} />
                </div>
              </div>
            </div>
          </section>

          {/* 14 Icons */}
          <section id="icons" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 120ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">14</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Icons</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Custom SVG icons with hover animations.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 200 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto flex items-center justify-center gap-8">
                <div className="group flex flex-col items-center gap-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-control bg-surface shadow-hairline transition-shadow group-hover:shadow-card">
                    <NewChatIcon />
                  </div>
                  <span className="text-[10px] text-ink-3">NewChat</span>
                </div>
                <div className="group flex flex-col items-center gap-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-control bg-surface shadow-hairline transition-shadow group-hover:shadow-card">
                    <HomeIcon />
                  </div>
                  <span className="text-[10px] text-ink-3">Home</span>
                </div>
                <div className="group flex flex-col items-center gap-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-control bg-surface shadow-hairline transition-shadow group-hover:shadow-card">
                    <MailIcon />
                  </div>
                  <span className="text-[10px] text-ink-3">Mail</span>
                </div>
                <div className="group flex flex-col items-center gap-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-control bg-surface shadow-hairline transition-shadow group-hover:shadow-card">
                    <UserPlusIcon />
                  </div>
                  <span className="text-[10px] text-ink-3">UserPlus</span>
                </div>
              </div>
            </div>
          </section>

          {/* 15 StreamingText */}
          <section id="streaming-text" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 180ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">15</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Streaming Text</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Streamed answer with inline sources, actions, and follow-ups.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 400 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto">
                <StreamingText />
              </div>
            </div>
          </section>

          {/* 16 ApprovalCard */}
          <section id="approval-card" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 240ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">16</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Approval Card</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Human-in-the-loop questions the agent asks before acting.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 400 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto max-w-lg mx-auto">
                <ApprovalCard />
              </div>
            </div>
          </section>

          {/* 17 ToolChips */}
          <section id="tool-chips" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 300ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">17</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Tool Chips</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Code edits and tool calls as compact chips.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 400 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto">
                <ToolChips />
              </div>
            </div>
          </section>

          {/* 18 TaskRows */}
          <section id="task-rows" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 360ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">18</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Task Rows</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Live agent task status — running, failed, completed.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 400 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto">
                <TaskRows />
              </div>
            </div>
          </section>

          {/* 19 ChatComposer */}
          <section id="chat-composer" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 420ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">19</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Chat</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Tabbed chat panel with reasoning replies and a composer.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 500 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto">
                <ChatComposer />
              </div>
            </div>
          </section>

          {/* 20 PromptBar */}
          <section id="prompt-bar" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 480ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">20</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Prompt Bar</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Composer with @ sources, / commands, model picker, and dictation.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 400 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto">
                <PromptBar />
              </div>
            </div>
          </section>

          {/* 21 RecommendationCard */}
          <section id="recommendation-card" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 540ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">21</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Recommendation Card</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Agent suggestion with a confidence meter and actions.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 400 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto max-w-lg mx-auto">
                <RecommendationCard />
              </div>
            </div>
          </section>

          {/* 22 ContextCards */}
          <section id="context-cards" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 600ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">22</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Context Cards</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Retrieved knowledge chunks with their sources.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 400 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto">
                <ContextCards />
              </div>
            </div>
          </section>

          {/* 23 DiffTable */}
          <section id="diff-table" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 0ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">23</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Diff Table</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">AI-proposed edits sweeping through tabular data.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 400 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto">
                <DiffTable />
              </div>
            </div>
          </section>

          {/* 24 RecordsTable */}
          <section id="records-table" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 60ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">24</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Records Table</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">CRM-style grid with tags, sorting, and relationship status.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 500 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto">
                <RecordsTable />
              </div>
            </div>
          </section>

          {/* 25 FilterTable */}
          <section id="filter-table" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 120ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">25</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Filter Table</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Status chips that reorganize live data.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 400 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto">
                <FilterTable />
              </div>
            </div>
          </section>

          {/* 26 InsightCards */}
          <section id="insight-cards" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 180ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">26</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Insight Cards</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Paged agent insights with scrub-ready live charts.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 450 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto">
                <InsightCards />
              </div>
            </div>
          </section>

          {/* 27 CodeBlock */}
          <section id="code-block" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 240ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">27</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Code Block</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">A line-numbered listing and a unified diff.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 400 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto grid gap-4 sm:grid-cols-2">
                <CodeBlock variant="Code" />
                <CodeBlock variant="Diff" />
              </div>
            </div>
          </section>

          {/* 28 SelectionActions */}
          <section id="selection-actions" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 300ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">28</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Selection Actions</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Highlight a passage and hand it to the agent to rewrite.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 400 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto">
                <SelectionActions />
              </div>
            </div>
          </section>

          {/* ── Medical Components (joemedo) ────────────── */}

          {/* 29 VitalSignsMonitor */}
          <section id="vital-signs" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 0ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">29</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Vital Signs Monitor</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Dense vitals row with sparklines, trend arrows, and reference range bands.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 240 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto">
                <VitalSignsMonitor />
              </div>
            </div>
          </section>

          {/* 30 LabResultPanel */}
          <section id="lab-results" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 60ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">30</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Lab Result Panel</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Lab results with flag badges (H/L/Crit), reference ranges, and expandable trend bars.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 400 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto">
                <LabResultPanel />
              </div>
            </div>
          </section>

          {/* 31 MedicationCard */}
          <section id="medication-card" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 120ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">31</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Medication Card</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Drug info with dosing schedule, adherence ring, and interaction warnings.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 400 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto">
                <MedicationCard />
              </div>
            </div>
          </section>

          {/* 32 ClinicalTimeline */}
          <section id="clinical-timeline" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 180ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">32</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Clinical Timeline</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Vertical timeline with severity-coded dots and expandable event details.</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 400 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto">
                <ClinicalTimeline />
              </div>
            </div>
          </section>

          {/* 33 ClinicalAlert */}
          <section id="clinical-alert" className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-5 py-8 sm:px-8 sm:py-10" style={{ animation: "fade-up 600ms cubic-bezier(0.23,1,0.32,1) 240ms both" }}>
            <div className="mb-3 flex items-start gap-2 sm:items-baseline">
              <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">33</span>
              <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">Clinical Alert</h3>
                <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">Three-tier alert system — critical (blocks), warning (persistent), info (tray).</p>
              </div>
            </div>
            <div className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style={{ minHeight: 400 }}>
              <div className="w-full max-w-120 [&>*]:mx-auto">
                <ClinicalAlert />
              </div>
            </div>
          </section>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-line py-8 text-center text-[12px] text-ink-3">
        Atrium UI — Crafted primitives for AI-native interfaces
      </footer>
    </div>
  );
}
