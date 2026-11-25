"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Script from "next/script";
import { Check, PhoneCall, Send } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          callback: (token: string) => void;
          "expired-callback"?: () => void;
        },
      ) => string;
      reset: (widgetId: string) => void;
    };
  }
}

type BusinessUnit = "concretos" | "icopores" | "ingequipos" | "grupo";
type ServiceCity =
  | "Bogotá"
  | "Soacha"
  | "Sibaté"
  | "Corredor Bogotá–Girardot"
  | "Otra";

const UNIT_OPTIONS: Array<{ id: BusinessUnit; label: string; hint: string }> = [
  {
    id: "concretos",
    label: "Coval Concretos",
    hint: "Concreto premezclado, MR, tremie y bombeo · Km 5",
  },
  {
    id: "icopores",
    label: "Icopores Modulado (IMT)",
    hint: "Casetón modulado, casetón perdido, muro panel y juntas EPS · Km 14",
  },
  {
    id: "ingequipos",
    label: "VT Ingequipos S.A.S.",
    hint: "Alquiler, venta y mantenimiento de maquinaria, Steel-Ply y grúas",
  },
  {
    id: "grupo",
    label: "Atención integral Grupo Coval",
    hint: "Coordinación conjunta de concreto, formaleta y EPS en obra",
  },
];

const CITIES: ServiceCity[] = [
  "Bogotá",
  "Soacha",
  "Sibaté",
  "Corredor Bogotá–Girardot",
  "Otra",
];

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

