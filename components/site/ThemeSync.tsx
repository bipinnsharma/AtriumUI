"use client";

import { useEffect } from "react";

/* React 19 reconciles <html>'s dataset during hydration, wiping the value
 * the pre-paint head script set. This re-applies the stored theme the moment
 * hydration finishes, on every page. */
export function ThemeSync() {
  useEffect(() => {
    try {
      const theme = localStorage.getItem("bui-theme");
      if (theme && ["light", "dark", "warm", "frost"].includes(theme)) {
        document.documentElement.dataset.mode = theme;
      } else {
        document.documentElement.dataset.mode = "light";
      }
    } catch {
      document.documentElement.dataset.mode = "light";
    }
  }, []);

  return null;
}
