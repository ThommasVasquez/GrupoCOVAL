"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, ArrowUpRight } from "lucide-react";
import type { GroupEntity, NavigationData } from "@/lib/content/schemas";
import { BrandRouteLogo } from "@/components/layout/BrandRouteLogo";
import { AdaptiveLogo } from "@/components/ui/AdaptiveLogo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { getPageSubNav } from "@/components/layout/page-subnav";
import { useConcreteCalculatorModal } from "@/components/calculators/ConcreteCalculatorModalProvider";
import { useIntranetModal } from "@/components/layout/IntranetModalProvider";
import { cn } from "@/lib/utils";

const LIQUID_GLASS_NORMAL_MAP =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" preserveAspectRatio="none">' +
      "<defs>" +
      '<linearGradient id="gy" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="rgb(128,255,0)"/>' +
      '<stop offset="22%" stop-color="rgb(128,128,0)"/>' +
      '<stop offset="78%" stop-color="rgb(128,128,0)"/>' +
      '<stop offset="100%" stop-color="rgb(128,0,0)"/>' +
      "</linearGradient>" +
      '<linearGradient id="gx" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0%" stop-color="rgb(255,128,0)" stop-opacity="1"/>' +
      '<stop offset="5%" stop-color="rgb(128,128,0)" stop-opacity="0"/>' +
      '<stop offset="95%" stop-color="rgb(128,128,0)" stop-opacity="0"/>' +
      '<stop offset="100%" stop-color="rgb(0,128,0)" stop-opacity="1"/>' +
      "</linearGradient>" +
      "</defs>" +
      '<rect width="100" height="40" fill="url(#gy)"/>' +
      '<rect width="100" height="40" fill="url(#gx)"/>' +
      "</svg>",
  );

interface SiteHeaderProps {
  group: GroupEntity;
  navigation: NavigationData;
  intranetHref: string;
  isIntranetExternal: boolean;
}

/**
 * Doble cabecera arquitectónica fija:
 * - Nivel superior (sobre la línea): identidad general Grupo Coval, selector global de unidades
 *   (con píldora rosada #f06399 en el activo) y configuraciones globales (Empleados, teléfono, tema).
 * - Nivel inferior (bajo la línea): logo propio de la empresa/página actual y navbar interno de esa página.
 */
