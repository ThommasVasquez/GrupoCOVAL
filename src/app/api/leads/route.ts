import { NextResponse } from "next/server";
import { z } from "zod";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const LeadPayloadSchema = z.object({
  name: z.string().trim().min(2, "Ingrese su nombre completo").max(120),
  phone: z
    .string()
    .trim()
    .min(7, "Ingrese un teléfono o WhatsApp válido")
    .max(30),
  email: z
    .string()
    .trim()
    .email("Ingrese un correo electrónico válido")
    .max(160),
  company: z.string().trim().max(140).optional().default(""),
  unit: z.enum(["concretos", "icopores", "ingequipos", "grupo"]),
  city: z.enum(["Bogotá", "Soacha", "Sibaté", "Corredor Bogotá–Girardot", "Otra"]),
  message: z
    .string()
    .trim()
    .min(10, "Describa brevemente los requerimientos de su obra")
    .max(2000),
  acceptedPrivacy: z.literal(true, {
    errorMap: () => ({
      message: "Debe autorizar el tratamiento de datos personales (Ley 1581)",
    }),
  }),
  turnstileToken: z.string().trim().optional().default(""),
  website: z.string().trim().max(200).optional().default(""),
});

const UNIT_LABELS: Record<z.infer<typeof LeadPayloadSchema>["unit"], string> = {
  concretos: "Coval Concretos",
  icopores: "Icopores Modulado (IMT)",
  ingequipos: "VT Ingequipos S.A.S.",
  grupo: "Grupo Coval",
};

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return true;
  if (!token) return false;

  // Clave oficial de pruebas locales de Cloudflare Turnstile
  if (secret === "1x0000000000000000000000000000000AA") {
    return true;
  }

  try {
    const body = new URLSearchParams({ secret, response: token });
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      },
    );
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean; hostname?: string };
    if (!data.success) return false;

    const allowedHosts = (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);

    if (allowedHosts.length > 0 && data.hostname) {
      return allowedHosts.includes(data.hostname);
    }
    return true;
  } catch {
    return false;
  }
}

async function signWebhookBody(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: Request) {
  let rawJson: unknown;
  try {
    rawJson = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Cuerpo JSON inválido." },
      { status: 400 },
    );
  }

  const parsed = LeadPayloadSchema.safeParse(rawJson);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "Datos inválidos.";
    return NextResponse.json(
      { ok: false, error: firstIssue },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot antispam silencioso
  if (data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const turnstileOk = await verifyTurnstileToken(data.turnstileToken);
  if (!turnstileOk) {
    return NextResponse.json(
      {
        ok: false,
        error: "No fue posible validar la verificación antispam. Intente nuevamente.",
      },
      { status: 400 },
    );
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim();
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET?.trim();

  if (
    webhookUrl &&
    !webhookUrl.includes("tudominio.com") &&
    webhookUrl.startsWith("http")
  ) {
    const bodyString = JSON.stringify({
      source: "grupocoval.com.co/contacto",
      submittedAt: new Date().toISOString(),
      ...data,
      turnstileToken: undefined,
      website: undefined,
    });

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (webhookSecret && !webhookSecret.startsWith("TODO")) {
        headers["X-Coval-Signature"] = await signWebhookBody(
          bodyString,
          webhookSecret,
        );
      }

      await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: bodyString,
      });
    } catch {
      // Fallback silencioso a WhatsApp URL para no perder el contacto comercial
    }
  }

  const whatsappSummary = [
    `Hola ${UNIT_LABELS[data.unit]}, envío solicitud comercial desde grupocoval.com.co:`,
    `• Nombre: ${data.name}${data.company ? ` (${data.company})` : ""}`,
    `• Ciudad / Zona: ${data.city}`,
    `• Teléfono: ${data.phone}`,
    `• Correo: ${data.email}`,
    `• Requerimiento: ${data.message}`,
  ].join("\n");

  const whatsappUrl = buildWhatsAppUrl({
    pathname: "/contacto",
    customMessage: whatsappSummary,
  });

  return NextResponse.json({
    ok: true,
    whatsappUrl,
  });
}
