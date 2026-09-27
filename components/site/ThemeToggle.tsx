"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "warm" | "frost";

const THEMES: { key: Theme; label: string; icon: React.ReactNode }[] = [
  {
    key: "light",
    label: "Light",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    ),
  },
  {
    key: "dark",
    label: "Dark",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    ),
  },
  {
    key: "warm",
    label: "Warm",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
  },
  {
    key: "frost",
    label: "Frost",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="2" x2="22" y1="12" y2="12" />
        <line x1="12" x2="12" y1="2" y2="22" />
        <line x1="4.93" x2="19.07" y1="4.93" y2="19.07" />
        <line x1="19.07" x2="4.93" y1="4.93" y2="19.07" />
      </svg>
    ),
  },
];

/** Theme toggle segmented pill from the refs. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bui-theme") as Theme | null;
      if (stored && THEMES.some((t) => t.key === stored)) {
        setTheme(stored);
      }
    } catch {}
  }, []);

  function apply(next: Theme) {
    if (next === theme) return;
    setTheme(next);
    const root = document.documentElement;
    root.classList.add("theme-switching");
    root.dataset.mode = next;
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
    try {
      localStorage.setItem("bui-theme", next);
    } catch {}
  }

  return (
    <div className="relative inline-grid h-9 grid-cols-4 items-center rounded-full bg-field p-0.5">
      <span
        aria-hidden
        className="absolute inset-y-0.5 left-0.5 w-8 rounded-full bg-surface shadow-btn
          transition-transform duration-200"
        style={{
          transform: `translateX(${THEMES.findIndex((t) => t.key === theme) * 32}px)`,
          transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      />
      {THEMES.map((t) => (
        <button
          key={t.key}
          aria-label={`${t.label} mode`}
          onClick={() => apply(t.key)}
          className={`relative z-10 flex size-8 items-center justify-center rounded-full
            transition-colors duration-150 ${theme === t.key ? "text-ink" : "text-ink-3 hover:text-ink-2"}`}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}
