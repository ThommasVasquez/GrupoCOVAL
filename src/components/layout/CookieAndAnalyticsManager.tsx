"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  type CookieConsentState,
} from "@/lib/analytics";

/**
 * Gestor unificado de consentimiento de cookies (Ley 1581 de 2012 - Colombia)
 * + carga diferida de Google Analytics 4 y Cloudflare Web Analytics.
 */
export function CookieAndAnalyticsManager() {
  const [consent, setConsent] = useState<CookieConsentState | "undecided" | "loading">(
    "loading",
  );

  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID?.trim();
  const cfBeaconToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN?.trim();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
      if (saved === "accepted" || saved === "essential_only") {
        setConsent(saved);
      } else {
        setConsent("undecided");
      }
    } catch {
      setConsent("essential_only");
    }
  }, []);

  const savePreference = (choice: CookieConsentState) => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, choice);
    } catch {
      // Ignorar si storage está bloqueado
    }
    setConsent(choice);
  };

  return (
    <>
      {cfBeaconToken && (
        <Script
          id="cf-web-analytics"
          strategy="lazyOnload"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({ token: cfBeaconToken })}
        />
      )}

      {ga4Id && consent === "accepted" && (
        <>
          <Script
            id="ga4-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${ga4Id}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {consent === "undecided" && (
        <aside
          aria-label="Preferencias de privacidad y cookies"
          className="fixed bottom-4 left-4 right-4 z-40 max-w-lg border border-[var(--border-ink)] bg-[var(--surface-card)] p-4 shadow-md sm:right-auto"
        >
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--blueprint)]">
            LEY 1581 DE 2012 · PRIVACIDAD Y COOKIES
          </p>
          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-primary)]">
            Utilizamos cookies técnicas (seguridad antispam Turnstile) y de
            medición opcional. Consulte nuestra{" "}
            <Link
              href="/legal/politica-privacidad"
              className="font-semibold text-[var(--blueprint)] underline underline-offset-2"
            >
              Política de Datos
            </Link>{" "}
            y{" "}
            <Link
              href="/legal/politica-cookies"
              className="font-semibold text-[var(--blueprint)] underline underline-offset-2"
            >
              Cookies
            </Link>
            .
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => savePreference("accepted")}
              className="min-h-11 bg-[var(--surface-inverse)] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.06em] text-[var(--text-inverse)] hover:bg-[#2a2d32] transition-colors cursor-pointer"
            >
              Aceptar todas
            </button>
            <button
              type="button"
              onClick={() => savePreference("essential_only")}
              className="min-h-11 border border-[var(--border-ink)] bg-[var(--surface-page)] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.06em] text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
            >
              Solo esenciales
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
