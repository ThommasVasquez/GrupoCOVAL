"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Orquestador global de animaciones GSAP arquitectónicas:
 * - Línea de progreso técnico superior acoplada al scroll (scrub).
 * - Trazado progresivo de reglas divisorias [data-arch="rule"].
 * - Aparición tipográfica controlada [data-arch="heading"].
 * - Cortina arquitectónica sobre placas fotográficas [data-arch="photo"].
 * - Escalonamiento de grillas y bloques [data-arch="stagger"].
 * - Recalcula ScrollTrigger en cada transición de ruta de App Router.
 */
export function ArchitecturalMotionController() {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    const mm = gsap.matchMedia();
    let cancelled = false;

    const rafId = window.requestAnimationFrame(() => {
      if (cancelled) return;

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Reglas divisorias de plano arquitectónico
        gsap.utils.toArray<HTMLElement>('[data-arch="rule"]').forEach((rule) => {
          gsap.fromTo(
            rule,
            { scaleX: 0, transformOrigin: "left center" },
            {
              scaleX: 1,
              duration: 0.9,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: rule,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            },
          );
        });

        // 3. Titulares editoriales
        gsap.utils
          .toArray<HTMLElement>('[data-arch="heading"]')
          .forEach((heading) => {
            gsap.fromTo(
              heading,
              { opacity: 0, y: 28 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: heading,
                  start: "top 86%",
                  toggleActions: "play none none none",
                },
              },
            );
          });

        // 4. Cortina arquitectónica en fotografías
        gsap.utils
          .toArray<HTMLElement>('[data-arch="photo"]')
          .forEach((plate) => {
            const img = plate.querySelector("img");
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: plate,
                start: "top 86%",
                toggleActions: "play none none none",
              },
            });

            tl.fromTo(
              plate,
              { clipPath: "inset(10% 0% 0% 0%)", opacity: 0.45 },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                opacity: 1,
                duration: 0.95,
                ease: "power3.out",
                clearProps: "clipPath",
              },
            );

            if (img) {
              tl.fromTo(
                img,
                { scale: 1.07 },
                {
                  scale: 1,
                  duration: 1.1,
                  ease: "power2.out",
                  clearProps: "transform",
                },
                0,
              );
            }
          });

        // 5. Bloques escalonados por sección
        gsap.utils
          .toArray<HTMLElement>('[data-arch="stagger"]')
          .forEach((container) => {
            const items = Array.from(container.children) as HTMLElement[];
            if (items.length === 0) return;
            gsap.fromTo(
              items,
              { opacity: 0, y: 26 },
              {
                opacity: 1,
                y: 0,
                duration: 0.72,
                stagger: 0.08,
                ease: "power2.out",
                clearProps: "transform",
                scrollTrigger: {
                  trigger: container,
                  start: "top 85%",
                  toggleActions: "play none none none",
                },
              },
            );
          });
      });

      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      mm.revert();
    };
  }, [pathname]);

  return null;
}
