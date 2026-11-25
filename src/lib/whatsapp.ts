import { getGroupEntity } from "./content/repository";

export interface WhatsAppLinkOptions {
  pathname?: string;
  customMessage?: string;
}

const CONTEXT_MESSAGES: Array<{ prefix: string; message: string }> = [
  {
    prefix: "/cotizador-concreto",
    message:
      "Hola Grupo Coval, acabo de calcular un volumen preliminar en el Cotizador de Concreto y quiero validar disponibilidad y cotización formal.",
  },
  {
    prefix: "/coval-concretos",
    message:
      "Hola Coval Concretos, necesito cotizar concreto premezclado y/o servicio de bombeo para mi obra.",
  },
  {
    prefix: "/alquiler",
    message:
      "Hola VT Ingequipos, estoy revisando el catálogo de equipos en alquiler y necesito disponibilidad para obra.",
  },
  {
    prefix: "/vt-ingequipos",
    message:
      "Hola VT Ingequipos, requiero asesoría y cotización en alquiler, venta o mantenimiento de equipos para construcción.",
  },
  {
    prefix: "/icopores-modulado",
    message:
      "Hola Icopores Modulado, necesito cotizar casetones en EPS / muro panel / juntas de dilatación para mi proyecto.",
  },
  {
    prefix: "/zonas/soacha",
    message:
      "Hola Grupo Coval, tengo una obra en Soacha y quisiera cotizar suministros o equipos.",
  },
  {
    prefix: "/zonas/sibate",
    message:
      "Hola Grupo Coval, tengo una obra en Sibaté y quisiera cotizar suministros o equipos.",
  },
  {
    prefix: "/zonas/bogota",
    message:
      "Hola Grupo Coval, tengo una obra en Bogotá y quisiera cotizar suministros o equipos.",
  },
];

export function buildWhatsAppUrl({
  pathname = "/",
  customMessage,
}: WhatsAppLinkOptions = {}): string {
  const { whatsappNumber } = getGroupEntity();

  const resolvedMessage =
    customMessage ??
    (pathname === "/"
      ? "Hola Coval Concretos, necesito cotizar concreto premezclado y/o servicio de bombeo para mi obra."
      : CONTEXT_MESSAGES.find((entry) => pathname.startsWith(entry.prefix))
          ?.message) ??
    "Hola Grupo Coval, necesito asesoría comercial para mi obra.";

  const encoded = encodeURIComponent(resolvedMessage);
  return `https://wa.me/${whatsappNumber}?text=${encoded}`;
}
