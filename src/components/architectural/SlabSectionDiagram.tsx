"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Corte arquitectónico comparativo de forjados aligerados con EPS:
 * Forjado Unidireccional (vigas/jácenas en una dirección) vs. Forjado Reticular (cápsula bidireccional).
 */
export function SlabSectionDiagram() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lines = gsap.utils.toArray<SVGGeometryElement>("[data-slab-line]");
        lines.forEach((el) => {
          const len =
            typeof el.getTotalLength === "function" ? el.getTotalLength() : 200;
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.to(lines, {
          strokeDashoffset: 0,
          duration: 1.5,
          stagger: 0.05,
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
      className="border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-[var(--text-secondary)]">
        <span>CORTE ESTRUCTURAL · ALIGERAMIENTO CON CASETÓN EPS</span>
        <span className="font-bold text-[var(--brand-primary)]">
          UNIDIRECCIONAL VS. RETICULAR
        </span>
      </div>

      <div className="mt-4 w-full overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-page)] p-3">
        <svg
          viewBox="0 0 760 280"
          role="img"
          aria-label="Sección estructural comparando forjado unidireccional y forjado reticular aligerado con casetones de poliestireno expandido EPS"
          className="h-auto w-full"
        >
          {/* Retícula de ejes técnicos */}
          <g stroke="var(--sketch-guide)" strokeDasharray="3 4" strokeWidth="0.8">
            <line x1="20" y1="68" x2="740" y2="68" />
            <line x1="20" y1="196" x2="740" y2="196" />
            <line x1="380" y1="22" x2="380" y2="258" />
          </g>

          {/* IZQUIERDA: FORJADO UNIDIRECCIONAL (CORTE TRANSVERSAL A VIGUETAS + CASETÓN EPS) */}
          <g stroke="var(--sketch-ink)" fill="none">
            {/* Capa de compresión superior */}
            <rect
              data-slab-line
              x="28"
              y="72"
              width="324"
              height="20"
              fill="var(--sketch-fill)"
              strokeWidth="1.4"
            />
            {/* Vigas de borde / jácenas */}
            <rect
              data-slab-line
              x="28"
              y="92"
              width="28"
              height="74"
              fill="var(--sketch-fill)"
              strokeWidth="1.4"
            />
            <rect
              data-slab-line
              x="324"
              y="92"
              width="28"
              height="74"
              fill="var(--sketch-fill)"
              strokeWidth="1.4"
            />
            {/* Nervios intermedios + bloques EPS entre ellos */}
            <rect
              data-slab-line
              x="64"
              y="98"
              width="66"
              height="48"
              stroke="var(--brand-primary)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <rect
              data-slab-line
              x="148"
              y="98"
              width="66"
              height="48"
              stroke="var(--brand-primary)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <rect
              data-slab-line
              x="232"
              y="98"
              width="66"
              height="48"
              stroke="var(--brand-primary)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            {/* Nervios de concreto entre bloques */}
            <rect data-slab-line x="130" y="92" width="18" height="54" strokeWidth="1.2" />
            <rect data-slab-line x="214" y="92" width="18" height="54" strokeWidth="1.2" />
            <rect data-slab-line x="298" y="92" width="18" height="54" strokeWidth="1.2" />
            {/* Columnas / apoyos */}
            <line data-slab-line x1="42" y1="166" x2="42" y2="220" strokeWidth="1.5" />
            <line data-slab-line x1="338" y1="166" x2="338" y2="220" strokeWidth="1.5" />
          </g>

          {/* DERECHA: FORJADO RETICULAR (ÁBACOS MACIZOS EN PILARES + NERVIOS BIDIRECCIONALES) */}
          <g stroke="var(--sketch-ink)" fill="none">
            {/* Capa de compresión superior */}
            <rect
              data-slab-line
              x="408"
              y="72"
              width="324"
              height="20"
              fill="var(--sketch-fill)"
              strokeWidth="1.4"
            />
            {/* Pilares y zonas macizadas cercanas a apoyos (ábacos) */}
            <rect
              data-slab-line
              x="408"
              y="92"
              width="48"
              height="54"
              fill="var(--sketch-fill)"
              strokeWidth="1.4"
            />
            <rect
              data-slab-line
              x="684"
              y="92"
              width="48"
              height="54"
              fill="var(--sketch-fill)"
              strokeWidth="1.4"
            />
            <rect data-slab-line x="422" y="146" width="20" height="74" strokeWidth="1.4" />
            <rect data-slab-line x="698" y="146" width="20" height="74" strokeWidth="1.4" />
            {/* Cápsula bidireccional de nervios y casetones EPS */}
            <rect
              data-slab-line
              x="466"
              y="98"
              width="58"
              height="48"
              stroke="var(--brand-primary)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <rect
              data-slab-line
              x="541"
              y="98"
              width="58"
              height="48"
              stroke="var(--brand-primary)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <rect
              data-slab-line
              x="616"
              y="98"
              width="58"
              height="48"
              stroke="var(--brand-primary)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            {/* Nervios estrechos sin viga descolgada */}
            <rect data-slab-line x="524" y="92" width="17" height="54" strokeWidth="1.2" />
            <rect data-slab-line x="599" y="92" width="17" height="54" strokeWidth="1.2" />
            <line data-slab-line x1="408" y1="146" x2="732" y2="146" strokeWidth="1.1" />
          </g>

          {/* Etiquetas de dibujo */}
          <g fill="var(--text-secondary)" fontFamily="monospace" fontSize="10">
            <text x="28" y="42" fontWeight="700" fill="var(--text-primary)">
              01 · FORJADO UNIDIRECCIONAL
            </text>
            <text x="28" y="56">
              CARGA EN UNA DIRECCIÓN SOBRE JÁCENAS Y VIGAS
            </text>

            <text x="408" y="42" fontWeight="700" fill="var(--text-primary)">
              02 · FORJADO RETICULAR
            </text>
            <text x="408" y="56">
              NERVIOS BIDIRECCIONALES + MACIZADO EN PILARES
            </text>

            <text x="96" y="126" textAnchor="middle" fill="var(--brand-primary)">
              EPS
            </text>
            <text x="181" y="126" textAnchor="middle" fill="var(--brand-primary)">
              EPS
            </text>
            <text x="265" y="126" textAnchor="middle" fill="var(--brand-primary)">
              EPS
            </text>

            <text x="495" y="126" textAnchor="middle" fill="var(--brand-primary)">
              EPS
            </text>
            <text x="570" y="126" textAnchor="middle" fill="var(--brand-primary)">
              EPS
            </text>
            <text x="645" y="126" textAnchor="middle" fill="var(--brand-primary)">
              EPS
            </text>

            <text x="28" y="252">
              CASETÓN MODULADO O CASETÓN PERDIDO IN SITU
            </text>
            <text x="408" y="252">
              SUPRIME VIGAS DESCOLGADAS · REDUCE PESO PROPIO
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
