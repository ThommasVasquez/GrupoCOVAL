"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Check,
  ChevronDown,
  Copy,
  Download,
  PhoneCall,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  COVAL_MIX_OPTIONS,
  PUMPING_MODES,
  SHAPE_DEFINITIONS,
  computeShapeVolume,
  createDefaultDims,
  roundUpHalfCubicMeter,
  type ConcreteShapeId,
  type ConcreteShapeItem,
  type LengthUnit,
} from "@/lib/calculators/concrete";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import {
  ShapeIconSvg,
  ShapeSchematicDiagram,
} from "@/components/calculators/ShapeDiagramSvg";

gsap.registerPlugin(useGSAP);

interface ConcreteCalculatorClientProps {
  initialLineId?: string;
  phoneDisplay: string;
  onRequestClose?: () => void;
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function getShapeLetter(idx: number): string {
  return LETTERS[idx] ?? String(idx + 1);
}

export function ConcreteCalculatorClient({
  initialLineId,
  phoneDisplay,
  onRequestClose,
}: ConcreteCalculatorClientProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const initialMix =
    COVAL_MIX_OPTIONS.find((m) => m.id === initialLineId) ??
    COVAL_MIX_OPTIONS[0]!;

  const [items, setItems] = useState<ConcreteShapeItem[]>([
    {
      id: "forma-1",
      label: "Forma A",
      shape: "cubo-losa",
      quantity: 1,
      dims: createDefaultDims("cubo-losa"),
    },
  ]);
  const [expandedId, setExpandedId] = useState<string>("forma-1");
  const [reservePctInput, setReservePctInput] = useState<string>("5");
  const [selectedMixId, setSelectedMixId] = useState<string>(initialMix.id);
  const [selectedStrength, setSelectedStrength] = useState<string>(
    initialMix.strengthChoices[1] ?? initialMix.strengthChoices[0]!,
  );
  const [selectedPump, setSelectedPump] = useState<string>(PUMPING_MODES[0].id);
  const [copied, setCopied] = useState(false);

  const activeMix =
    COVAL_MIX_OPTIONS.find((m) => m.id === selectedMixId) ??
    COVAL_MIX_OPTIONS[0]!;

  const computedItems = useMemo(
    () =>
      items.map((item) => ({
        item,
        def:
          SHAPE_DEFINITIONS.find((s) => s.id === item.shape) ??
          SHAPE_DEFINITIONS[0]!,
        result: computeShapeVolume(item),
      })),
    [items],
  );

  const reservePct = useMemo(() => {
    const val = Number.parseFloat(reservePctInput.replace(",", "."));
    return Number.isFinite(val) && val >= 0 ? Math.min(val, 50) : 0;
  }, [reservePctInput]);

  const rawSubtotalM3 = computedItems.reduce(
    (sum, row) => sum + row.result.rawVolumeM3,
    0,
  );
  const roundedSubtotalM3 = computedItems.reduce(
    (sum, row) => sum + row.result.roundedVolumeM3,
    0,
  );

  const reserveRawM3 = (rawSubtotalM3 * reservePct) / 100;
  const rawTotalWithReserve = rawSubtotalM3 + reserveRawM3;

  const reserveDispatchM3 = (roundedSubtotalM3 * reservePct) / 100;
  const totalDispatchM3 = roundUpHalfCubicMeter(
    roundedSubtotalM3 + reserveDispatchM3,
  );

  // Anima transición suave al cambiar forma activa o añadir elemento
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-calc-panel-active]",
          { opacity: 0.45, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        );
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [expandedId, items.length] },
  );

  const handleSelectMix = (mixId: string) => {
    setSelectedMixId(mixId);
    const nextMix =
      COVAL_MIX_OPTIONS.find((m) => m.id === mixId) ?? COVAL_MIX_OPTIONS[0]!;
    setSelectedStrength(
      nextMix.strengthChoices[1] ?? nextMix.strengthChoices[0]!,
    );
  };

  const handleSelectShape = (itemId: string, nextShape: ConcreteShapeId) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? {
              ...it,
              shape: nextShape,
              dims: createDefaultDims(nextShape),
            }
          : it,
      ),
    );
  };

  const handleDimChange = (
    itemId: string,
    fieldKey: string,
    amount: string,
  ) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? {
              ...it,
              dims: {
                ...it.dims,
                [fieldKey]: {
                  unit: it.dims[fieldKey]?.unit ?? "m",
                  amount,
                },
              },
            }
          : it,
      ),
    );
  };

  const handleUnitChange = (
    itemId: string,
    fieldKey: string,
    unit: LengthUnit,
  ) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? {
              ...it,
              dims: {
                ...it.dims,
                [fieldKey]: {
                  amount: it.dims[fieldKey]?.amount ?? "",
                  unit,
                },
              },
            }
          : it,
      ),
    );
  };

  const handleQtyChange = (itemId: string, qtyRaw: string) => {
    const qty = Math.max(1, Number.parseInt(qtyRaw || "1", 10) || 1);
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, quantity: qty } : it)),
    );
  };

  const handleAddShape = () => {
    const nextIdx = items.length;
    const nextId = `forma-${Date.now()}`;
    const newItem: ConcreteShapeItem = {
      id: nextId,
      label: `Forma ${getShapeLetter(nextIdx)}`,
      shape: "cubo-losa",
      quantity: 1,
      dims: createDefaultDims("cubo-losa"),
    };
    setItems((prev) => [...prev, newItem]);
    setExpandedId(nextId);
  };

  const handleRemoveShape = (itemId: string) => {
    if (items.length <= 1) return;
    setItems((prev) => {
      const filtered = prev
        .filter((it) => it.id !== itemId)
        .map((it, idx) => ({ ...it, label: `Forma ${getShapeLetter(idx)}` }));
      if (expandedId === itemId) {
        setExpandedId(filtered[filtered.length - 1]!.id);
      }
      return filtered;
    });
  };

  const handleResetAll = () => {
    const freshId = `forma-${Date.now()}`;
    setItems([
      {
        id: freshId,
        label: "Forma A",
        shape: "cubo-losa",
        quantity: 1,
        dims: createDefaultDims("cubo-losa"),
      },
    ]);
    setExpandedId(freshId);
    setReservePctInput("5");
  };

  const pumpLabel =
    PUMPING_MODES.find((p) => p.id === selectedPump)?.label ?? selectedPump;

  const summaryMessage = useMemo(() => {
    const lines = computedItems
      .filter((row) => row.result.rawVolumeM3 > 0)
      .map(
        (row) =>
          `- ${row.item.label} (${row.def.name}${row.item.quantity > 1 ? ` × ${row.item.quantity}` : ""}): ${row.result.roundedVolumeM3.toFixed(1)} m³ (exacto ${row.result.rawVolumeM3.toFixed(2)} m³)`,
      );

    return [
      "Hola Coval Concretos, comparto cálculo preliminar de concreto premezclado:",
      `• Línea: ${activeMix.name}`,
      `• Resistencia: ${selectedStrength}`,
      `• Colocación: ${pumpLabel}`,
      ...(lines.length > 0 ? lines : ["- Elementos aún sin dimensiones completas"]),
      `• Reserva / desperdicio: ${reservePct}% (+${reserveRawM3.toFixed(2)} m³)`,
      `• Volumen geométrico total: ${rawTotalWithReserve.toFixed(2)} m³`,
      `• Volumen sugerido de despacho (múltiplo 0.5 m³): ${totalDispatchM3.toFixed(1)} m³`,
    ].join("\n");
  }, [
    computedItems,
    activeMix.name,
    selectedStrength,
    pumpLabel,
    reservePct,
    reserveRawM3,
    rawTotalWithReserve,
    totalDispatchM3,
  ]);

  const whatsappHref = buildWhatsAppUrl({
    pathname: "/cotizador-concreto",
    customMessage: summaryMessage,
  });

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start"
    >
      {/* COLUMNA IZQUIERDA (7 cols): Constructor multi-forma + mezcla Coval Concretos */}
      <div className="lg:col-span-7 space-y-6">
        {/* Paso 1: Especificación de mezcla Coval Concretos */}
        <div className="border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
              1. Especificación de concreto Coval
            </h2>
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              {activeMix.unitNote}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="mix-line-select"
                className="block font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-1.5"
              >
                Línea de concreto
              </label>
              <select
                id="mix-line-select"
                value={selectedMixId}
                onChange={(e) => handleSelectMix(e.target.value)}
                className="h-11 w-full border border-[var(--border-strong)] bg-[var(--surface-page)] px-3 text-sm text-[var(--text-primary)]"
              >
                {COVAL_MIX_OPTIONS.map((mix) => (
                  <option key={mix.id} value={mix.id}>
                    {mix.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="mix-strength-select"
                className="block font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-1.5"
              >
                Resistencia
              </label>
              <select
                id="mix-strength-select"
                value={selectedStrength}
                onChange={(e) => setSelectedStrength(e.target.value)}
                className="h-11 w-full border border-[var(--border-strong)] bg-[var(--surface-page)] px-3 text-sm text-[var(--text-primary)]"
              >
                {activeMix.strengthChoices.map((str) => (
                  <option key={str} value={str}>
                    {str}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="pump-mode-select"
                className="block font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-1.5"
              >
                Colocación
              </label>
              <select
                id="pump-mode-select"
                value={selectedPump}
                onChange={(e) => setSelectedPump(e.target.value)}
                className="h-11 w-full border border-[var(--border-strong)] bg-[var(--surface-page)] px-3 text-sm text-[var(--text-primary)]"
              >
                {PUMPING_MODES.map((mode) => (
                  <option key={mode.id} value={mode.id}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Paso 2: Acordeón de Formas (Forma A, Forma B, ...) */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
              2. Calcula tu volumen por elementos estructurales
            </h2>
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
              <span>Reiniciar</span>
            </button>
          </div>

          {computedItems.map(({ item, def, result }) => {
            const isOpen = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="border border-[var(--border-subtle)] bg-[var(--surface-card)]"
              >
                {/* Cabecera colapsable de cada forma */}
                <div className="flex items-center justify-between gap-3 px-5 py-4">
                  <button
                    type="button"
                    onClick={() => setExpandedId(item.id)}
                    aria-expanded={isOpen}
                    className="flex flex-1 items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-[var(--brand-primary)]">
                        {item.label}
                      </span>
                      <span className="font-bold text-[var(--text-primary)]">
                        {def.name}
                      </span>
                      {item.quantity > 1 && (
                        <span className="font-mono text-xs text-[var(--text-secondary)]">
                          × {item.quantity}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-[var(--text-primary)] tabular-nums">
                        {result.roundedVolumeM3.toFixed(1)} m³
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          "h-4 w-4 text-[var(--text-secondary)] transition-transform",
                          isOpen && "rotate-180",
                        )}
                      />
                    </div>
                  </button>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveShape(item.id)}
                      aria-label={`Eliminar ${item.label}`}
                      className="inline-flex h-9 w-9 items-center justify-center border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] cursor-pointer"
                    >
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {isOpen && (
                  <div
                    data-calc-panel-active
                    className="border-t border-[var(--border-subtle)] p-5 sm:p-6 space-y-6"
                  >
                    {/* Selector visual de las 6 formas */}
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-3">
                        Forma geométrica
                      </p>
                      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                        {SHAPE_DEFINITIONS.map((shapeDef) => {
                          const active = item.shape === shapeDef.id;
                          return (
                            <button
                              key={shapeDef.id}
                              type="button"
                              onClick={() =>
                                handleSelectShape(item.id, shapeDef.id)
                              }
                              aria-pressed={active}
                              className={cn(
                                "flex flex-col items-center justify-center gap-2 border p-3 text-center transition-colors cursor-pointer min-h-22",
                                active
                                  ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]"
                                  : "border-[var(--border-subtle)] bg-[var(--surface-page)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]",
                              )}
                            >
                              <ShapeIconSvg shape={shapeDef.id} />
                              <span className="text-[11px] font-semibold leading-tight">
                                {shapeDef.shortName}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Esquema acotado + Entradas dimensionales con selector m / cm / mm */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-12 items-start">
                      <div className="md:col-span-5 space-y-2.5">
                        <ShapeSchematicDiagram shape={item.shape} />
                        <p className="font-mono text-[11px] text-[var(--text-secondary)]">
                          {def.formulaLabel}
                        </p>
                        <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                          {def.helperNote}
                        </p>
                      </div>

                      <div className="md:col-span-7 space-y-3.5">
                        {def.fields.map((field) => {
                          const dimVal = item.dims[field.key] ?? {
                            amount: "",
                            unit: field.defaultUnit,
                          };
                          return (
                            <div key={field.key}>
                              <label
                                htmlFor={`${item.id}-${field.key}`}
                                className="flex items-center justify-between text-xs font-medium text-[var(--text-primary)] mb-1.5"
                              >
                                <span>{field.label}</span>
                                <span className="font-mono text-[11px] text-[var(--blueprint)]">
                                  [{field.symbol}]
                                </span>
                              </label>
                              <div className="flex">
                                <input
                                  id={`${item.id}-${field.key}`}
                                  type="number"
                                  min="0"
                                  step="any"
                                  inputMode="decimal"
                                  placeholder={field.placeholder}
                                  value={dimVal.amount}
                                  onChange={(e) =>
                                    handleDimChange(
                                      item.id,
                                      field.key,
                                      e.target.value,
                                    )
                                  }
                                  className="h-11 w-full border border-r-0 border-[var(--border-strong)] bg-[var(--surface-page)] px-3 font-mono text-sm text-[var(--text-primary)] tabular-nums"
                                />
                                <select
                                  aria-label={`Unidad para ${field.label}`}
                                  value={dimVal.unit}
                                  onChange={(e) =>
                                    handleUnitChange(
                                      item.id,
                                      field.key,
                                      e.target.value as LengthUnit,
                                    )
                                  }
                                  className="h-11 w-20 shrink-0 border border-[var(--border-strong)] bg-[var(--surface-muted)] px-2 font-mono text-xs font-semibold text-[var(--text-primary)]"
                                >
                                  <option value="m">m</option>
                                  <option value="cm">cm</option>
                                  <option value="mm">mm</option>
                                </select>
                              </div>
                            </div>
                          );
                        })}

                        {item.shape === "escaleras" && (
                          <div>
                            <label
                              htmlFor={`${item.id}-steps`}
                              className="flex items-center justify-between text-xs font-medium text-[var(--text-primary)] mb-1.5"
                            >
                              <span>Número de escalones</span>
                              <span className="font-mono text-[11px] text-[var(--blueprint)]">
                                [N]
                              </span>
                            </label>
                            <input
                              id={`${item.id}-steps`}
                              type="number"
                              min="1"
                              step="1"
                              inputMode="numeric"
                              value={item.dims.steps?.amount ?? "10"}
                              onChange={(e) =>
                                handleDimChange(item.id, "steps", e.target.value)
                              }
                              className="h-11 w-full border border-[var(--border-strong)] bg-[var(--surface-page)] px-3 font-mono text-sm text-[var(--text-primary)] tabular-nums"
                            />
                          </div>
                        )}

                        {/* Multiplicador de elementos iguales */}
                        <div className="pt-1">
                          <label
                            htmlFor={`${item.id}-qty`}
                            className="flex items-center justify-between text-xs font-medium text-[var(--text-primary)] mb-1.5"
                          >
                            <span>Cantidad de elementos idénticos</span>
                            <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                              und.
                            </span>
                          </label>
                          <input
                            id={`${item.id}-qty`}
                            type="number"
                            min="1"
                            step="1"
                            inputMode="numeric"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQtyChange(item.id, e.target.value)
                            }
                            className="h-11 w-full border border-[var(--border-strong)] bg-[var(--surface-page)] px-3 font-mono text-sm text-[var(--text-primary)] tabular-nums"
                          />
                        </div>

                        {result.validationError && (
                          <p
                            role="alert"
                            className="border-l-2 border-[var(--brand-primary)] pl-3 text-xs font-medium text-[var(--brand-primary)]"
                          >
                            {result.validationError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={handleAddShape}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 border border-dashed border-[var(--border-strong)] bg-[var(--surface-page)] px-5 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors cursor-pointer"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            <span>Agregar otra forma (Forma {getShapeLetter(items.length)})</span>
          </button>
        </div>
      </div>

      {/* COLUMNA DERECHA (5 cols): Detalle del pedido (sticky en escritorio) */}
      <aside className="lg:col-span-5 lg:sticky lg:top-22 border border-[var(--border-strong)] bg-[var(--surface-card)] p-6 sm:p-7 space-y-6">
        <div className="flex items-baseline justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              Detalle del cálculo
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Resumen de volumen
            </h2>
          </div>
          <span className="font-mono text-xs text-[var(--brand-primary)]">
            m³
          </span>
        </div>

        {/* Lista de formas ingresadas */}
        <ul className="divide-y divide-[var(--border-subtle)] border-b border-[var(--border-subtle)]">
          {computedItems.map(({ item, def, result }) => (
            <li
              key={item.id}
              className="py-3 flex items-baseline justify-between gap-4 text-sm"
            >
              <div>
                <p className="font-semibold text-[var(--text-primary)]">
                  {item.label} · {def.name}
                </p>
                <p className="font-mono text-[11px] text-[var(--text-secondary)]">
                  Geométrico: {result.rawVolumeM3.toFixed(2)} m³
                  {item.quantity > 1 ? ` · ${item.quantity} und.` : ""}
                </p>
              </div>
              <span className="font-mono text-base font-bold text-[var(--text-primary)] tabular-nums">
                {result.roundedVolumeM3.toFixed(1)} m³
              </span>
            </li>
          ))}
        </ul>

        {/* Volumen de reserva / desperdicio editable (%) */}
        <div className="space-y-3 border-b border-[var(--border-subtle)] pb-5">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="reserve-pct-input"
              className="text-sm font-medium text-[var(--text-primary)]"
            >
              Volumen de reserva (%)
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-[var(--border-strong)] bg-[var(--surface-page)]">
                <input
                  id="reserve-pct-input"
                  type="number"
                  min="0"
                  max="50"
                  step="1"
                  inputMode="numeric"
                  value={reservePctInput}
                  onChange={(e) => setReservePctInput(e.target.value)}
                  className="h-9 w-16 bg-transparent px-2.5 text-right font-mono text-sm font-semibold text-[var(--text-primary)] tabular-nums"
                />
                <span className="pr-2.5 font-mono text-xs text-[var(--text-secondary)]">
                  %
                </span>
              </div>
              <span className="font-mono text-sm text-[var(--text-primary)] tabular-nums w-20 text-right">
                + {reserveRawM3.toFixed(2)} m³
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {["0", "5", "8", "10"].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setReservePctInput(preset)}
                className={cn(
                  "px-2.5 py-1 font-mono text-xs border transition-colors cursor-pointer",
                  reservePctInput === preset
                    ? "border-[var(--brand-primary)] text-[var(--brand-primary)] font-semibold"
                    : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                )}
              >
                {preset}%
              </button>
            ))}
          </div>
        </div>

        {/* Totales */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between text-sm text-[var(--text-secondary)]">
            <span>Total geométrico (incl. reserva)</span>
            <span className="font-mono text-base text-[var(--text-primary)] tabular-nums">
              {rawTotalWithReserve.toFixed(2)} m³
            </span>
          </div>

          <div className="flex items-baseline justify-between border-t border-[var(--border-strong)] pt-4">
            <div>
              <p className="text-base font-bold text-[var(--text-primary)]">
                Volumen sugerido de pedido
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Redondeado hacia arriba en múltiplos de 0.5 m³
              </p>
            </div>
            <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-[var(--brand-primary)] tabular-nums">
              {totalDispatchM3.toFixed(1)} m³
            </span>
          </div>
        </div>

        {/* Contexto técnico de mezcla y planta */}
        <div className="border-t border-[var(--border-subtle)] pt-4 text-xs leading-relaxed text-[var(--text-secondary)] space-y-1">
          <p className="font-medium text-[var(--text-primary)]">
            {activeMix.name} · {selectedStrength}
          </p>
          <p>{pumpLabel}</p>
          <p>
            Planta Km 5 vía Bogotá–Girardot (45 m³/h · 7 mixers). Resultado
            orientativo; valide cantidades finales en obra o planos
            estructurales.
          </p>
        </div>

        {/* Acciones directas */}
        <div className="space-y-3 pt-1">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 bg-[var(--brand-primary)] px-5 text-sm font-semibold text-[var(--brand-on-primary)] hover:bg-[var(--brand-primary-hover)] transition-colors"
          >
            <PhoneCall aria-hidden="true" className="h-4 w-4" />
            <span>Cotizar {totalDispatchM3.toFixed(1)} m³ por WhatsApp</span>
          </a>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-[var(--border-strong)] px-3 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-page)] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>Resumen copiado</span>
                </>
              ) : (
                <>
                  <Copy aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>Copiar cálculo</span>
                </>
              )}
            </button>

            <Link
              href="/#fichas"
              onClick={onRequestClose}
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-[var(--border-strong)] px-3 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-page)] transition-colors"
            >
              <Download aria-hidden="true" className="h-3.5 w-3.5" />
              <span>Ver fichas PDF</span>
            </Link>
          </div>

          <p className="text-center font-mono text-[11px] text-[var(--text-secondary)]">
            Asesoría técnica: {phoneDisplay}
          </p>
        </div>
      </aside>
    </div>
  );
}
