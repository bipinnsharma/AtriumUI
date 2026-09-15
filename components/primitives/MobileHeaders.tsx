"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────────────────
 * MOBILE HEADERS — 3 variants
 *
 * Design these in Paper.design on a 390×844 artboard,
 * export as React/Tailwind, paste into your codebase.
 *
 * All three share the same token system (ink, surface, accent)
 * and respect the 44px minimum hit area for touch targets.
 * ───────────────────────────────────────────────────────── */

/* ─── Variant 1: Centered title with flanking icons ─── */

export function CenteredHeader({
  title,
  logo,
  leftAction,
  rightAction,
}: {
  title?: string;
  logo?: React.ReactNode;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}) {
  return (
    <div className="flex justify-center px-1.5 pt-3">
      <header className="flex h-10 w-full max-w-[378px] items-center justify-between rounded-xl px-1">
        <div className="flex items-center gap-0.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-control text-ink-3 transition-colors duration-150 hover:bg-hover hover:text-ink">
            {leftAction ?? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            )}
          </div>
          {logo && (
            <span className="flex size-8 shrink-0 items-center justify-center">
              {logo}
            </span>
          )}
        </div>
        {title && (
          <h1 className="min-w-0 flex-1 truncate text-center text-[15px] font-semibold text-ink">{title}</h1>
        )}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-control text-ink-3 transition-colors duration-150 hover:bg-hover hover:text-ink">
          {rightAction ?? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          )}
        </div>
      </header>
    </div>
  );
}

/* ─── Variant 2: Search-forward header ─── */

export function SearchHeader({
  placeholder = "Search...",
  onBack,
}: {
  placeholder?: string;
  onBack?: () => void;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-2 border-b border-line bg-page/80 px-3 backdrop-blur-sm">
      <button
        type="button"
        onClick={onBack}
        className="flex size-10 shrink-0 items-center justify-center rounded-control text-ink-3 transition-colors duration-150 hover:bg-hover hover:text-ink"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div
        className={`flex h-8 flex-1 items-center gap-2 rounded-full px-3 transition-shadow duration-150 ${
          focused
            ? "bg-surface shadow-[0_0_0_2px_var(--accent)]"
            : "bg-inset shadow-hairline"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-3"
        />
      </div>
    </header>
  );
}

/* ─── Variant 3: Tabbed segmented header ─── */

export function TabbedHeader({
  tabs = ["Inbox", "Unread", "Archived"],
  activeTab = 0,
  onTabChange,
  trailingAction,
}: {
  tabs?: string[];
  activeTab?: number;
  onTabChange?: (index: number) => void;
  trailingAction?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-page/80 backdrop-blur-sm">
      <div className="flex h-12 items-center px-3">
        <h1 className="mr-auto truncate text-[15px] font-semibold text-ink">Mail</h1>
        {trailingAction ?? (
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-control text-ink-3 transition-colors duration-150 hover:bg-hover hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        )}
      </div>
      <div className="flex gap-0.5 px-3 pb-2">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange?.(i)}
            className={`relative h-7 flex-1 rounded-full px-3 text-[12.5px] font-medium transition-colors duration-150 ${
              i === activeTab
                ? "bg-ink text-canvas"
                : "text-ink-2 hover:bg-hover"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </header>
  );
}
