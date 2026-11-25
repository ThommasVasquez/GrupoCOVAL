"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { resolveBrandFromPathname } from "@/lib/content/repository";
import {
  DEFAULT_LOCALE_OPTION,
  LOCALE_OPTIONS,
  useLanguage,
  type LocaleCode,
} from "@/components/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

/**
 * Icono SVG de carácter chino ("文") de trazo nítido, dimensionado para
 * acompañar el selector de idioma con el mismo formato que ThemeToggle.
 */
function ChineseCharIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3.2v2.4" />
      <path d="M4.2 6.8h15.6" />
      <path d="M16.2 6.8c-1.1 5.6-4.4 9.7-11.2 12.6" />
      <path d="M7.8 9.2c2.1 4.2 5.6 7.7 11.4 10.2" />
    </svg>
  );
}

/**
 * Selector global de idioma con el mismo tamaño del switch Tema (h-7 w-[52px]),
 * icono de carácter chino ("文") y menú desplegable en portal para Español,
 * Português, English, Français, Italiano, 中文 y 日本語.
 */
export function LanguageSwitcher() {
  const pathname = usePathname() ?? "/";
  const activeBrand = resolveBrandFromPathname(pathname);
  const { locale, isLoading, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; right: number }>({
    top: 48,
    right: 16,
  });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentOption =
    LOCALE_OPTIONS.find((item) => item.code === locale) ?? DEFAULT_LOCALE_OPTION;

  const updatePosition = useCallback(() => {
    if (!buttonRef.current || typeof window === "undefined") return;
    const rect = buttonRef.current.getBoundingClientRect();
    setCoords({
      top: Math.round(rect.bottom + 8),
      right: Math.max(12, Math.round(window.innerWidth - rect.right)),
    });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (buttonRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [open, updatePosition]);

  const handleToggle = () => {
    if (!open) {
      updatePosition();
    }
    setOpen((prev) => !prev);
  };

  const handleSelect = (code: LocaleCode) => {
    setLocale(code);
    setOpen(false);
  };

  return (
    <div data-no-translate="true" className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Idioma: ${currentOption.nativeName} · Cambiar idioma`}
        title={`Idioma actual: ${currentOption.nativeName}`}
        className={cn(
          "relative inline-flex h-7 w-[52px] shrink-0 items-center justify-center gap-1 rounded-full border border-[var(--border-strong)] bg-[var(--surface-card)] px-1.5 text-[var(--text-primary)] transition-colors hover:border-[var(--border-ink)] cursor-pointer",
          open && "border-[var(--brand-primary)]",
        )}
      >
        <ChineseCharIcon className="h-3.5 w-3.5 shrink-0" />
        <span className="font-mono text-[10px] font-semibold leading-none tracking-tight">
          {currentOption.badge}
        </span>
        {isLoading && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-[var(--brand-primary)]"
          />
        )}
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            ref={menuRef}
            data-brand={activeBrand}
            data-no-translate="true"
            role="listbox"
            aria-label="Seleccionar idioma de toda la web"
            style={{ top: `${coords.top}px`, right: `${coords.right}px` }}
            className="fixed z-[9999] w-48 overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-page)] p-1.5 shadow-2xl"
          >
            <p className="px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
              Idioma / Language
            </p>
            <div className="mt-0.5 space-y-0.5">
              {LOCALE_OPTIONS.map((option) => {
                const selected = option.code === locale;
                return (
                  <button
                    key={option.code}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => handleSelect(option.code)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition-colors cursor-pointer",
                      selected
                        ? "bg-[var(--brand-primary)] font-semibold text-[var(--brand-on-primary)]"
                        : "text-[var(--text-primary)] hover:bg-[var(--surface-muted)]",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex h-5 w-6 items-center justify-center rounded-md font-mono text-[10px] font-semibold",
                          selected
                            ? "bg-black/15 text-current"
                            : "bg-[var(--surface-muted)] text-[var(--text-secondary)]",
                        )}
                      >
                        {option.badge}
                      </span>
                      <span>{option.nativeName}</span>
                    </span>
                    {selected && <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
