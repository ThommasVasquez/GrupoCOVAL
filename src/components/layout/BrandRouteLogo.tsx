"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { resolveBrandFromPathname } from "@/lib/content/repository";
import { AdaptiveLogo } from "@/components/ui/AdaptiveLogo";

const BRAND_LOGO_MAP = {
  grupo: {
    darkSrc: "/images/brand/Logo_Coval.webp",
    lightSrc: "/images/brand/Logo_Coval-light.webp",
    alt: "Grupo Coval",
    href: "/",
    className: "h-9 w-auto object-contain",
  },
  concretos: {
    darkSrc: "/images/brand/Logo_Coval.webp",
    lightSrc: "/images/brand/Logo_Coval-light.webp",
    alt: "Coval Concretos",
    href: "/",
    className: "h-9 w-auto object-contain",
  },
  ingequipos: {
    darkSrc: "/images/brand/Logo-Ingequipos-horizontal.webp",
    lightSrc: "/images/brand/Logo-Ingequipos-horizontal-light.webp",
    alt: "VT Ingequipos",
    href: "/vt-ingequipos",
    className: "h-7 w-auto object-contain",
  },
  icopores: {
    darkSrc: "/images/brand/Logo-IMT.webp",
    lightSrc: "/images/brand/Logo-IMT-light.webp",
    alt: "Icopores Modulado",
    href: "/icopores-modulado",
    className: "h-9 w-auto object-contain",
  },
} as const;

export function BrandRouteLogo({
  sizeClassName,
  priority = true,
}: {
  sizeClassName?: string;
  priority?: boolean;
}) {
  const pathname = usePathname() ?? "/";
  const brand = resolveBrandFromPathname(pathname);
  const logo = BRAND_LOGO_MAP[brand];

  return (
    <Link
      href={logo.href}
      className="inline-flex items-center min-h-11 shrink-0"
      aria-label={`${logo.alt} — Inicio de sección`}
    >
      <AdaptiveLogo
        darkSrc={logo.darkSrc}
        lightSrc={logo.lightSrc}
        alt={logo.alt}
        priority={priority}
        className={sizeClassName ?? logo.className}
      />
    </Link>
  );
}
