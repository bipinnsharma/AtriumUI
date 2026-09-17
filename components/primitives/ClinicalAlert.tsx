"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";

/* ─────────────────────────────────────────────────────────
 * CLINICAL ALERT
 * Three-tier alert system: Critical (blocks, requires ack),
 * Warning (persistent, no block), Informational (tray).
 * Each tier has distinct visual treatment + interaction.
 * ───────────────────────────────────────────────────────── */

type Alert = {
  id: string;
  tier: "critical" | "warning" | "info";
  title: string;
  message: string;
  source?: string;
  timestamp?: string;
};

const ALERTS: Alert[] = [
  {
    id: "crit-1",
    tier: "critical",
    title: "Critical: Potassium Elevated",
    message: "K⁺ at 5.4 mEq/L — above critical threshold. Consider repeat lab and cardiac monitoring.",
    source: "Lab Alert",
    timestamp: "2 min ago",
  },
  {
    id: "warn-1",
    tier: "warning",
    title: "Drug Interaction Detected",
    message: "Lisinopril + Potassium supplement may cause hyperkalemia. Review current orders.",
    source: "Pharmacy Alert",
    timestamp: "15 min ago",
  },
  {
    id: "info-1",
    tier: "info",
    title: "Result Available",
    message: "Blood culture results for Bed 5A are now available for review.",
    source: "Lab Notification",
    timestamp: "1 hr ago",
  },
];

const TIER_STYLES: Record<string, { bg: string; border: string; iconStroke: string; badge: string; badgeText: string }> = {
  critical: {
    bg: "bg-red-tint/40",
    border: "border-red/30",
    iconStroke: "var(--red)",
    badge: "bg-red",
    badgeText: "text-white",
  },
  warning: {
    bg: "bg-orange-tint/40",
    border: "border-orange/30",
    iconStroke: "var(--orange)",
    badge: "bg-orange",
    badgeText: "text-white",
  },
  info: {
    bg: "bg-accent-tint/40",
    border: "border-accent/20",
    iconStroke: "var(--accent)",
    badge: "bg-accent/20",
    badgeText: "text-accent",
  },
};

function AlertIcon({ tier, stroke }: { tier: string; stroke: string }) {
  if (tier === "critical") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" className="shrink-0">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );
  }
  if (tier === "warning") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" className="shrink-0">
        <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" className="shrink-0">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export default function ClinicalAlert() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [acked, setAcked] = useState<Set<string>>(new Set());

  const visible = ALERTS.filter((a) => !dismissed.has(a.id));

  return (
    <div className="w-full max-w-lg space-y-2.5">
      {visible.map((a) => {
        const s = TIER_STYLES[a.tier];
        const isAcked = acked.has(a.id);
        return (
          <div
            key={a.id}
            className={`rounded-card border ${s.bg} ${s.border} overflow-hidden`}
            style={{ animation: "fade-up 300ms var(--ease-out-strong) both" }}
          >
            <div className="flex items-start gap-2.5 py-2 px-3.5">
              <div className="mt-0.5">
                <AlertIcon tier={a.tier} stroke={s.iconStroke} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-medium text-ink">{a.title}</span>
                    <span className={`inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-bold uppercase ${s.badge} ${s.badgeText}`}>
                      {a.tier}
                    </span>
                  </div>
                  {(a.source || a.timestamp) && (
                    <div className="flex items-center gap-1 shrink-0">
                      {a.source && <span className="text-xs font-mono text-ink-3">{a.source}</span>}
                      {a.timestamp && <span className="text-xs font-mono text-ink-3">· {a.timestamp}</span>}
                    </div>
                  )}
                </div>
                <p className="mt-0.5 text-sm leading-[140%] text-ink-2">{a.message}</p>
              </div>
            </div>
            {a.tier === "critical" && !isAcked && (
              <div className="flex items-center justify-between pb-2 px-3.5">
                <span className="text-xs text-ink-3">Acknowledgment required</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      const reason = prompt("Dismissal reason (required):");
                      if (reason) setDismissed((d) => new Set([...d, a.id]));
                    }}
                  >
                    Dismiss
                  </Button>
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() => setAcked((s) => new Set([...s, a.id]))}
                  >
                    Acknowledge
                  </Button>
                </div>
              </div>
            )}
            {a.tier !== "critical" && (
              <div className="flex justify-end pb-2 px-3.5">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setDismissed((d) => new Set([...d, a.id]))}
                >
                  Dismiss
                </Button>
              </div>
            )}
          </div>
        );
      })}
      {visible.length === 0 && (
        <div className="rounded-card border border-line bg-surface px-4 py-6 text-center">
          <span className="text-md text-ink-3">No active alerts</span>
        </div>
      )}
    </div>
  );
}
