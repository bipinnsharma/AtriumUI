"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────────────────
 * LAB RESULT PANEL
 * Structured lab results with flag badges (H/L/Crit),
 * reference ranges, and expandable trend rows.
 * Shape + color for colorblind accessibility.
 * ───────────────────────────────────────────────────────── */

type LabResult = {
  test: string;
  value: number;
  unit: string;
  refLow: number;
  refHigh: number;
  flag: "normal" | "high" | "low" | "critical";
  trend?: number[];
};

const RESULTS: LabResult[] = [
  { test: "WBC", value: 12.4, unit: "K/µL", refLow: 4.5, refHigh: 11.0, flag: "high", trend: [9.2, 10.1, 11.3, 12.0, 12.4] },
  { test: "Hgb", value: 14.1, unit: "g/dL", refLow: 12.0, refHigh: 17.5, flag: "normal" },
  { test: "Platelets", value: 138, unit: "K/µL", refLow: 150, refHigh: 400, flag: "low", trend: [195, 178, 162, 148, 138] },
  { test: "Glucose", value: 242, unit: "mg/dL", refLow: 70, refHigh: 140, flag: "critical", trend: [145, 178, 210, 232, 242] },
  { test: "BUN", value: 22, unit: "mg/dL", refLow: 7, refHigh: 20, flag: "high" },
  { test: "Creatinine", value: 1.1, unit: "mg/dL", refLow: 0.6, refHigh: 1.2, flag: "normal" },
  { test: "Na⁺", value: 140, unit: "mEq/L", refLow: 136, refHigh: 145, flag: "normal" },
  { test: "K⁺", value: 5.4, unit: "mEq/L", refLow: 3.5, refHigh: 5.0, flag: "high" },
];

const FLAG_STYLES: Record<string, { badge: string; row: string; symbol: string }> = {
  normal: { badge: "bg-green-tint text-green", row: "", symbol: "—" },
  high: { badge: "bg-orange-tint text-orange", row: "bg-orange-tint/30", symbol: "H" },
  low: { badge: "bg-accent-tint text-accent", row: "bg-accent-tint/30", symbol: "L" },
  critical: { badge: "bg-red-tint text-red", row: "bg-red-tint/30", symbol: "Crit" },
};

function MiniTrend({ points }: { points: number[] }) {
  if (!points?.length) return null;
  const w = 48;
  const h = 16;
  const min = Math.min(...points) - 1;
  const max = Math.max(...points) + 1;
  const range = max - min || 1;
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i / (points.length - 1)) * w},${h - ((p - min) / range) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="shrink-0">
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth={1.2} strokeLinecap="round" />
    </svg>
  );
}

export default function LabResultPanel() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="w-full max-w-lg rounded-card border border-line bg-surface overflow-hidden">
      <div className="border-b border-line px-4 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-ink">Lab Results</span>
          <span className="text-[10px] font-mono text-ink-3">CBC + BMP · Sep 15, 2026</span>
        </div>
      </div>
      <div className="divide-y divide-line">
        {RESULTS.map((r) => {
          const s = FLAG_STYLES[r.flag];
          const isOpen = expanded === r.test;
          return (
            <div key={r.test}>
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : r.test)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-hover ${s.row}`}
              >
                <span className="w-20 shrink-0 text-[12px] font-medium text-ink">{r.test}</span>
                <span className={`w-14 shrink-0 text-right text-[13px] font-semibold tabular-nums ${r.flag === "normal" ? "text-ink" : r.flag === "critical" ? "text-red" : r.flag === "high" ? "text-orange" : "text-blue"}`}>
                  {r.value}
                </span>
                <span className="w-12 shrink-0 text-[10px] text-ink-3">{r.unit}</span>
                <span className="flex-1 text-[10px] font-mono text-ink-3">{r.refLow}–{r.refHigh}</span>
                <MiniTrend points={r.trend ?? []} />
                <span className={`inline-flex h-5 min-w-[28px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${s.badge}`}>
                  {s.symbol}
                </span>
              </button>
              {isOpen && r.trend && (
                <div className="border-t border-line bg-inset px-4 py-3" style={{ animation: "fade-in 200ms ease both" }}>
                  <div className="text-[10px] font-medium text-ink-3 mb-2">Trend (last 5 results)</div>
                  <div className="flex items-end gap-1.5">
                    {r.trend.map((v, i) => {
                      const min = Math.min(...r.trend!) - 2;
                      const max = Math.max(...r.trend!) + 2;
                      const h = Math.round(((v - min) / (max - min)) * 40);
                      const inRange = v >= r.refLow && v <= r.refHigh;
                      return (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <span className="text-[9px] font-mono text-ink-3">{v}</span>
                          <div
                            className={`w-5 rounded-sm ${inRange ? "bg-accent/40" : "bg-red/40"}`}
                            style={{ height: h }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