export function ContactLeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [unit, setUnit] = useState<BusinessUnit>("concretos");
  const [city, setCity] = useState<ServiceCity>("Bogotá");
  const [message, setMessage] = useState("");
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [website, setWebsite] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ whatsappUrl: string } | null>(
    null,
  );

  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const renderWidget = () => {
    if (!TURNSTILE_SITE_KEY || !turnstileRef.current || !window.turnstile) {
      return;
    }
    if (widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: "auto",
      callback: (token) => setTurnstileToken(token),
      "expired-callback": () => setTurnstileToken(""),
    });
  };

  useEffect(() => {
    renderWidget();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          company,
          unit,
          city,
          message,
          acceptedPrivacy,
          turnstileToken,
          website,
        }),
      });

      const json = (await response.json()) as {
        ok: boolean;
        error?: string;
        whatsappUrl?: string;
      };

      if (!response.ok || !json.ok) {
        setErrorMessage(
          json.error ?? "No se pudo enviar su solicitud. Revise los campos.",
        );
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
          setTurnstileToken("");
        }
        return;
      }

      trackEvent("contact_submit", { unit, city });
      setSuccessData({
        whatsappUrl:
          json.whatsappUrl ?? "https://wa.me/573162948000",
      });
    } catch {
      setErrorMessage(
        "Error de red al enviar la solicitud. También puede escribirnos directo por WhatsApp.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="border border-[var(--brand-primary)] bg-[var(--surface-card)] p-6 sm:p-8 space-y-5">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-primary)] text-[var(--brand-on-primary)]">
          <Check aria-hidden="true" className="h-5 w-5" />
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--brand-primary)] font-semibold">
            Solicitud registrada
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
            Gracias, {name}
          </h2>
          <p className="mt-2 font-serif text-base text-[var(--text-secondary)]">
            Recibimos su requerimiento técnico. Si necesita respuesta inmediata de
            despacho o disponibilidad, puede abrir el mensaje precargado directo
            en WhatsApp.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={successData.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 bg-[var(--brand-primary)] px-5 text-sm font-semibold text-[var(--brand-on-primary)] hover:bg-[var(--brand-primary-hover)] transition-colors"
          >
            <PhoneCall aria-hidden="true" className="h-4 w-4" />
            <span>Enviar copia directa a WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => {
              setSuccessData(null);
              setMessage("");
            }}
            className="inline-flex min-h-11 items-center border border-[var(--border-strong)] px-4 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--border-ink)] cursor-pointer"
          >
            Enviar otra consulta
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 sm:p-8 space-y-6"
    >
      {TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={renderWidget}
        />
      )}

      {/* Selección de unidad */}
      <fieldset className="space-y-3">
        <legend className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
          1. Unidad de negocio requerida
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {UNIT_OPTIONS.map((opt) => {
            const active = unit === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setUnit(opt.id)}
                className={cn(
                  "text-left border p-3.5 transition-colors cursor-pointer",
                  active
                    ? "border-[var(--brand-primary)] bg-[var(--surface-page)]"
                    : "border-[var(--border-subtle)] hover:border-[var(--border-strong)]",
                )}
              >
                <span className="block text-sm font-bold text-[var(--text-primary)]">
                  {opt.label}
                </span>
                <span className="mt-1 block text-xs text-[var(--text-secondary)]">
                  {opt.hint}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Datos de contacto */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="lead-name"
            className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
          >
            Nombre completo *
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Carlos Mendoza"
            className="h-11 w-full border border-[var(--border-strong)] bg-[var(--surface-page)] px-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand-primary)]"
          />
        </div>

        <div>
          <label
            htmlFor="lead-phone"
            className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
          >
            Teléfono / WhatsApp *
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ej. +57 316 2948000"
            className="h-11 w-full border border-[var(--border-strong)] bg-[var(--surface-page)] px-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand-primary)]"
          />
        </div>

        <div>
          <label
            htmlFor="lead-email"
            className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
          >
            Correo electrónico *
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ingenieria@constructora.com.co"
            className="h-11 w-full border border-[var(--border-strong)] bg-[var(--surface-page)] px-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand-primary)]"
          />
        </div>

        <div>
          <label
            htmlFor="lead-company"
            className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
          >
            Constructora / Empresa
          </label>
          <input
            id="lead-company"
            name="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Nombre del proyecto o empresa"
            className="h-11 w-full border border-[var(--border-strong)] bg-[var(--surface-page)] px-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand-primary)]"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="lead-city"
          className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
        >
          Ubicación de la obra
        </label>
        <select
          id="lead-city"
          name="city"
          value={city}
          onChange={(e) => setCity(e.target.value as ServiceCity)}
          className="h-11 w-full border border-[var(--border-strong)] bg-[var(--surface-page)] px-3 text-sm text-[var(--text-primary)] focus:border-[var(--brand-primary)]"
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="lead-message"
          className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
        >
          Detalle técnico o solicitud de cotización *
        </label>
        <textarea
          id="lead-message"
          name="message"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Indique volumen en m³, resistencia PSI/MR, referencia de maquinaria o medidas aproximadas de casetones EPS."
          className="w-full border border-[var(--border-strong)] bg-[var(--surface-page)] p-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand-primary)]"
        />
      </div>

      {/* Honeypot invisible */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="lead-website">Sitio web</label>
        <input
          id="lead-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {TURNSTILE_SITE_KEY && <div ref={turnstileRef} className="min-h-[65px]" />}

      <label className="flex items-start gap-3 text-xs leading-relaxed text-[var(--text-secondary)] cursor-pointer">
        <input
          type="checkbox"
          checked={acceptedPrivacy}
          onChange={(e) => setAcceptedPrivacy(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[var(--brand-primary)]"
        />
        <span>
          Autorizo el tratamiento de mis datos personales para atender esta
          solicitud comercial y técnica conforme a la{" "}
          <Link
            href="/legal/politica-privacidad"
            className="font-semibold text-[var(--text-primary)] underline underline-offset-4"
          >
            Política de Tratamiento de Datos (Ley 1581 de 2012)
          </Link>
          . *
        </span>
      </label>

      {errorMessage && (
        <p
          role="alert"
          className="border border-[var(--brand-primary)] bg-[var(--surface-page)] px-4 py-3 text-xs font-medium text-[var(--text-primary)]"
        >
          {errorMessage}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-12 items-center gap-2 bg-[var(--surface-button-dark)] px-6 text-sm font-semibold text-[var(--surface-button-dark-text)] hover:opacity-85 disabled:opacity-50 transition-opacity cursor-pointer"
        >
          <Send aria-hidden="true" className="h-4 w-4" />
          <span>{submitting ? "Enviando..." : "Enviar solicitud comercial"}</span>
        </button>

        <a
          href="https://wa.me/573162948000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center gap-2 text-xs font-semibold text-[var(--text-primary)] underline underline-offset-4 hover:text-[var(--brand-primary)]"
        >
          <PhoneCall aria-hidden="true" className="h-4 w-4" />
          <span>Atención directa WhatsApp +57 316 2948000</span>
        </a>
      </div>
    </form>
  );
}
