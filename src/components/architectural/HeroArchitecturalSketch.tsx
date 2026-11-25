"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export interface HeroArchitecturalSketchProps {
  ariaLabel?: string;
  topLeft?: string;
  topRight?: string;
  imageSrc?: string;
  imageAlt?: string;
  titleLine1?: string;
  titleLine2?: string;
  titleLine3?: string;
  descPrimary?: string;
  descSecondary?: string;
}

/**
 * Hero Perspectiva Arquitectónica (100dvh, ancho completo):
 * Ilustración de estudio en trazo fino adaptativa a Modo Oscuro y Modo Claro,
 * con tipografía monumental escalonada y mínima metadata en esquinas.
 */
export function HeroArchitecturalSketch({
  ariaLabel = "Grupo Coval — Ingeniería y Suministros para Construcción",
  topLeft = "Grupo Coval",
  topRight = "Bogotá — Soacha — Sibaté",
  imageSrc = "/images/sketches/hero-perspective.webp",
  imageAlt = "Perspectiva arquitectónica en trazo fino de edificación contemporánea",
  titleLine1 = "Grupo",
  titleLine2 = "Coval",
  titleLine3 = "Construcción",
  descPrimary = "Concreto · Maquinaria · EPS",
  descSecondary = "Corredor Bogotá – Girardot",
}: HeroArchitecturalSketchProps) {
  const stageRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(
          "[data-hero-artwork]",
          { opacity: 0, scale: 1.03 },
          { opacity: 1, scale: 1, duration: 1.35 },
        ).fromTo(
          "[data-hero-type]",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.85, stagger: 0.1 },
          "-=0.85",
        );
      });

      return () => mm.revert();
    },
    { scope: stageRef },
  );

  return (
    <section
      id="inicio"
      ref={stageRef}
      aria-label={ariaLabel}
      className="relative flex h-[calc(100dvh-6.5rem)] min-h-[540px] max-h-[1040px] w-full flex-col justify-between overflow-hidden bg-[var(--surface-page)] px-5 py-7 sm:px-10 sm:py-9 lg:px-16 xl:px-20"
    >
      {/* Metadata superior mínima en esquinas */}
      <div
        data-hero-type
        className="relative z-20 flex w-full items-center justify-between text-[11px] sm:text-xs font-medium uppercase tracking-[0.22em] text-[var(--text-secondary)]"
      >
        <span>{topLeft}</span>
        <span>{topRight}</span>
      </div>

      {/* Arte arquitectónico central a pantalla completa */}
      <div
        data-hero-artwork
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-2 sm:px-8"
      >
        <div className="relative h-full w-full max-w-[1600px] flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={1376}
            height={768}
            priority
            sizes="100vw"
            className="sketch-adaptive h-full w-full object-contain sm:object-cover object-center opacity-95"
          />
          {/* Viñeta sutil inferior izquierda para legibilidad perfecta del titular */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[var(--surface-page)] via-[var(--surface-page)]/45 to-transparent"
          />
        </div>
      </div>

      {/* Composición inferior: titular escalonado izquierda + descriptor derecha */}
      <div className="relative z-20 flex w-full items-end justify-between gap-6 pb-2 sm:pb-4">
        <h1
          data-hero-type
          className="font-sans font-bold uppercase tracking-[-0.035em] text-[var(--text-primary)] leading-[0.9]"
        >
          <span className="block text-[clamp(2.5rem,7.2vw,6.2rem)]">
            {titleLine1}
          </span>
          <span className="block text-[clamp(2.5rem,7.2vw,6.2rem)]">
            {titleLine2}
          </span>
          <span className="block pl-[14%] sm:pl-[26%] text-[clamp(2rem,5.4vw,4.5rem)] text-[var(--text-secondary)]">
            {titleLine3}
          </span>
        </h1>

        <div
          data-hero-type
          className="hidden sm:block text-right text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)] leading-relaxed"
        >
          <p className="text-[var(--text-primary)]">{descPrimary}</p>
          <p>{descSecondary}</p>
        </div>
      </div>
    </section>
  );
}
