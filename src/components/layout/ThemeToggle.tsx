"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const THEME_STORAGE_KEY = "coval_theme_v1";
type ThemeMode = "dark" | "light";

/**
 * Interruptor tipo switch (Luna / Sol) para alternar entre modo oscuro y claro.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") {
      setTheme(current);
    }
  }, []);

  const isLight = mounted && theme === "light";

  const toggleTheme = () => {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Ignorar si localStorage está restringido
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      onClick={toggleTheme}
      aria-label={isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      title={isLight ? "Modo claro activo · Cambiar a oscuro" : "Modo oscuro activo · Cambiar a claro"}
      className="relative inline-flex h-7 w-[52px] shrink-0 items-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-card)] p-0.5 transition-colors hover:border-[var(--border-ink)] cursor-pointer"
    >
      <span className="pointer-events-none flex w-full items-center justify-between px-1.5 text-[var(--text-tertiary)]">
        <Moon aria-hidden="true" className="h-3 w-3" />
        <Sun aria-hidden="true" className="h-3 w-3" />
      </span>

      <span
        aria-hidden="true"
        className={`absolute left-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[var(--surface-button-dark)] text-[var(--surface-button-dark-text)] shadow-sm transition-transform duration-200 ${
          isLight ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {isLight ? (
          <Sun className="h-3.5 w-3.5" />
        ) : (
          <Moon className="h-3.5 w-3.5" />
        )}
      </span>
    </button>
  );
}
