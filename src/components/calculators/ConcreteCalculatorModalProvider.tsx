"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { AdaptiveLogo } from "@/components/ui/AdaptiveLogo";
import { ConcreteCalculatorClient } from "@/components/calculators/ConcreteCalculatorClient";

interface ConcreteCalculatorModalContextValue {
  isOpen: boolean;
  openCalculator: (lineId?: string) => void;
  closeCalculator: () => void;
}

const ConcreteCalculatorModalContext =
  createContext<ConcreteCalculatorModalContextValue | null>(null);

export function useConcreteCalculatorModal(): ConcreteCalculatorModalContextValue {
  const ctx = useContext(ConcreteCalculatorModalContext);
  if (!ctx) {
    throw new Error(
      "useConcreteCalculatorModal debe usarse dentro de ConcreteCalculatorModalProvider",
    );
  }
  return ctx;
}

/**
 * Proveedor global de la calculadora volumétrica de concreto (m³) en formato modal.
 * Permite abrir el cotizador con la línea de mezcla preseleccionada desde cualquier botón
 * sin abandonar la página ni perder el contexto de lectura.
 */
export function ConcreteCalculatorModalProvider({
  phoneDisplay,
  children,
}: {
  phoneDisplay: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLineId, setActiveLineId] = useState<string | undefined>(undefined);
  const [sessionKey, setSessionKey] = useState(0);

  const openCalculator = useCallback((lineId?: string) => {
    setActiveLineId(lineId);
    setSessionKey((prev) => prev + 1);
    setIsOpen(true);
  }, []);

  const closeCalculator = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Soporte para enlaces heredados ?cotizador=1&linea=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("cotizador") === "1") {
      const linea = params.get("linea") ?? undefined;
      openCalculator(linea);
      const url = new URL(window.location.href);
      url.searchParams.delete("cotizador");
      url.searchParams.delete("linea");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }
  }, [openCalculator]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <ConcreteCalculatorModalContext.Provider
      value={{ isOpen, openCalculator, closeCalculator }}
    >
      {children}

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="concrete-calculator-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-6 backdrop-blur-md"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeCalculator();
            }
          }}
        >
          <div className="relative max-h-[92dvh] w-full max-w-6xl overflow-y-auto border border-[var(--border-strong)] bg-[var(--surface-page)] shadow-2xl">
            <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] bg-[var(--surface-page)]/95 px-5 py-4 backdrop-blur-md sm:px-7">
              <div className="flex flex-wrap items-center gap-4">
                <AdaptiveLogo
                  darkSrc="/images/brand/Logo_Coval.webp"
                  lightSrc="/images/brand/Logo_Coval-light.webp"
                  alt="Logo Coval Concretos"
                  priority={false}
                  className="h-7 w-auto object-contain"
                />
                <div className="hidden h-6 w-px bg-[var(--border-subtle)] sm:block" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--brand-primary)] font-semibold">
                    Planta Km 5 vía Bogotá–Girardot · 45 m³/h
                  </p>
                  <h2
                    id="concrete-calculator-modal-title"
                    className="text-base sm:text-lg font-bold tracking-tight text-[var(--text-primary)]"
                  >
                    Calculadora volumétrica de concreto (m³)
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={closeCalculator}
                aria-label="Cerrar calculadora volumétrica"
                className="inline-flex h-10 items-center gap-1.5 border border-[var(--border-strong)] px-3.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors cursor-pointer"
              >
                <X aria-hidden="true" className="h-4 w-4" />
                <span>Cerrar</span>
              </button>
            </div>

            <div className="p-5 sm:p-7">
              <ConcreteCalculatorClient
                key={`${sessionKey}-${activeLineId ?? "default"}`}
                initialLineId={activeLineId}
                phoneDisplay={phoneDisplay}
                onRequestClose={closeCalculator}
              />
            </div>
          </div>
        </div>
      )}
    </ConcreteCalculatorModalContext.Provider>
  );
}
