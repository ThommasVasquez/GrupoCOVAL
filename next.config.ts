import path from "node:path";
import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const isProd = process.env.NODE_ENV === "production";

const cspDirectives = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"} https://challenges.cloudflare.com https://www.googletagmanager.com https://static.cloudflareinsights.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://challenges.cloudflare.com https://www.google-analytics.com https://analytics.google.com https://cloudflareinsights.com",
  "frame-src https://challenges.cloudflare.com https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: cspDirectives,
  },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  outputFileTracingRoot: path.join(__dirname),
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // Coval Concretos vive directamente en la raíz "/" y la calculadora abre en modal
      {
        source: "/coval-concretos",
        destination: "/",
        permanent: true,
      },
      {
        source: "/coval-concretos/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/cotizador-concreto",
        destination: "/?cotizador=1",
        permanent: false,
      },
      // Antiguo slug con "r" final -> nuevo slug oficial
      {
        source: "/icopores-modulador",
        destination: "/icopores-modulado",
        permanent: true,
      },
      {
        source: "/icopores-modulador/:path*",
        destination: "/icopores-modulado",
        permanent: true,
      },
      // Mapeo semántico de categorías antiguas de WooCommerce / WordPress
      {
        source: "/product-category/linea-diesel-y-gasolina",
        destination: "/alquiler/linea-diesel-gasolina",
        permanent: true,
      },
      {
        source: "/product-category/maquinaria-pesada",
        destination: "/alquiler/linea-maquinaria-pesada",
        permanent: true,
      },
      {
        source: "/product-category/linea-multifuncional",
        destination: "/alquiler/linea-multifuncional",
        permanent: true,
      },
      {
        source: "/product-category/linea-limpieza",
        destination: "/alquiler/linea-limpieza",
        permanent: true,
      },
      {
        source: "/product-category/:slug",
        destination: "/alquiler/:slug",
        permanent: true,
      },
      {
        source: "/product-category/:slug/:rest*",
        destination: "/alquiler/:slug",
        permanent: true,
      },
      {
        source: "/product/:slug*",
        destination: "/alquiler",
        permanent: true,
      },
      {
        source: "/alquiler-y-venta-de-equipos-ingequipos",
        destination: "/alquiler",
        permanent: true,
      },
      {
        source: "/tienda",
        destination: "/alquiler",
        permanent: true,
      },
      // Alias preventivos de rutas de catálogo de VT Ingequipos
      {
        source: "/vt-ingequipos/alquiler",
        destination: "/alquiler",
        permanent: true,
      },
      {
        source: "/vt-ingequipos/alquiler/:path*",
        destination: "/alquiler/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
