"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import type { ScrollyStage } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";
import { DraftingCornerTicks } from "@/components/architectural/DraftingMarks";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ScrollyGroupHeroProps {
  stages: ScrollyStage[];
}

const STAGE_MEDIA: Record<
  ScrollyStage["layerTarget"],
  { src: string; alt: string; label: string; isSketch: boolean }
> = {
  all: {
    src: "/images/sketches/engineering-exploded.webp",
    alt: "Boceto arquitectónico explosionado de planta dosificadora, encofrados, torre grúa y placa aligerada",
    label: "Sistema estructural integrado · Isometría",
    isSketch: true,
  },
  foundation: {
    src: "/images/sketches/concretos-plant-pump.webp",
    alt: "Boceto arquitectónico wireframe de planta dosificadora Km 5, mixer y autobomba vertiendo losa",
    label: "Coval Concretos · Planta Km 5 (45 m³/h)",
    isSketch: true,
  },
  machinery: {
    src: "/images/sketches/ingequipos-crane-steelply.webp",
    alt: "Boceto arquitectónico wireframe de torre grúa, encofrados Steel-Ply y andamios colgantes",
    label: "VT Ingequipos · Izaje, Steel-Ply y Altura",
    isSketch: true,
  },
  slabs: {
    src: "/images/sketches/icopores-eps-slab.webp",
    alt: "Boceto isométrico wireframe de losa reticular con casetones en EPS",
    label: "Icopores Modulado · Casetón EPS Km 14",
    isSketch: true,
  },
};

/**
 * Secuencia Scrollytelling de 1 pantalla exacta (lg:h-[calc(100dvh-4rem)]):
 * Fija la lámina en escritorio mientras GSAP ScrollTrigger recorre las 4 etapas
 * entre el boceto técnico explosionado y las fotografías reales de obra.
 */
export function ScrollyGroupHero({ stages }: ScrollyGroupHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const currentStage = stages[activeIndex] ?? stages[0]!;
  const media = STAGE_MEDIA[currentStage.layerTarget];
  const isSketch = media.isSketch;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // En escritorio fijamos exactamente 1 pantalla (calc(100dvh - 4rem)) y recorremos las 4 etapas con scrub
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 64px",
            end: () => `+=${Math.max(stages.length - 1, 1) * 55}%`,
            pin: true,
            pinSpacing: true,
            scrub: 0.35,
            onUpdate: (self) => {
              if (progressBarRef.current) {
                gsap.set(progressBarRef.current, {
                  scaleX: Math.max(0.08, self.progress),
                });
              }
              const idx = Math.min(
                stages.length - 1,
                Math.floor(self.progress * stages.length),
              );
              setActiveIndex((prev) => (prev === idx ? prev : idx));
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [stages.length] },
  );

  // Cortina GSAP suave cada vez que cambia la etapa activa
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-scrolly-visual]",
          { clipPath: "inset(6% 0% 0% 0%)", opacity: 0.5 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
            clearProps: "clipPath",
          },
        );
        gsap.fromTo(
          "[data-scrolly-visual] img",
          { scale: 1.05 },
          { scale: 1, duration: 0.85, ease: "power2.out" },
        );
      });
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [activeIndex] },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="scrolly-heading"
      className="relative flex min-h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-4rem)] w-full flex-col justify-between border-t border-[var(--border-subtle)] bg-[var(--surface-card)] px-5 py-8 sm:px-10 lg:px-16 xl:px-20 overflow-hidden"
    >
      <DraftingCornerTicks />
      <div className="relative z-20 shrink-0">
        <div
          data-arch="heading"
          className="flex flex-wrap items-end justify-between gap-4 pb-5"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              Proceso de Obra · Secuencia GSAP
            </p>
            <h2
              id="scrolly-heading"
              className="mt-2 text-3xl sm:text-4xl xl:text-5xl font-bold tracking-[-0.03em] text-[var(--text-primary)] leading-[1.04]"
            >
              Del trazo estructural a la fundición
            </h2>
          </div>

          <p className="max-w-md font-serif text-sm sm:text-base text-[var(--text-secondary)]">
            Coordinación secuencial entre dosificación de concreto, sistemas de
            formaletería e izaje y aligeramiento de placas.
          </p>
        </div>

        {/* Regla técnica de progreso vinculada al ScrollTrigger */}
        <div className="relative h-px w-full bg-[var(--border-subtle)]">
          <div
            ref={progressBarRef}
            className="absolute inset-y-0 left-0 h-[2px] w-full origin-left bg-[var(--brand-primary)]"
            style={{
              transform: `scaleX(${(activeIndex + 1) / Math.max(stages.length, 1)})`,
            }}
          />
        </div>
      </div>

      <div className="my-auto py-4 grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-12 items-center">
        {/* Visualizador derecha: Boceto de ingeniería <-> Foto real */}
        <div className="lg:col-span-7 lg:order-2">
          <figure className="relative overflow-hidden">
            <div
              data-scrolly-visual
              className="aspect-[16/10] max-h-[54dvh] w-full overflow-hidden bg-[var(--surface-page)]"
            >
              <Image
                key={media.src}
                src={media.src}
                alt={media.alt}
                width={1376}
                height={768}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className={cn(
                  "h-full w-full",
                  isSketch
                    ? "sketch-adaptive object-contain p-2"
                    : "object-cover",
                )}
              />
            </div>

            <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-2.5 text-xs text-[var(--text-secondary)]">
              <span className="font-medium text-[var(--text-primary)]">
                {media.label}
              </span>
              <div className="flex items-center gap-4 font-mono">
                {currentStage.metrics.map((m) => (
                  <span key={m.label}>{m.value}</span>
                ))}
              </div>
            </figcaption>
          </figure>
        </div>

        {/* Etapas interactivas izquierda (compactas para caber en 1 pantalla) */}
        <div className="lg:col-span-5 lg:order-1 divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
          {stages.map((stage, index) => {
            const isActive = activeIndex === index;
            return (
              <article
                key={stage.stepCode}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "py-3.5 sm:py-4 transition-opacity cursor-pointer",
                  isActive ? "opacity-100" : "opacity-50 hover:opacity-80",
                )}
              >
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)]">
                  <span>0{index + 1}</span>
                  <span>{stage.badge}</span>
                </div>

                <h3 className="mt-1.5 text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)]">
                  {stage.title}
                </h3>

                {isActive && (
                  <>
                    <p className="mt-2 font-serif text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
                      {stage.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-5 text-xs sm:text-sm font-medium">
                      <Link
                        href={stage.primaryCta.href}
                        className="inline-flex min-h-9 items-center gap-1.5 text-[var(--text-primary)] underline underline-offset-8 decoration-1 hover:opacity-75"
                      >
                        <span>{stage.primaryCta.label}</span>
                        <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={stage.secondaryCta.href}
                        className="inline-flex min-h-9 items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      >
                        {stage.secondaryCta.label}
                      </Link>
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
