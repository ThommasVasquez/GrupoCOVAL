"use client";

import { useMemo, useState } from "react";
import { PhoneCall, Layers } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type SlabMode = "unidireccional" | "reticular";

/**
 * Estimador orientativo de casetones EPS para losas aligeradas (IMT).
 */
export function EpsSlabEstimatorClient({
  phoneDisplay,
}: {
  phoneDisplay: string;
}) {
  const [areaM2, setAreaM2] = useState("120");
  const [heightCm, setHeightCm] = useState("25");
  const [system, setSystem] = useState<SlabMode>("reticular");

  const parsedArea = Math.max(0, Number.parseFloat(areaM2.replace(",", ".")) || 0);
  const parsedH = Math.max(0.05, (Number.parseFloat(heightCm.replace(",", ".")) || 25) / 100);

  // Factor orientativo de ocupación de EPS en losa aligerada (~58% reticular, ~64% unidireccional)
  const occupancyFactor = system === "reticular" ? 0.58 : 0.64;

  const estimatedVolumeM3 = useMemo(
    () => parsedArea * parsedH * occupancyFactor,
    [parsedArea, parsedH, occupancyFactor],
  );

  // Referencia modular estándar orientativa 0.60m x 0.60m (reticular) o 0.50m x 1.00m (unidireccional)
  const unitsEstimate = useMemo(() => {
    const unitFootprint = system === "reticular" ? 0.36 : 0.5;
    return Math.ceil((parsedArea * occupancyFactor) / unitFootprint);
  }, [parsedArea, occupancyFactor, system]);

  const waHref = buildWhatsAppUrl({
    pathname: "/icopores-modulado",
    customMessage: [
      "Hola Icopores Modulador Tequendama (IMT), comparto estimación preliminar de casetones EPS:",
      `• Sistema de forjado: ${system === "reticular" ? "Reticular" : "Unidireccional"}`,
      `• Área de losa: ${parsedArea.toFixed(1)} m²`,
      `• Altura de casetón: ${(parsedH * 100).toFixed(0)} cm`,
      `• Volumen orientativo EPS: ${estimatedVolumeM3.toFixed(2)} m³ (~${unitsEstimate} módulos estándar)`,
    ].join("\n"),
  });

  return (
    <div
      id="estimador-casetones"
      className="border border-[var(--border-strong)] bg-[var(--surface-page)] p-5 sm:p-6 space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Layers
            aria-hidden="true"
            className="h-4 w-4 text-[var(--brand-ink)]"
          />
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--text-primary)]">
            Estimador orientativo de casetones EPS
          </h3>
        </div>
        <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
          Cálculo preliminar de aligeramiento
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label
            htmlFor="eps-system-select"
            className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
          >
            Sistema de forjado
          </label>
          <select
            id="eps-system-select"
            value={system}
            onChange={(e) => setSystem(e.target.value as SlabMode)}
            className="h-11 w-full border border-[var(--border-strong)] bg-[var(--surface-card)] px-3 text-sm text-[var(--text-primary)]"
          >
            <option value="reticular">Forjado reticular (2 direcciones)</option>
            <option value="unidireccional">Forjado unidireccional</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="eps-area-input"
            className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
          >
            Área de placa (m²)
          </label>
          <input
            id="eps-area-input"
            type="number"
            min="1"
            step="any"
            value={areaM2}
            onChange={(e) => setAreaM2(e.target.value)}
            className="h-11 w-full border border-[var(--border-strong)] bg-[var(--surface-card)] px-3 font-mono text-sm text-[var(--text-primary)]"
          />
        </div>

        <div>
          <label
            htmlFor="eps-height-input"
            className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
          >
            Espesor casetón (cm)
          </label>
          <input
            id="eps-height-input"
            type="number"
            min="5"
            step="1"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            className="h-11 w-full border border-[var(--border-strong)] bg-[var(--surface-card)] px-3 font-mono text-sm text-[var(--text-primary)]"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-4">
        <div className="flex flex-wrap items-baseline gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">
              Volumen EPS estimado
            </p>
            <p className="font-mono text-xl font-bold text-[var(--brand-ink)]">
              {estimatedVolumeM3.toFixed(2)} m³
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">
              Módulos estándar aprox.
            </p>
            <p className="font-mono text-xl font-bold text-[var(--text-primary)]">
              {unitsEstimate} uds
            </p>
          </div>
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 bg-[var(--brand-primary)] px-5 text-xs font-semibold text-[var(--brand-on-primary)] hover:bg-[var(--brand-primary-hover)] transition-colors"
        >
          <PhoneCall aria-hidden="true" className="h-3.5 w-3.5" />
          <span>Cotizar EPS ({phoneDisplay})</span>
        </a>
      </div>
    </div>
  );
}
