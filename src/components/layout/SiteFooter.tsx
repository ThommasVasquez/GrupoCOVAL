import Link from "next/link";
import { User } from "lucide-react";
import type { GroupEntity, NavigationData } from "@/lib/content/schemas";
import { BrandRouteLogo } from "@/components/layout/BrandRouteLogo";
import { AdaptiveLogo } from "@/components/ui/AdaptiveLogo";
import { OpenCalculatorButton } from "@/components/calculators/OpenCalculatorButton";
import { OpenIntranetButton } from "@/components/layout/OpenIntranetButton";

interface SiteFooterProps {
  group: GroupEntity;
  navigation: NavigationData;
  intranetHref: string;
  isIntranetExternal: boolean;
}

export function SiteFooter({
  group,
  navigation,
  intranetHref,
  isIntranetExternal,
}: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--surface-page)] text-[var(--text-primary)]">
      <div className="w-full px-5 pt-12 pb-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <BrandRouteLogo sizeClassName="h-10 w-auto object-contain" priority={false} />

            <p className="mt-5 font-serif text-base leading-relaxed text-[var(--text-secondary)] max-w-sm">
              {group.summary}
            </p>

            <address className="mt-6 not-italic space-y-2 text-sm text-[var(--text-secondary)]">
              <p>
                <a
                  href={`tel:${group.phoneE164}`}
                  className="font-mono font-medium text-[var(--text-primary)] hover:underline underline-offset-4"
                >
                  {group.phoneDisplay}
                </a>
                {" · "}
                <a
                  href={`mailto:${group.email}`}
                  className="font-mono text-[var(--text-primary)] hover:underline underline-offset-4"
                >
                  {group.email}
                </a>
              </p>
              <p>
                Coval Concretos: Km 5 vía Bogotá-Girardot · Icopores Modulado: Km 14
                vía Bogotá-Girardot
              </p>
              <p className="text-xs">{group.openingHours}</p>
            </address>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
              Empresas
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {group.companies.map((company) => (
                <li key={company.id}>
                  <Link
                    href={company.href}
                    className="text-[var(--text-primary)] hover:opacity-75 transition-opacity"
                  >
                    <span className="block font-semibold">{company.name}</span>
                    <span className="block text-xs text-[var(--text-secondary)]">
                      {company.badge}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
              Herramientas y Acceso
            </h2>
            <ul className="mt-5 space-y-2.5 text-sm">
              {navigation.quickTools.map((tool) => (
                <li key={tool.href}>
                  {tool.href === "/cotizador-concreto" ? (
                    <OpenCalculatorButton className="inline-flex min-h-9 items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer text-left">
                      {tool.label}
                    </OpenCalculatorButton>
                  ) : (
                    <Link
                      href={tool.href}
                      className="inline-flex min-h-9 items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      {tool.label}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <Link
                  href="/blog"
                  className="inline-flex min-h-9 items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Bitácora técnica
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="inline-flex min-h-9 items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Contacto
                </Link>
              </li>
              <li className="pt-2">
                <OpenIntranetButton className="inline-flex min-h-10 items-center gap-2 font-medium text-[var(--text-primary)] underline underline-offset-4 cursor-pointer">
                  <User aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>Intranet/PowerMail®</span>
                </OpenIntranetButton>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
              Cobertura
            </h2>
            <ul className="mt-5 space-y-2.5 text-sm">
              {navigation.zonesNav.map((zone) => (
                <li key={zone.href}>
                  <Link
                    href={zone.href}
                    className="inline-flex min-h-9 items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    {zone.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-5 text-xs text-[var(--text-secondary)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {group.groupName} · {group.taxId}
          </p>
          <ul className="flex flex-wrap items-center gap-6">
            {navigation.legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="py-1.5 hover:text-[var(--text-primary)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Firma de desarrollador centrada y compacta al pie final del footer */}
        <div className="mt-4 border-t border-[var(--border-subtle)] pt-4 flex justify-center">
          <a
            href="https://www.energysoftmedia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex flex-wrap items-center justify-center gap-2.5 text-center text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <span>
              Desarrollado con el poder de ENERGYSOFTmedia® | Software con Energía! ⚡️
            </span>
            <AdaptiveLogo
              darkSrc="/images/brand/Energysoftmedia-dark.webp"
              lightSrc="/images/brand/Energysoftmedia-light.webp"
              alt="Logo ENERGYSOFTmedia"
              priority={false}
              className="h-5 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
