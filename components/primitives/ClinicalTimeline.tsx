"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────────────────
 * CLINICAL TIMELINE
 * Vertical timeline with day groups, severity-coded nodes,
 * expandable note panels with CSS grid transitions.
 * Follows the Paper.design reference using project tokens.
 * ───────────────────────────────────────────────────────── */

type Event = {
  time: string;
  title: string;
  detail: string;
  provider: string;
  location?: string;
  severity: "routine" | "moderate" | "urgent";
};

type DayGroup = {
  label: string;
  active?: boolean;
  events: Event[];
};

const GROUPS: DayGroup[] = [
  {
    label: "Today",
    active: true,
    events: [
      { time: "14:30", title: "Lab results reviewed", detail: "CBC and BMP reviewed. Glucose elevated at 242 mg/dL. K⁺ mildly elevated at 5.4 mEq/L.", provider: "Dr. Rivera", severity: "moderate" },
      { time: "10:00", title: "Metformin dose adjusted", detail: "Increased from 500mg BID to 850mg BID per endocrinology recommendation.", provider: "Dr. Höller", severity: "routine" },
    ],
  },
  {
    label: "Yesterday",
    events: [
      { time: "16:45", title: "Central line placed", detail: "Right IJ triple-lumen catheter placed under ultrasound guidance. No complications.", provider: "Dr. Sharma", location: "Room 5A", severity: "moderate" },
      { time: "08:00", title: "Admitted to 5A", detail: "Admitted for chest pain evaluation. Troponin trend pending. Started on telemetry.", provider: "Dr. Rivera", location: "Room 5A", severity: "urgent" },
    ],
  },
  {
    label: "Sep 13, 2026",
    events: [
      { time: "22:15", title: "Nursing note", detail: "Patient reports chest pain 4/10, radiating to left arm. Onset 30 min ago. Nitroglycerin given, pain reduced to 2/10.", provider: "RN Chen", severity: "urgent" },
    ],
  },
  {
    label: "Sep 12, 2026",
    events: [
      { time: "11:00", title: "Pre-admission labs", detail: "BMP within normal limits. Creatinine 0.9 mg/dL. eGFR >60.", provider: "Dr. Rivera", severity: "routine" },
    ],
  },
  {
    label: "Sep 10, 2026",
    events: [
      { time: "09:30", title: "Discharged from 3B", detail: "Stable for discharge. Follow-up in 1 week. Continue home medications.", provider: "Dr. Höller", location: "Room 3B", severity: "routine" },
    ],
  },
];

const SEVERITY_BG: Record<string, string> = {
  routine: "var(--green)",
  moderate: "var(--orange)",
  urgent: "var(--red)",
};