export function SiteHeader({
  navigation,
  intranetHref,
  isIntranetExternal,
}: SiteHeaderProps) {
  const pathname = usePathname() ?? "/";
  const { openCalculator } = useConcreteCalculatorModal();
  const { openIntranetModal } = useIntranetModal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [canRefract, setCanRefract] = useState(false);
  const subNav = useMemo(() => getPageSubNav(pathname), [pathname]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    subNav.items[0]?.sectionId ?? null,
  );

  useEffect(() => {
    setCanRefract("chrome" in window);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveSectionId(subNav.items[0]?.sectionId ?? null);
  }, [pathname, subNav.items]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    const sectionIds = subNav.items
      .map((item) => item.sectionId)
      .filter((id): id is string => Boolean(id));

    if (sectionIds.length === 0) return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target?.id) {
          setActiveSectionId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: 0.01,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname, subNav.items]);

  return (
    <header className="sticky top-0 z-40 pointer-events-none">
      {/* Filtro SVG de refracción óptica en bisel para navegadores Chromium */}
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        className="pointer-events-none fixed h-0 w-0 overflow-hidden"
      >
        <defs>
          <filter
            id="coval-liquid-glass-lens"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={LIQUID_GLASS_NORMAL_MAP}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="lensMap"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="lensMap"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* NIVEL 1 (Sobre la línea): Barra sólida superior con configuraciones y unidades */}
      <div className="relative z-30 pointer-events-auto border-b border-[var(--border-subtle)] bg-[var(--surface-page)]">
        <div className="flex h-10 w-full items-center justify-between gap-4 px-5 sm:px-8 lg:px-12 xl:px-16">
          <Link
            href="/"
            aria-label="Grupo Coval — Inicio"
            className="inline-flex items-center shrink-0 hover:opacity-85 transition-opacity"
          >
            <AdaptiveLogo
              darkSrc="/images/brand/Grupo-Coval-Logo.webp"
              lightSrc="/images/brand/Grupo-Coval-Logo-light.webp"
              alt="Grupo Coval"
              priority
              className="h-5 sm:h-[22px] w-auto object-contain"
            />
          </Link>

          <nav
            aria-label="Navegación general de empresas"
            className="hidden xl:flex items-center gap-1.5 2xl:gap-3"
          >
            {navigation.primaryNav.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : item.href === "/vt-ingequipos"
                    ? pathname === "/vt-ingequipos" ||
                      pathname.startsWith("/vt-ingequipos/") ||
                      pathname.startsWith("/alquiler")
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs tracking-tight transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-[var(--brand-primary)] font-semibold text-[var(--brand-on-primary)] hover:bg-[var(--brand-primary-hover)]"
                      : "font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openIntranetModal}
              aria-haspopup="dialog"
              className="hidden md:inline-flex h-8 items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <User aria-hidden="true" className="h-3.5 w-3.5" />
              <span>Intranet/PowerMail®</span>
            </button>

            <LanguageSwitcher />

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation-panel"
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              className="inline-flex h-8 w-8 items-center justify-center border border-[var(--border-subtle)] text-[var(--text-primary)] xl:hidden"
            >
              {mobileOpen ? (
                <X aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Menu aria-hidden="true" className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* NIVEL 2 (De la línea para abajo): Cápsula Liquid Glass flotante con logo y navbar de cada página */}
      <div className="relative z-10 px-3 py-2 sm:px-6 lg:px-10 xl:px-14">
        <div
          data-refract={canRefract ? "true" : undefined}
          className="pointer-events-auto liquid-glass-capsule relative flex h-12 sm:h-[52px] w-full items-center justify-between gap-4 rounded-full px-4 sm:px-6"
        >
          <div className="relative z-10 flex items-center shrink-0">
            <BrandRouteLogo sizeClassName="h-7 sm:h-8 w-auto object-contain" />
          </div>

          <nav
            aria-label="Navegación de la página actual"
            className="relative z-10 flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {subNav.items.map((item) => {
              const isSectionActive =
                item.sectionId !== undefined && activeSectionId === item.sectionId;
              const isRouteActive =
                item.sectionId === undefined && pathname === item.href;
              const isSubActive = isSectionActive || isRouteActive;

              const isSamePageAnchor =
                item.sectionId !== undefined &&
                ((pathname === "/" && item.href.startsWith("/#")) ||
                  item.href.startsWith(`${pathname}#`));

              const linkClasses = cn(
                "inline-flex items-center rounded-full px-3 py-1 whitespace-nowrap text-xs tracking-tight transition-colors",
                isSubActive
                  ? "bg-[var(--brand-primary)] font-semibold text-[var(--brand-on-primary)] hover:bg-[var(--brand-primary-hover)]"
                  : "font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
              );

              if (isSamePageAnchor && item.sectionId) {
                return (
                  <a
                    key={item.href}
                    href={`#${item.sectionId}`}
                    className={linkClasses}
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link key={item.href} href={item.href} className={linkClasses}>
                  {item.label}
                </Link>
              );
            })}

            {subNav.cta &&
              (subNav.cta.modalAction === "open-concrete-calculator" ? (
                <button
                  type="button"
                  onClick={() => openCalculator()}
                  className="hidden sm:inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--surface-button-dark)] px-3.5 py-1 text-xs font-semibold text-[var(--surface-button-dark-text)] hover:opacity-85 transition-opacity whitespace-nowrap cursor-pointer"
                >
                  <span>{subNav.cta.label}</span>
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              ) : (
                subNav.cta.href && (
                  <Link
                    href={subNav.cta.href}
                    className="hidden sm:inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--surface-button-dark)] px-3.5 py-1 text-xs font-semibold text-[var(--surface-button-dark-text)] hover:opacity-85 transition-opacity whitespace-nowrap"
                  >
                    <span>{subNav.cta.label}</span>
                    <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </Link>
                )
              ))}
          </nav>
        </div>
      </div>

      {/* Panel móvil / tablet (< xl) para las empresas del grupo y configuraciones */}
      {mobileOpen && (
        <div
          id="mobile-navigation-panel"
          className="pointer-events-auto border-t border-[var(--border-subtle)] bg-[var(--surface-page)]/95 backdrop-blur-xl px-5 pb-8 pt-4 xl:hidden"
        >
          <nav aria-label="Menú móvil" className="divide-y divide-[var(--border-subtle)]">
            {navigation.primaryNav.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : item.href === "/vt-ingequipos"
                    ? pathname === "/vt-ingequipos" ||
                      pathname.startsWith("/vt-ingequipos/") ||
                      pathname.startsWith("/alquiler")
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex min-h-13 items-center justify-between py-3 text-base font-medium",
                    isActive
                      ? "text-[var(--text-primary)] font-semibold"
                      : "text-[var(--text-secondary)]",
                  )}
                >
                  <span
                    className={cn(
                      isActive &&
                        "inline-flex items-center rounded-full bg-[var(--brand-primary)] px-3.5 py-1 text-sm font-semibold text-[var(--brand-on-primary)]",
                    )}
                  >
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="hidden sm:inline text-xs text-[var(--text-tertiary)]">
                      {item.description}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 flex flex-wrap gap-3 border-t border-[var(--border-subtle)] pt-5">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openCalculator();
              }}
              className="inline-flex min-h-11 items-center bg-[var(--surface-button-dark)] px-5 text-sm font-medium text-[var(--surface-button-dark-text)] cursor-pointer"
            >
              Calculadora de Concreto (m³)
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openIntranetModal();
              }}
              aria-haspopup="dialog"
              className="inline-flex min-h-11 items-center gap-2 border border-[var(--border-strong)] px-4 text-sm font-medium text-[var(--text-primary)] cursor-pointer"
            >
              <User aria-hidden="true" className="h-4 w-4" />
              <span>Intranet/PowerMail®</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
