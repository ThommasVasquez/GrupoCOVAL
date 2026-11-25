export type AnalyticsEventName =
  | "whatsapp_click"
  | "quote_concrete_submit"
  | "quote_rental_submit"
  | "quote_eps_submit"
  | "contact_submit"
  | "rental_item_add"
  | "pdf_sheet_download";

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "consent",
      targetOrAction: string,
      params?: Record<string, unknown>,
    ) => void;
    dataLayer?: unknown[];
  }
}

export const COOKIE_CONSENT_STORAGE_KEY = "coval_cookie_consent_v1";

export type CookieConsentState = "accepted" | "essential_only";

export function trackEvent(
  eventName: AnalyticsEventName,
  params: Record<string, string | number | boolean | undefined> = {},
): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}
