import { NextResponse } from "next/server";
import { getIntranetConfig } from "@/lib/intranet";
import { absoluteUrl } from "@/lib/utils";

/**
 * Pasarela /intranet preparada para el subdominio corporativo futuro:
 * - Si NEXT_PUBLIC_INTRANET_URL apunta a ej. https://intranet.grupocoval.com.co, redirige (307) allí.
 * - Mientras el subdominio entra en operación, dirige a /acceso-empleados sin romper enlaces antiguos o marcadores.
 */
export function GET() {
  const { externalPortalUrl } = getIntranetConfig();
  const destination = externalPortalUrl ?? absoluteUrl("/acceso-empleados");

  return NextResponse.redirect(destination, {
    status: 307,
    headers: {
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}
