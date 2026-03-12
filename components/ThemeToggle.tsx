import { memo, useCallback, useEffect, useState } from "react";
import styles from "../styles/calculator.module.css";

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sip-theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.setAttribute(
        "data-theme",
        next ? "dark" : "light"
      );
      localStorage.setItem("sip-theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  return (
    <button
      type="button"
      className={styles.themeToggle}
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
}

export default memo(ThemeToggle);
