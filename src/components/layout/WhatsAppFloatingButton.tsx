"use client";

import { usePathname } from "next/navigation";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { resolveBrandFromPathname } from "@/lib/content/repository";

/**
 * Botón flotante circular de WhatsApp sin texto, usando exclusivamente el ícono
 * oficial de WhatsApp y la paleta estricto negro / blanco / rosa COVAL (#f06399).
 */
export function WhatsAppFloatingButton() {
  const pathname = usePathname() ?? "/";
  const href = buildWhatsAppUrl({ pathname });
  const brand = resolveBrandFromPathname(pathname);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp (+57 316 2948000)"
      onClick={() =>
        trackEvent("whatsapp_click", {
          page_path: pathname,
          brand_context: brand,
          placement: "floating_button",
        })
      }
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-[#1ebe5a] sm:bottom-6 sm:right-6"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="currentColor"
        className="h-7 w-7"
      >
        <path d="M12.04 2C6.51 2 2 6.51 2 12.04c0 1.77.46 3.5 1.34 5.02L2 22l5.08-1.33a9.98 9.98 0 0 0 4.96 1.31h.01c5.53 0 10.04-4.51 10.04-10.04C22.09 6.51 17.57 2 12.04 2Zm5.84 14.2c-.25.7-1.44 1.34-2 1.42-.51.08-1.15.11-1.86-.12-.43-.14-.98-.32-1.69-.63-2.97-1.28-4.9-4.29-5.05-4.49-.15-.2-1.21-1.61-1.21-3.07 0-1.46.76-2.18 1.03-2.48.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.25.6.85 2.07.92 2.22.08.15.12.33.02.53-.1.2-.15.33-.3.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.36 1.46.3.15.47.13.64-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.34.08.12.08.7-.17 1.4Z" />
      </svg>
    </a>
  );
}
