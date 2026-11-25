export interface IntranetConfig {
  /** URL efectiva para botones de navegación */
  accessHref: string;
  /** URL externa configurada para el subdominio de Intranet (si ya está activa) */
  externalPortalUrl: string | null;
  /** Indica si el subdominio externo ya está conectado */
  isExternalConfigured: boolean;
}

export function getIntranetConfig(): IntranetConfig {
  const raw = process.env.NEXT_PUBLIC_INTRANET_URL?.trim() ?? "";
  const isExternal =
    raw.startsWith("https://") || raw.startsWith("http://");

  return {
    accessHref: isExternal ? raw : "/acceso-empleados",
    externalPortalUrl: isExternal ? raw : null,
    isExternalConfigured: isExternal,
  };
}
