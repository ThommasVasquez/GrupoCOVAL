"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  sublabel?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  label,
  sublabel,
  className,
}: AnimatedCounterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  const formattedFinal = value.toLocaleString("es-CO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  useGSAP(
    () => {
      const el = numberRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counterState = { current: 0 };

        gsap.fromTo(
          counterState,
          { current: 0 },
          {
            current: value,
            duration: 1.25,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
            onUpdate: () => {
              if (!numberRef.current) return;
              numberRef.current.textContent = counterState.current.toLocaleString(
                "es-CO",
                {
                  minimumFractionDigits: decimals,
                  maximumFractionDigits: decimals,
                },
              );
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [value, decimals] },
  );

  return (
    <div
      ref={containerRef}
      className={cn("border-t border-[var(--border-strong)] pt-5 pb-2", className)}
    >
      <p className="font-mono text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] tabular-nums">
        {prefix}
        <span ref={numberRef}>{formattedFinal}</span>
        {suffix}
      </p>
      <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">
        {label}
      </p>
      {sublabel && (
        <p className="mt-1 font-serif text-sm text-[var(--text-secondary)]">
          {sublabel}
        </p>
      )}
    </div>
  );
}
