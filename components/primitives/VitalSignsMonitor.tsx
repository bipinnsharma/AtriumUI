"use client";

/* ─────────────────────────────────────────────────────────
 * VITAL SIGNS MONITOR
 * Dense vitals row with sparklines, trend arrows, and
 * reference range bands. Shape-coded anomaly markers
 * (▲ high, ● normal, ▼ low) for colorblind accessibility.
 * ───────────────────────────────────────────────────────── */

type Vital = {
  label: string;
  value: number;
  unit: string;
  refLow: number;
  refHigh: number;
  trend: number[];
  critical?: boolean;
};

const VITALS: Vital[] = [
  { label: "HR", value: 78, unit: "bpm", refLow: 60, refHigh: 100, trend: [72, 74, 76, 75, 78, 80, 78] },
  { label: "BP", value: 128, unit: "/82", refLow: 90, refHigh: 140, trend: [122, 125, 130, 128, 126, 132, 128] },
  { label: "RR", value: 16, unit: "/min", refLow: 12, refHigh: 20, trend: [14, 15, 16, 17, 16, 15, 16] },
  { label: "Temp", value: 37.1, unit: "°C", refLow: 36.1, refHigh: 37.2, trend: [36.8, 36.9, 37.0, 37.1, 37.2, 37.1, 37.1] },
  { label: "SpO₂", value: 97, unit: "%", refLow: 95, refHigh: 100, trend: [98, 97, 97, 96, 97, 98, 97], critical: false },
  { label: "Glucose", value: 186, unit: "mg/dL", refLow: 70, refHigh: 140, trend: [142, 155, 168, 175, 180, 184, 186], critical: true },
];

function flag(v: Vital): { symbol: string; color: string } {
  if (v.value < v.refLow) return { symbol: "▼", color: "text-blue" };
  if (v.value > v.refHigh) return v.critical ? { symbol: "▲", color: "text-red" } : { symbol: "▲", color: "text-orange" };
  return { symbol: "●", color: "text-green" };
}

function Sparkline({ points, refLow, refHigh, critical }: { points: number[]; refLow: number; refHigh: number; critical?: boolean }) {
  const w = 64;
  const h = 24;
  const min = Math.min(...points, refLow) - 2;
  const max = Math.max(...points, refHigh) + 2;
  const range = max - min || 1;
  const refY1 = h - ((refLow - min) / range) * h;
  const refY2 = h - ((refHigh - min) / range) * h;
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i / (points.length - 1)) * w},${h - ((p - min) / range) * h}`)
    .join(" ");
  const stroke = critical ? "var(--red)" : "var(--accent)";

  return (
    <svg width={w} height={h} className="shrink-0">
      <rect x={0} y={refY2} width={w} height={refY1 - refY2} fill="var(--green)" opacity={0.08} rx={2} />
      <path d={path} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - ((points[points.length - 1] - min) / range) * h} r={2.5} fill={stroke} />
    </svg>
  );
}

export default function VitalSignsMonitor() {
  return (
    <div className="w-full max-w-2xl">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {VITALS.map((v) => {
          const f = flag(v);
          return (
            <div key={v.label} className="flex flex-col items-center gap-1 rounded-card border border-line bg-surface px-2 py-2.5">
              <span className="text-[10px] font-medium text-ink-3 uppercase tracking-wide">{v.label}</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-[16px] font-semibold tabular-nums ${f.color}`}>{v.value}</span>
                <span className={`text-[10px] ${f.color}`}>{f.symbol}</span>
              </div>
              <span className="text-[9px] text-ink-3">{v.unit}</span>
              <Sparkline points={v.trend} refLow={v.refLow} refHigh={v.refHigh} critical={v.critical} />
              <span className="text-[8px] font-mono text-ink-3">{v.refLow}–{v.refHigh}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
