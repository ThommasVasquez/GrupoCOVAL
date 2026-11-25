"use client";

import type { ReactNode } from "react";
import { useConcreteCalculatorModal } from "@/components/calculators/ConcreteCalculatorModalProvider";

interface OpenCalculatorButtonProps {
  lineId?: string;
  className?: string;
  children: ReactNode;
  onAfterClick?: () => void;
}

/**
 * Botón cliente reutilizable para abrir la calculadora volumétrica modal desde
 * Server Components y secciones de contenido sin navegar fuera de la vista actual.
 */
export function OpenCalculatorButton({
  lineId,
  className,
  children,
  onAfterClick,
}: OpenCalculatorButtonProps) {
  const { openCalculator } = useConcreteCalculatorModal();

  return (
    <button
      type="button"
      onClick={() => {
        openCalculator(lineId);
        onAfterClick?.();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
