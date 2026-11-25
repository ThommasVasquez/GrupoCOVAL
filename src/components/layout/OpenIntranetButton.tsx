"use client";

import type { ReactNode } from "react";
import { useIntranetModal } from "@/components/layout/IntranetModalProvider";

/**
 * Botón cliente reutilizable para abrir el modal de Intranet/PowerMail®
 * desde Server Components como el pie de página.
 */
export function OpenIntranetButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { openIntranetModal } = useIntranetModal();

  return (
    <button type="button" onClick={openIntranetModal} className={className}>
      {children}
    </button>
  );
}
