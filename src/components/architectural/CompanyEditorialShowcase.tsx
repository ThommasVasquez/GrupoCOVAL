"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import type { CompanySummary } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";
import { DraftingCornerTicks } from "@/components/architectural/DraftingMarks";

gsap.registerPlugin(useGSAP);

interface CompanyEditorialShowcaseProps {
  companies: CompanySummary[];
}

const UNIT_SKETCHES: Record<CompanySummary["id"], { src: string; alt: string }> = {
  concretos: {
    src: "/images/sketches/concretos-plant-pump.webp",
    alt: "Boceto arquitectónico wireframe de planta dosificadora, mixer y autobomba de Coval Concretos",
  },
  ingequipos: {
    src: "/images/sketches/ingequipos-crane-steelply.webp",
    alt: "Boceto arquitectónico wireframe de torre grúa, formaletería Steel-Ply y andamios colgantes",
  },
  icopores: {
    src: "/images/sketches/icopores-eps-slab.webp",
    alt: "Boceto isométrico wireframe de losa aligerada con casetones EPS de Icopores Modulado",
  },
};

/**
 * Presentación editorial interactiva (1 pantalla exacta):
 * Combina el boceto arquitectónico wireframe propio de cada empresa con su fotografía real en obra.
 */
export function CompanyEditorialShowcase({
  companies,
}: CompanyEditorialShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [viewMode, setViewMode] = useState<"sketch" | "photo">("sketch");

  const current = companies[activeIdx] ?? companies[0]!;
  const currentSketch = UNIT_SKETCHES[current.id];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-showcase-photo]",
          { clipPath: "inset(8% 0% 0% 0%)", opacity: 0.4 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "clipPath",
          },
        );
        gsap.fromTo(
          "[data-showcase-img]",
          { scale: 1.06 },
          { scale: 1, duration: 1.0, ease: "power2.out" },
        );
        gsap.fromTo(
          "[data-showcase-details] > *",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" },
        );
      });
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [activeIdx, viewMode] },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="unidades-heading"
      className="relative flex min-h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-4rem)] w-full flex-col justify-between border-t border-[var(--border-subtle)] bg-[var(--surface-page)] px-5 py-8 sm:px-10 lg:px-16 xl:px-20 overflow-hidden"
    >
      <DraftingCornerTicks />

      <div className="relative z-20 shrink-0">
        <div
          data-arch="heading"
          className="flex flex-wrap items-end justify-between gap-4 pb-5"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              Lámina 02 · Portafolio del Grupo
            </p>
            <h2
              id="unidades-heading"
              className="mt-2 text-3xl sm:text-4xl xl:text-5xl font-bold tracking-[-0.03em] text-[var(--text-primary)] leading-[1.04]"
            >
              Tres empresas especializadas
            </h2>
          </div>

          <p className="max-w-md font-serif text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Concreto premezclado, maquinaria en alquiler y soluciones en
            poliestireno expandido coordinadas sobre el corredor sur.
          </p>
        </div>
        <div
          data-arch="rule"
          className="h-px w-full bg-[var(--border-subtle)]"
        />
      </div>

      {/* Selector editorial izquierda + Lámina Sketch / Fotografía derecha */}
      <div className="relative z-20 my-auto py-4 grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5 divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
          {companies.map((company, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <div
                key={company.id}
                data-brand={company.id}
                className="py-4 sm:py-5 transition-opacity"
              >
                <button
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  aria-expanded={isSelected}
                  className="flex w-full items-baseline justify-between gap-4 text-left cursor-pointer group"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-[var(--text-tertiary)]">
                      0{idx + 1}
                    </span>
                    <span
                      className={cn(
                        "text-xl sm:text-2xl xl:text-3xl font-bold tracking-tight transition-colors",
                        isSelected
                          ? "text-[var(--text-primary)]"
                          : "text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]",
                      )}
                    >
                      {company.name}
                    </span>
                  </span>
                  <span className="font-mono text-xs text-[var(--text-secondary)]">
                    {company.experienceLabel}
                  </span>
                </button>

                {isSelected && (
                  <div
                    data-showcase-details
                    className="mt-3 pl-8 space-y-3"
                  >
                    <p className="font-serif text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
                      {company.summary}
                    </p>

                    <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 text-xs text-[var(--text-primary)]">
                      {company.highlights.map((h) => (
                        <li key={h} className="text-[var(--text-secondary)]">
                          — {h}
                        </li>
                      ))}
                    </ul>

                    <div className="pt-1">
                      <Link
                        href={company.href}
                        className="inline-flex min-h-9 items-center gap-2 text-sm font-semibold text-[var(--text-primary)] underline underline-offset-8 decoration-1 hover:opacity-75 transition-opacity"
                      >
                        <span>Explorar {company.name}</span>
                        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Lámina derecha: Alternancia limpia entre Boceto Wireframe y Obra Real */}
        <div className="lg:col-span-7">
          <figure className="relative overflow-hidden">
            <div
              data-showcase-photo
              className="aspect-[16/10] max-h-[54dvh] w-full overflow-hidden bg-[var(--surface-page)]"
            >
              {viewMode === "sketch" ? (
                <Image
                  key={currentSketch.src}
                  data-showcase-img
                  src={currentSketch.src}
                  alt={currentSketch.alt}
                  width={1376}
                  height={768}
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="sketch-adaptive h-full w-full object-contain [mask-image:radial-gradient(ellipse_92%_88%_at_50%_50%,black_72%,transparent_100%)]"
                />
              ) : (
                <Image
                  key={current.id}
                  data-showcase-img
                  src={current.heroImage ?? "/images/concretos/Muro-cemento_Coval.webp"}
                  alt={`${current.name} — ${current.headline}`}
                  width={1600}
                  height={1000}
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="sketch-photo-editorial h-full w-full object-cover"
                />
              )}
            </div>

            <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-2.5 text-xs text-[var(--text-secondary)]">
              <span>
                {current.headline} ·{" "}
                <span className="font-mono text-[var(--text-primary)]">
                  {current.address.startsWith("TODO:")
                    ? current.badge
                    : current.address}
                </span>
              </span>

              <div className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setViewMode("sketch")}
                  aria-pressed={viewMode === "sketch"}
                  className={cn(
                    "cursor-pointer transition-colors",
                    viewMode === "sketch"
                      ? "text-[var(--text-primary)] underline underline-offset-4"
                      : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
                  )}
                >
                  Boceto
                </button>
                <span className="text-[var(--text-tertiary)]">/</span>
                <button
                  type="button"
                  onClick={() => setViewMode("photo")}
                  aria-pressed={viewMode === "photo"}
                  className={cn(
                    "cursor-pointer transition-colors",
                    viewMode === "photo"
                      ? "text-[var(--text-primary)] underline underline-offset-4"
                      : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
                  )}
                >
                  Fotografía
                </button>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