export default function ClinicalTimeline() {
  const [openPanels, setOpenPanels] = useState<Set<string>>(new Set());

  const togglePanel = (id: string) => {
    setOpenPanels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      className="timeline"
      style={{
        width: "100%",
        maxWidth: 480,
        padding: "12px 16px",
        borderRadius: "var(--radius-control)",
        overflow: "hidden",
        position: "relative",
        background: "transparent",
      }}
    >
      <div className="timeline__inner" style={{ position: "relative", width: "100%", margin: "0 auto" }}>
        {/* vertical rail */}
        <div
          className="timeline__rail"
          style={{
            position: "absolute",
            left: 7,
            top: 0,
            width: 1,
            height: "100%",
            background: "var(--line)",
          }}
        />

        {GROUPS.map((group) => {
          const hasOpenEvent = group.events.some((ev) =>
            openPanels.has(`${group.label}-${ev.time}`)
          );
          const isActive = group.active || hasOpenEvent;

          return (
            <div
              key={group.label}
              className={`group${isActive ? " is-active" : ""}`}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                width: "100%",
                padding: "8px 8px 8px 4px",
              }}
            >
              {/* node marker */}
              <div
                className={`node ${isActive ? "node--active" : "node--idle"}`}
                style={{
                  width: 8,
                  height: 8,
                  marginTop: 2,
                  borderRadius: 9999,
                  flexShrink: 0,
                  background: isActive ? "var(--orange)" : "var(--ink-3)",
                  boxShadow: isActive
                    ? "var(--orange-glow) 0 1px 3px, var(--orange-glow) 0 5px 5px -1px, var(--orange-glow) 0 11px 6px -2px, var(--orange-glow) 0 19px 8px -3px"
                    : "0 0 0 2px var(--surface)",
                }}
              />

              <div style={{ flex: "1 1 0%", minWidth: 0, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
                {/* day label */}
                <div
                  className={`group__label${isActive ? " group__label--active" : ""}`}
                  style={{
                          fontSize: 12,
                    lineHeight: "normal",
                    fontWeight: 500,
                    color: isActive ? "var(--orange)" : "var(--ink)",
                    transition: "color 300ms ease",
                    ...(isActive
                      ? {
                          backgroundImage: "linear-gradient(90deg, var(--orange) 0%, oklch(0.8 0.12 50) 40%, var(--orange) 80%)",
                          backgroundSize: "200% auto",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          animation: "shimmer-text 3s linear infinite",
                        }
                      : {}),
                  }}
                >
                  {group.label}
                </div>

                {group.events.map((ev) => {
                  const id = `${group.label}-${ev.time}`;
                  const isOpen = openPanels.has(id);

                  return (
                    <div key={id} className="time-section" style={{ width: "100%", paddingTop: 4, display: "flex", alignItems: "flex-start", gap: 4, flexWrap: "wrap" }}>
                      {/* time header */}
                      <span
                        className="time-section__head"
                        style={{
                    fontSize: 13,
                          fontWeight: 500,
                          textTransform: "uppercase",
                          letterSpacing: "0.3px",
                          color: "var(--ink-3)",
                          flexShrink: 0,
                          minWidth: 32,
                          paddingTop: 1,
                          fontFamily: "var(--font-mono)",
                          order: 1,
                        }}
                      >
                        {ev.time}
                      </span>

                      {/* event row */}
                      <div className="time-section__events" style={{ display: "flex", flexDirection: "row", gap: 4, flex: 1, alignItems: "flex-start", order: 0, flexWrap: "wrap" }}>
                        <div className="event" style={{ display: "flex", alignItems: "flex-start", gap: 6, width: "100%", padding: 4, borderRadius: "var(--radius-chip)", transition: "background 140ms ease-out", cursor: "pointer" }}>
                          {/* event dot */}
                          <div
                            className="event__dot"
                            style={{
                              width: 6,
                              height: 6,
                              marginTop: 5,
                              borderRadius: 9999,
                              background: "var(--ink-3)",
                              flexShrink: 0,
                            }}
                          />

                          <div className="event__stack" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4, width: "100%" }}>
                            <div className="event__head" style={{ display: "flex", alignItems: "flex-start", gap: 6, flexWrap: "wrap" }}>
                              {/* title + chevron */}
                              <button
                                type="button"
                                onClick={() => togglePanel(id)}
                                aria-expanded={isOpen}
                                aria-controls={`panel-${id}`}
                                className="event__trigger"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  background: "none",
                                  border: "none",
                                  padding: 0,
                                  cursor: "pointer",
                                  font: "inherit",
                                  color: "inherit",
                                }}
                              >
                                <span
                                  className="event__title"
                                  style={{ fontWeight: 500, fontSize: 12, lineHeight: "normal", color: "var(--ink)" }}
                                >
                                  {ev.title}
                                </span>
                                <svg
                                  className="chevron"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                  style={{
                                    width: 12,
                                    height: 12,
                                    flexShrink: 0,
                                    overflow: "visible",
                                    transition: "transform 300ms cubic-bezier(0.23, 1, 0.32, 1)",
                                    transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                                  }}
                                >
                                  <path d="M6 9l6 6 6-6" fill="none" stroke="var(--ink-3)" strokeWidth={2} strokeLinecap="round" />
                                </svg>
                              </button>
                            </div>

                            {/* expandable panel */}
                            <div
                              className={`event__panel${isOpen ? " is-open" : ""}`}
                              id={`panel-${id}`}
                              style={{
                                display: "grid",
                                gridTemplateRows: isOpen ? "1fr" : "0fr",
                                opacity: isOpen ? 1 : 0,
                                transition: "grid-template-rows 300ms cubic-bezier(0.23, 1, 0.32, 1), opacity 300ms cubic-bezier(0.23, 1, 0.32, 1)",
                                width: "100%",
                              }}
                            >
                              <div style={{ overflow: "hidden" }}>
                                <div
                                  className="note"
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    gap: 6,
                                    width: "100%",
                                    padding: 8,
                                    marginTop: 4,
                                    borderRadius: 6,
                                    background: "var(--surface)",
                                    border: "2px solid var(--line)",
                                    boxShadow: "0 1px 3px oklch(0 0 0 / 0.05)",
                                  }}
                                >
                                  <p className="note__text" style={{ width: "100%", fontSize: 12, lineHeight: 1.5, textWrap: "pretty", color: "var(--ink)", margin: 0 }}>
                                    {ev.detail}
                                  </p>
                                  <div className="note__meta" style={{ width: "fit-content", fontSize: 10, lineHeight: "120%", color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 4 }}>
                                    {ev.provider}
                                    {ev.location && <span>• {ev.location}</span>}
                                    <span className="note__severity" style={{ display: "inline-flex", alignItems: "center", gap: 3, textTransform: "capitalize" }}>
                                      <i
                                        style={{
                                          display: "inline-block",
                                          width: 5,
                                          height: 5,
                                          borderRadius: 9999,
                                          background: SEVERITY_BG[ev.severity],
                                        }}
                                      />
                                      {ev.severity}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
