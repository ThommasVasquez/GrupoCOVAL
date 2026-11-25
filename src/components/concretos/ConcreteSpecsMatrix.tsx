"use client";

import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import type { ConcreteMix, TechnicalSheet } from "@/lib/content/schemas";
import { trackEvent } from "@/lib/analytics";
import { OpenCalculatorButton } from "@/components/calculators/OpenCalculatorButton";

interface ConcreteSpecsMatrixProps {
  mixes: ConcreteMix[];
  sheets: TechnicalSheet[];
}

/**
 * Matriz ordenada de parámetros técnicos y fichas PDF de Coval Concretos:
 * Agrupa cada mezcla con sus especificaciones clave-valor y su ficha oficial descargable
 * en 4 columnas arquitectónicas equilibradas para lectura inmediata sin saturación horizontal.
 */
export function ConcreteSpecsMatrix({
  mixes,
  sheets,
}: ConcreteSpecsMatrixProps) {
  return (
    <div
      data-arch="stagger"
      className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4 border-t border-[var(--border-ink)] pt-6"
    >
      {mixes.map((mix, idx) => {
        const sheet = sheets.find((s) => s.fileUrl === mix.pdfUrl);
        const rows = [
          { label: "Resistencias", value: mix.strengths, highlight: true },
          { label: "Edad de diseño", value: mix.specAge },
          { label: "Grava máx.", value: mix.maxAggregate },
          { label: "Manejabilidad", value: mix.workability },
          { label: "Asentamiento / Flujo", value: mix.slump },
          { label: "Fraguado", value: mix.settingTime },
          { label: "Densidad / Aire", value: mix.densityOrAir },
        ];

        return (
          <article
            key={mix.id}
            className="flex flex-col justify-between border-b border-[var(--border-subtle)] pb-5"
          >
            <div>
              {/* Encabezado numerado */}
              <div className="border-b border-[var(--border-strong)] pb-4">
                <span className="font-mono text-xs text-[var(--brand-primary)] font-semibold">
                  0{idx + 1} · FICHA TÉCNICA
                </span>
                <h3 className="mt-1.5 text-xl font-bold tracking-tight text-[var(--text-primary)]">
                  {mix.name}
                </h3>
              </div>

              {/* Lista ordenada de especificaciones clave-valor */}
              <dl className="divide-y divide-[var(--border-subtle)]">
                {rows.map((spec) => (
                  <div key={spec.label} className="py-2.5">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
                      {spec.label}
                    </dt>
                    <dd
                      className={
                        spec.highlight
                          ? "mt-0.5 font-mono text-xs font-semibold text-[var(--text-primary)]"
                          : "mt-0.5 text-xs sm:text-sm text-[var(--text-secondary)]"
                      }
                    >
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Descarga oficial + Cotizador */}
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--border-strong)] pt-4">
              <a
                href={mix.pdfUrl}
                download
                onClick={() =>
                  trackEvent("pdf_sheet_download", {
                    sheet_id: sheet?.id ?? mix.id,
                    company: "concretos",
                  })
                }
                className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-colors"
              >
                <ArrowDownToLine aria-hidden="true" className="h-3.5 w-3.5" />
                <span>
                  PDF {sheet?.fileSizeLabel ? `(${sheet.fileSizeLabel})` : ""}
                </span>
              </a>

              <OpenCalculatorButton
                lineId={mix.id}
                className="inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-[var(--brand-primary)] underline underline-offset-4 hover:opacity-80 cursor-pointer"
              >
                <span>Calcular m³</span>
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </OpenCalculatorButton>
            </div>
          </article>
        );
      })}
    </div>
  );
}
