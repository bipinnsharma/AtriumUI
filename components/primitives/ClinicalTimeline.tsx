"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────────────────
 * CLINICAL TIMELINE
 * Emil-aligned: clean vertical timeline, generous spacing,
 * severity-coded dots, expandable detail cards. Mobile-first,
 * touch-friendly (44px targets), overscroll-behavior: contain.
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

const TYPE_LABELS: Record<string, string> = {
  admission: "Admission",
  discharge: "Discharge",
  procedure: "Procedure",
  lab: "Lab",
  medication: "Medication",
  note: "Note",
};

export default function ClinicalTimeline() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="w-full max-w-md" style={{ overscrollBehavior: "contain" }}>
      <div className="relative">
        {/* vertical connector line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-line" />

        <div className="space-y-1">
          {EVENTS.map((ev, i) => {
            const isOpen = expanded === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : i)}
                  className="relative flex w-full items-start gap-4 py-3 pl-0 pr-2 text-left rounded-card transition-colors hover:bg-hover min-h-[44px]"
                >
                  {/* dot — z-10 to sit above the line */}
                  <div className="relative z-10 mt-[7px] h-[14px] w-[14px] shrink-0 rounded-full ring-[3px] ring-surface">
                    <div className={`h-full w-full rounded-full ${SEVERITY_DOT[ev.severity]}`} />
                  </div>

                  <div className="min-w-0 flex-1 pt-px">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[12px] font-medium text-ink">{ev.title}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-3">
                      <span className="font-mono">{ev.date} {ev.time}</span>
                      <span className="text-ink-3/40">·</span>
                      <span>{TYPE_LABELS[ev.type]}</span>
                    </div>
                    {!isOpen && (
                      <p className="mt-1 text-[12px] text-ink-3 line-clamp-1">{ev.detail}</p>
                    )}
                  </div>

                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="mt-[5px] shrink-0 transition-transform duration-300"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {/* expandable detail card */}
                <div
                  className="grid transition-[grid-template-rows,opacity] duration-300"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    opacity: isOpen ? 1 : 0,
                    transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="ml-[22px] mb-2 rounded-card border border-line bg-inset px-4 py-3">
                      <p className="text-[13px] leading-relaxed text-ink">{ev.detail}</p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-3">
                        {ev.provider && <span>{ev.provider}</span>}
                        {ev.location && <span>{ev.location}</span>}
                        <span className="inline-flex items-center gap-1">
                          <span className={`inline-block size-2 rounded-full ${SEVERITY_DOT[ev.severity]}`} />
                          <span className="capitalize">{ev.severity}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
