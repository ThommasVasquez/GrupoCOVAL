import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import { getGroupEntity, getNavigationData } from "@/lib/content/repository";
import { getIntranetConfig } from "@/lib/intranet";
import { buildGroupOrganizationJsonLd } from "@/lib/seo/schema-builders";
import { absoluteUrl } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { BrandThemeScope } from "@/components/layout/BrandThemeScope";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";
import { CookieAndAnalyticsManager } from "@/components/layout/CookieAndAnalyticsManager";
import { ArchitecturalMotionController } from "@/components/motion/ArchitecturalMotionController";
import { ConcreteCalculatorModalProvider } from "@/components/calculators/ConcreteCalculatorModalProvider";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { IntranetModalProvider } from "@/components/layout/IntranetModalProvider";

const fontSans = localFont({
  src: "../assets/fonts/plus-jakarta-sans-latin-wght-normal.woff2",
  display: "swap",
  variable: "--font-sans",
  weight: "200 800",
});

const fontSerif = localFont({
  src: [
    {
      path: "../assets/fonts/newsreader-latin-wght-normal.woff2",
      style: "normal",
      weight: "300 700",
    },
    {
      path: "../assets/fonts/newsreader-latin-wght-italic.woff2",
      style: "italic",
      weight: "300 700",
    },
  ],
  display: "swap",
  variable: "--font-serif",
  preload: false,
});

const fontMono = localFont({
  src: "../assets/fonts/jetbrains-mono-latin-wght-normal.woff2",
  display: "swap",
  variable: "--font-mono",
  weight: "400 700",
  preload: false,
});

const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION?.trim();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  // Cumplimiento estricto WCAG AA: jamás bloquear userScalable ni maximumScale en móvil
};

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: "Grupo Coval | Concreto Premezclado, Maquinaria y Casetones EPS",
    template: "%s | Grupo Coval",
  },
  description:
    "Concreto premezclado y bombeo (Coval Concretos), alquiler y venta de maquinaria (VT Ingequipos) y casetones EPS (Icopores Modulado) para Bogotá, Soacha y Sibaté.",
  verification: gscVerification
    ? {
        google: gscVerification,
      }
    : undefined,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const group = getGroupEntity();
  const navigation = getNavigationData();
  const intranet = getIntranetConfig();

  return (
    <html
      lang="es-CO"
      data-theme="dark"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`}
    >
      <head>
        <link
          rel="alternate"
          type="text/plain"
          title="LLMs.txt"
          href="/llms.txt"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('coval_theme_v1');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}else if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>

        {/* Entidad global Organization + 3 subOrganizations LocalBusiness */}
        <JsonLd data={buildGroupOrganizationJsonLd()} />

        <BrandThemeScope>
          <LanguageProvider>
            <IntranetModalProvider
              intranetHref={intranet.accessHref}
              isIntranetExternal={intranet.isExternalConfigured}
              phoneDisplay={group.phoneDisplay}
              phoneE164={group.phoneE164}
            >
              <ConcreteCalculatorModalProvider phoneDisplay={group.phoneDisplay}>
                <ArchitecturalMotionController />
                <SiteHeader
                  group={group}
                  navigation={navigation}
                  intranetHref={intranet.accessHref}
                  isIntranetExternal={intranet.isExternalConfigured}
                />

                <main id="main-content" tabIndex={-1} className="flex-1">
                  {children}
                </main>

                <SiteFooter
                  group={group}
                  navigation={navigation}
                  intranetHref={intranet.accessHref}
                  isIntranetExternal={intranet.isExternalConfigured}
                />
                <WhatsAppFloatingButton />
                <CookieAndAnalyticsManager />
              </ConcreteCalculatorModalProvider>
            </IntranetModalProvider>
          </LanguageProvider>
        </BrandThemeScope>
      </body>
    </html>
  );
}
