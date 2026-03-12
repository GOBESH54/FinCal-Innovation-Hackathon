import { memo, useCallback, useEffect, useState } from "react";

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sip-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = saved ? saved === "dark" : prefersDark;
    setDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("sip-theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  return (
    <button
      type="button"
      className="fixed right-3 top-3 z-40 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-700 shadow-sm backdrop-blur transition-colors hover:border-brandBlue hover:text-brandBlue focus:outline-none focus:ring-2 focus:ring-brandBlue/40 sm:right-4 sm:top-4 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200 dark:hover:border-brandRed dark:hover:text-brandRed"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
}

export default memo(ThemeToggle);
