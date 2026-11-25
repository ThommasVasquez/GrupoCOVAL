"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Diagrama Técnico de Colocación y Bombeo (Coval Concretos) adaptativo Claro/Oscuro.
 */
export function ConcretePumpingDiagram() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lines = gsap.utils.toArray<SVGGeometryElement>("[data-pump-line]");
        lines.forEach((el) => {
          const len =
            typeof el.getTotalLength === "function" ? el.getTotalLength() : 180;
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.to(lines, {
          strokeDashoffset: 0,
          duration: 1.5,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className="border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-2.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-[var(--text-secondary)]">
        <span>ESQUEMA TÉCNICO · COLOCACIÓN Y BOMBEO EN OBRA</span>
        <span className="font-bold text-[var(--brand-primary)]">
          PLANTA KM 5 · 7 MIXERS
        </span>
      </div>

      <div className="mt-4 w-full overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-page)] p-2">
        <svg
          viewBox="0 0 760 270"
          role="img"
          aria-label="Diagrama arquitectónico de colocación de concreto: bomba estacionaria con tubería en altura y autobomba de brazo articulado"
          className="h-auto w-full"
        >
          <g stroke="var(--sketch-guide)" strokeDasharray="3 4" strokeWidth="0.8">
            <line x1="20" y1="224" x2="740" y2="224" />
            <line x1="20" y1="148" x2="740" y2="148" />
            <line x1="20" y1="74" x2="740" y2="74" />
          </g>

          {/* Bomba Estacionaria */}
          <g stroke="var(--sketch-ink)" fill="none">
            <line data-pump-line x1="24" y1="224" x2="360" y2="224" strokeWidth="1.4" />
            <rect data-pump-line x1="205" y="74" width="128" height="150" strokeWidth="1.2" />
            <line data-pump-line x1="205" y1="124" x2="333" y2="124" strokeWidth="1.2" />
            <line data-pump-line x1="205" y1="174" x2="333" y2="174" strokeWidth="1.2" />
            <rect data-pump-line x1="48" y="200" width="44" height="24" fill="var(--sketch-fill)" strokeWidth="1.2" />
            <circle cx="58" cy="224" r="5" fill="var(--sketch-ink)" />
            <circle cx="82" cy="224" r="5" fill="var(--sketch-ink)" />
            <path
              data-pump-line
              d="M 92 212 L 188 212 L 188 66 L 266 66"
              stroke="var(--brand-primary)"
              strokeWidth="2.4"
            />
            <circle cx="266" cy="66" r="3.5" fill="var(--brand-primary)" stroke="none" />
          </g>

          <line x1="382" y1="20" x2="382" y2="254" stroke="var(--border-subtle)" strokeWidth="1" />

          {/* Autobomba */}
          <g stroke="var(--sketch-ink)" fill="none">
            <line data-pump-line x1="402" y1="224" x2="736" y2="224" strokeWidth="1.4" />
            <rect data-pump-line x1="420" y="192" width="76" height="26" fill="var(--sketch-fill)" strokeWidth="1.2" />
            <rect data-pump-line x1="420" y="176" width="24" height="16" strokeWidth="1.2" />
            <circle cx="436" cy="221" r="6" fill="var(--sketch-ink)" />
            <circle cx="482" cy="221" r="6" fill="var(--sketch-ink)" />
            <path
              data-pump-line
              d="M 468 192 L 520 96 L 615 80 L 664 152 L 664 196"
              stroke="var(--brand-primary)"
              strokeWidth="2.2"
            />
            <rect
              data-pump-line
              x="588"
              y="210"
              width="132"
              height="14"
              fill="var(--sketch-fill)"
              strokeWidth="1.3"
            />
            <rect
              data-pump-line
              x="644"
              y="224"
              width="22"
              height="32"
              strokeWidth="1.1"
              strokeDasharray="3 2"
            />
          </g>

          <g fontFamily="monospace" fontSize="10" fill="var(--text-primary)">
            <text x="34" y="42" fontWeight="700" fill="var(--brand-primary)">
              01 // BOMBEO ESTACIONARIO
            </text>
            <text x="34" y="56" fill="var(--text-secondary)" fontSize="9">
              ÁREAS DE DIFÍCIL ACCESO Y ALTURAS
            </text>

            <text x="408" y="42" fontWeight="700" fill="var(--brand-primary)">
              02 // AUTOBOMBA
            </text>
            <text x="408" y="56" fill="var(--text-secondary)" fontSize="9">
              COLOCACIÓN RÁPIDA EN ELEMENTOS DE OBRA
            </text>

            <text x="24" y="252" fill="var(--blueprint)" fontSize="9">
              PLANTA AUTOMATIZADA KM 5 · 45 m³/h
            </text>
            <text x="408" y="252" fill="var(--blueprint)" fontSize="9">
              7 MIXERS · RESPUESTA POR RONDA 54 m³
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
