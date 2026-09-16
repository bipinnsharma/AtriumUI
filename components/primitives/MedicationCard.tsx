"use client";

import { useState } from "react";
import { ProgressRing } from "@/components/atoms/ProgressRing";
import { StatusPill } from "@/components/atoms/StatusPill";

/* ─────────────────────────────────────────────────────────
 * MEDICATION CARD
 * Drug info card with dosing schedule, interaction
 * warnings, and adherence ring. Zero-props demo.
 * ───────────────────────────────────────────────────────── */

type Medication = {
  name: string;
  dose: string;
  route: string;
  frequency: string;
  prescriber: string;
  nextDose: string;
  adherence: number;
  interactions?: string[];
  status: "active" | "held" | "discontinued";
};

const MEDS: Medication[] = [
  {
    name: "Lisinopril",
    dose: "10 mg",
    route: "PO",
    frequency: "QD",
    prescriber: "Dr. Rivera",
    nextDose: "8:00 AM",
    adherence: 0.94,
    status: "active",
  },
  {
    name: "Metformin",
    dose: "500 mg",
    route: "PO",
    frequency: "BID",
    prescriber: "Dr. Höller",
    nextDose: "6:00 PM",
    adherence: 0.87,
    interactions: ["Take with food to reduce GI upset"],
    status: "active",
  },
  {
    name: "Aspirin",
    dose: "81 mg",
    route: "PO",
    frequency: "QD",
    prescriber: "Dr. Rivera",
    nextDose: "8:00 AM",
    adherence: 0.72,
    interactions: ["May increase bleeding risk with anticoagulants"],
    status: "active",
  },
  {
    name: "Ibuprofen",
    dose: "400 mg",
    route: "PO",
    frequency: "PRN",
    prescriber: "Dr. Sharma",
    nextDose: "As needed",
    adherence: 0.45,
    status: "held",
  },
];

const STATUS_TONE: Record<string, "green" | "orange" | "neutral"> = {
  active: "green",
  held: "orange",
  discontinued: "neutral",
};

function InteractionBanner({ warnings }: { warnings: string[] }) {
  return (
    <div className="mt-2 rounded-control bg-orange-tint/50 px-2.5 py-1.5">
      <div className="flex items-start gap-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round" className="mt-0.5 shrink-0">
          <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <div className="flex flex-col gap-0.5">
          {warnings.map((w, i) => (
            <span key={i} className="text-[10px] leading-tight text-orange">{w}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MedicationCard() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="w-full max-w-md space-y-2.5">
      {MEDS.map((m) => {
        const isOpen = expanded === m.name;
        return (
          <div key={m.name} className="rounded-card border border-line bg-surface overflow-hidden">
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : m.name)}
              className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-hover"
            >
              <ProgressRing progress={m.adherence} tone={m.adherence >= 0.9 ? "green" : m.adherence >= 0.7 ? "orange" : "red"} size={36}>
                <span className="text-[9px] font-semibold">{Math.round(m.adherence * 100)}%</span>
              </ProgressRing>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-ink">{m.name}</span>
                  <StatusPill tone={STATUS_TONE[m.status]}>{m.status}</StatusPill>
                </div>
                <div className="text-[11px] text-ink-3">{m.dose} {m.route} · {m.frequency} · {m.prescriber}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[10px] text-ink-3">Next</div>
                <div className="text-[11px] font-medium text-ink tabular-nums">{m.nextDose}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" className="shrink-0 transition-transform duration-200" style={{ transform: isOpen ? "rotate(180deg)" : "" }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {isOpen && (
              <div className="border-t border-line bg-inset px-3.5 py-3" style={{ animation: "fade-in 200ms ease both" }}>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><span className="text-ink-3">Route:</span> <span className="font-medium text-ink">{m.route}</span></div>
                  <div><span className="text-ink-3">Frequency:</span> <span className="font-medium text-ink">{m.frequency}</span></div>
                  <div><span className="text-ink-3">Prescriber:</span> <span className="font-medium text-ink">{m.prescriber}</span></div>
                  <div><span className="text-ink-3">Adherence:</span> <span className="font-medium text-ink">{Math.round(m.adherence * 100)}%</span></div>
                </div>
                {m.interactions && <InteractionBanner warnings={m.interactions} />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
