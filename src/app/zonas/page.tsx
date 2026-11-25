import Link from "next/link";
import { ArrowUpRight, MapPin, PhoneCall } from "lucide-react";
import { getGroupEntity, getHomeContent } from "@/lib/content/repository";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AnswerCapsule } from "@/components/ui/AnswerCapsule";
import { OpenCalculatorButton } from "@/components/calculators/OpenCalculatorButton";
import {
  DraftingCornerTicks,
  SheetSectionHeader,
} from "@/components/architectural/DraftingMarks";

export const metadata = buildPageMetadata({
  title: "Zonas de Cobertura | Bogotá, Soacha y Sibaté — Grupo Coval",
  description:
    "Cobertura directa de concreto premezclado (Km 5 vía Bogotá-Girardot), soluciones EPS (Km 14 vía Bogotá-Girardot) y maquinaria VT Ingequipos en Bogotá, Soacha y Sibaté.",
  path: "/zonas",
});

export default function ZonasIndexPage() {
  const group = getGroupEntity();
  const home = getHomeContent();
  const whatsappHref = buildWhatsAppUrl({ pathname: "/zonas" });

  return (
    <div data-brand="grupo" className="w-full">
      <section className="relative min-h-[calc(100dvh-6.25rem)] w-full overflow-hidden bg-[var(--surface-page)] px-5 py-8 sm:px-10 lg:px-16 xl:px-20">
        <DraftingCornerTicks />

        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <Breadcrumbs
            items={[
              { name: "Coval Concretos", path: "/" },
              { name: "Zonas de cobertura", path: "/zonas" },
            ]}
          />
          <span className="font-mono text-xs text-[var(--text-secondary)]">
            Corredor Vía Bogotá–Girardot
          </span>
        </div>

        <div className="relative z-20 mt-10">
          <SheetSectionHeader
            eyebrow="Despacho y Logística en Cundinamarca y D.C."
            title="Zonas de cobertura operativa"
            subtitle="Nuestras plantas en el Kilómetro 5 y Kilómetro 14 vía Bogotá–Girardot, junto con el centro logístico de VT Ingequipos en Bogotá, permiten atender obras civiles e inmobiliarias con respuesta coordinada."
          />

          <AnswerCapsule
            className="mb-10"
            question="¿Qué municipios cubre Grupo Coval con planta y flota propia?"
            answer={`Atendemos directamente proyectos en ${group.serviceAreas.join(", ")} mediante nuestra planta automatizada de concreto en Km 5 (45 m³/h, 7 mixers), planta de icopores EPS en Km 14 y catálogo de maquinaria y formaleta VT Ingequipos desde Bogotá.`}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {home.zonesOverview.map((zone, idx) => (
              <article
                key={zone.slug}
                className="flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 sm:p-8"
              >
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
                    0{idx + 1} · {zone.name}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
                    {zone.name}
                  </h2>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)]">
                    <MapPin className="h-3.5 w-3.5 text-[var(--brand-primary)] shrink-0" />
                    {zone.distanceNote}
                  </p>
                  <p className="mt-4 font-serif text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
                    {zone.summary}
                  </p>
                </div>

                <div className="mt-8 border-t border-[var(--border-subtle)] pt-4 flex items-center justify-between gap-4">
                  <Link
                    href={zone.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)] underline-offset-4 hover:underline"
                  >
                    Ver detalle operativo
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/contacto"
                    className="text-xs font-mono text-[var(--brand-primary)] hover:underline"
                  >
                    Cotizar
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-[var(--border-subtle)] pt-6">
            <OpenCalculatorButton className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--brand-primary)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
              Calcular volumen m³
            </OpenCalculatorButton>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border-strong)] px-5 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--text-primary)]"
            >
              <PhoneCall className="h-4 w-4 text-[var(--brand-primary)]" />
              WhatsApp {group.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
