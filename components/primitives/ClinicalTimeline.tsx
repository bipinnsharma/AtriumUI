"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────────────────
 * CLINICAL TIMELINE
 * Vertical timeline with severity-coded dots, expandable
 * event details, and non-uniform time spacing.
 * ───────────────────────────────────────────────────────── */

type Event = {
  date: string;
  time: string;
  type: "admission" | "discharge" | "procedure" | "lab" | "medication" | "note";
  title: string;
  detail: string;
  provider?: string;
  location?: string;
  severity: "routine" | "moderate" | "urgent";
};

const EVENTS: Event[] = [
  { date: "Sep 15", time: "14:30", type: "lab", title: "Lab results reviewed", detail: "CBC and BMP reviewed. Glucose elevated at 242 mg/dL. K⁺ mildly elevated at 5.4 mEq/L.", provider: "Dr. Rivera", severity: "moderate" },
  { date: "Sep 15", time: "10:00", type: "medication", title: "Metformin dose adjusted", detail: "Increased from 500mg BID to 850mg BID per endocrinology recommendation.", provider: "Dr. Höller", severity: "routine" },
  { date: "Sep 14", time: "16:45", type: "procedure", title: "Central line placed", detail: "Right IJ triple-lumen catheter placed under ultrasound guidance. No complications.", provider: "Dr. Sharma", location: "Room 5A", severity: "moderate" },
  { date: "Sep 14", time: "08:00", type: "admission", title: "Admitted to 5A", detail: "Admitted for chest pain evaluation. Troponin trend pending. Started on telemetry.", provider: "Dr. Rivera", location: "Room 5A", severity: "urgent" },
  { date: "Sep 13", time: "22:15", type: "note", title: "Nursing note", detail: "Patient reports chest pain 4/10, radiating to left arm. Onset 30 min ago. Nitroglycerin given, pain reduced to 2/10.", provider: "RN Chen", severity: "urgent" },
  { date: "Sep 12", time: "11:00", type: "lab", title: "Pre-admission labs", detail: "BMP within normal limits. Creatinine 0.9 mg/dL. eGFR >60.", provider: "Dr. Rivera", severity: "routine" },
  { date: "Sep 10", time: "09:30", type: "discharge", title: "Discharged from 3B", detail: "Stable for discharge. Follow-up in 1 week. Continue home medications.", provider: "Dr. Höller", location: "Room 3B", severity: "routine" },
];

const SEVERITY_DOT: Record<string, string> = {
  routine: "bg-green",
  moderate: "bg-orange",
  urgent: "bg-red",
};

const TYPE_ICON: Record<string, string> = {
  admission: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  discharge: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z",
  procedure: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
  lab: "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z",
  medication: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z",
  note: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
};

export default function ClinicalTimeline() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-[11px] top-0 bottom-0 w-px bg-line" />

        <div className="space-y-0">
          {EVENTS.map((ev, i) => {
            const isOpen = expanded === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : i)}
                  className="relative flex w-full items-start gap-3 py-3 pl-1 pr-3 text-left transition-colors hover:bg-hover rounded-control"
                >
                  {/* dot */}
                  <div className={`relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-surface ${SEVERITY_DOT[ev.severity]}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[11px] font-mono text-ink-3">{ev.date} {ev.time}</span>
                      <span className="text-[12px] font-medium text-ink">{ev.title}</span>
                    </div>
                    {!isOpen && (
                      <p className="mt-0.5 text-[11px] text-ink-3 truncate">{ev.detail}</p>
                    )}
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" className="mt-1 shrink-0 transition-transform duration-200" style={{ transform: isOpen ? "rotate(180deg)" : "" }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="ml-7 mr-3 mb-3 rounded-card border border-line bg-inset px-3 py-2.5" style={{ animation: "fade-in 200ms ease both" }}>
                    <p className="text-[12px] leading-relaxed text-ink">{ev.detail}</p>
                    <div className="mt-2 flex gap-3 text-[10px] text-ink-3">
                      {ev.provider && <span>{ev.provider}</span>}
                      {ev.location && <span>{ev.location}</span>}
                      <span className="capitalize">{ev.severity}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
