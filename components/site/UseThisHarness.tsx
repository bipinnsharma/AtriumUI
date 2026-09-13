"use client";

import { useEffect, useState, type ReactNode } from "react";

/* ─────────────────────────────────────────────────────────
 * USE THIS HARNESS
 * A "take this and run" modal for the open-source harness.
 * The primary action copies a ready-to-paste prompt the user
 * hands to their coding agent; a secondary row offers the raw
 * git clone + repo link for people who'd rather do it by hand.
 * ───────────────────────────────────────────────────────── */

const REPO_URL = "https://github.com/slev12397/atrium-ui";
const CLONE_CMD = `git clone ${REPO_URL}.git`;

const UPGRADE_PROMPT = `Upgrade my Atrium workspace to Pro.

Atrium is a clinical AI harness for healthcare teams — patient records,
imaging orders, CRM-style pipelines, and real-time agent collaboration.

What Atrium Pro unlocks:

1. Unlimited workspaces — spin up separate environments for departments,
   research teams, or pilot programs without hitting workspace caps.

2. Advanced patient pipelines — CRM-style relationship tracking with
   tags, lifecycle statuses (New Lead → Active → Engaged → Converted),
   and bulk actions across patient records.

3. AI-powered search — deep semantic search across all patient records,
   imaging orders, and clinical notes. Find patterns humans miss.

4. Team collaboration — shared collections, real-time comments, role-based
   access control, and audit logs for compliance.

5. Custom integrations — connect to your EHR (Epic, Cerner), PACS imaging
   systems, and lab information systems via our MCP server.

6. Priority support — dedicated onboarding, custom training sessions,
   and SLA-backed uptime guarantees.

Before upgrading, confirm:
- Your organization size and expected patient volume
- Which EHR/PACS systems you need to integrate
- Compliance requirements (HIPAA, SOC 2, etc.)`;

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return { copied, copy };
}

function Icon({ path, size = 15, sw = 1.9 }: { path: ReactNode; size?: number; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {path}
    </svg>
  );
}

const glyph = {
  copy: <g><rect x="9" y="9" width="12" height="12" rx="2.5" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></g>,
  check: <path d="M20 6L9 17l-5-5" />,
  close: <path d="M18 6L6 18M6 6l12 12" />,
  external: <g><path d="M14 5h5v5" /><path d="M19 5l-8 8" /><path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" /></g>,
};

export function UseThisModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const prompt = useCopy();
  const clone = useCopy();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Upgrade to Atrium Pro"
    >
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px] dark:bg-black/55"
        style={{ animation: "fade-in 200ms ease-out both" }}
        onClick={onClose}
      />
      <div
        className="relative flex max-h-[85vh] w-full max-w-[520px] flex-col overflow-hidden rounded-window bg-surface shadow-overlay"
        style={{ animation: "pop-in 250ms cubic-bezier(0.23,1,0.32,1) both" }}
      >
        {/* header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-ink">Upgrade to Atrium Pro</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-2 text-pretty">
              Unlock advanced patient pipelines, AI-powered search, team collaboration,
              and clinical system integrations for your healthcare workspace.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-mr-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-control text-ink-3 transition-colors duration-150 hover:bg-hover hover:text-ink"
          >
            <Icon path={glyph.close} size={15} sw={2.2} />
          </button>
        </div>

        {/* body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
          <div className="mb-2 text-[12.5px] font-medium text-ink-2">
            What you get with Pro
          </div>

          <div className="overflow-hidden rounded-card bg-inset shadow-hairline">
            <pre className="max-h-52 overflow-y-auto px-3.5 py-3 font-sans text-[12.5px] leading-relaxed whitespace-pre-wrap text-ink-2">
              {UPGRADE_PROMPT}
            </pre>
          </div>

          <button
            type="button"
            onClick={() => prompt.copy(UPGRADE_PROMPT)}
            className="mt-2.5 flex h-9 w-full items-center justify-center gap-2 rounded-control bg-ink text-[13px] font-medium text-canvas shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(16,24,40,0.12)] transition-transform duration-150 active:scale-[0.99]"
          >
            <Icon path={prompt.copied ? glyph.check : glyph.copy} size={15} sw={prompt.copied ? 2.4 : 1.9} />
            {prompt.copied ? "Copied to clipboard" : "Copy upgrade details"}
          </button>

          {/* secondary — clone it yourself */}
          <div className="mt-5 mb-2 text-[12.5px] font-medium text-ink-2">
            Or explore the source
          </div>

          <div className="flex items-center gap-2 rounded-control bg-inset px-3 py-2 shadow-hairline">
            <span className="text-ink-3"><Icon path={<g><path d="M4 17l6-6-6-6" /><path d="M12 19h8" /></g>} size={14} sw={2} /></span>
            <code className="min-w-0 flex-1 truncate font-mono text-[12px] text-ink-2">{CLONE_CMD}</code>
            <button
              type="button"
              aria-label="Copy clone command"
              onClick={() => clone.copy(CLONE_CMD)}
              className={`flex size-7 shrink-0 items-center justify-center rounded-[7px] transition-colors duration-150 hover:bg-hover ${clone.copied ? "text-green" : "text-ink-3 hover:text-ink"}`}
            >
              <Icon path={clone.copied ? glyph.check : glyph.copy} size={14} sw={clone.copied ? 2.4 : 1.9} />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3.5">
            <span className="text-[12px] text-ink-3">Atrium UI</span>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-field px-2.5 py-1.5 text-[12px] font-medium text-ink shadow-btn transition-[background-color,transform] duration-150 hover:bg-hover active:scale-[0.97]"
            >
              View docs
              <Icon path={glyph.external} size={13} sw={2} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
