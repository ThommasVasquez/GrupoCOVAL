import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, MapPin, PhoneCall } from "lucide-react";
import {
  getCovalConcretosContent,
  getGroupEntity,
  getHomeContent,
  getIcoporesModuladoContent,
  getVtIngequiposContent,
} from "@/lib/content/repository";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildFaqPageJsonLd } from "@/lib/seo/schema-builders";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AnswerCapsule } from "@/components/ui/AnswerCapsule";
import { OpenCalculatorButton } from "@/components/calculators/OpenCalculatorButton";
import {
  DraftingCornerTicks,
  SheetSectionHeader,
} from "@/components/architectural/DraftingMarks";

const VALID_CITIES = ["bogota", "soacha", "sibate"] as const;
type CitySlug = (typeof VALID_CITIES)[number];

function findZone(ciudad: string) {
  const home = getHomeContent();
  return home.zonesOverview.find((z) => z.slug === ciudad) ?? null;
}

export function generateStaticParams(): Array<{ ciudad: CitySlug }> {
  return VALID_CITIES.map((ciudad) => ({ ciudad }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ciudad: string }>;
}) {
  const { ciudad } = await params;
  const zone = findZone(ciudad);
  if (!zone) {
    return buildPageMetadata({
      title: "Zona no encontrada | Grupo Coval",
      description: "Cobertura de Grupo Coval.",
      path: "/zonas",
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `Concreto Premezclado, Icopores EPS y Maquinaria en ${zone.name} | Grupo Coval`,
    description: `${zone.summary} ${zone.distanceNote}. Planta automatizada 45 m³/h, soluciones EPS y alquiler de equipos.`,
    path: `/zonas/${zone.slug}`,
  });
}

export default async function ZonaDetailPage({
  params,
}: {
  params: Promise<{ ciudad: string }>;
}) {
  const { ciudad } = await params;
  const zone = findZone(ciudad);
  if (!zone) notFound();

  const group = getGroupEntity();
  const home = getHomeContent();
  const concretos = getCovalConcretosContent();
  const icopores = getIcoporesModuladoContent();
  const vt = getVtIngequiposContent();

  const whatsappHref = buildWhatsAppUrl({ pathname: `/zonas/${zone.slug}` });
  const localFaqs = home.faqs.slice(0, 3);

  return (
    <div data-brand="grupo" className="w-full">
      <JsonLd data={buildFaqPageJsonLd(localFaqs)} />

      <section className="relative min-h-[calc(100dvh-6.25rem)] w-full overflow-hidden bg-[var(--surface-page)] px-5 py-8 sm:px-10 lg:px-16 xl:px-20">
        <DraftingCornerTicks />

        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <Breadcrumbs
            items={[
              { name: "Coval Concretos", path: "/" },
              { name: "Zonas", path: "/zonas" },
              { name: zone.name, path: `/zonas/${zone.slug}` },
            ]}
          />
          <Link
            href="/zonas"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Todas las zonas
          </Link>
        </div>

        <div className="relative z-20 mt-10">
          <SheetSectionHeader
            eyebrow={`Cobertura operativa · ${zone.distanceNote}`}
            title={`Obras en ${zone.name}`}
            subtitle={zone.summary}
          />

          <AnswerCapsule
            className="mb-10"
            question={`¿Cómo despacha Grupo Coval materiales y maquinaria en ${zone.name}?`}
            answer={`Desde nuestra planta automatizada de concreto en ${concretos.plant.location} (${concretos.plant.capacityM3Hour} m³/h, ${concretos.plant.mixersCount} mixers, ${concretos.plant.roundCapacityM3} m³ por ronda), nuestra fábrica de icopores EPS en ${icopores.about.address} y el patio de equipos VT Ingequipos en Bogotá.`}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Coval Concretos */}
            <article className="flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 sm:p-7">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#f06399]">
                  01 · Concreto Premezclado
                </p>
                <h2 className="mt-2 text-xl font-bold text-[var(--text-primary)]">
                  Coval Concretos
                </h2>
                <p className="mt-3 font-serif text-sm leading-relaxed text-[var(--text-secondary)]">
                  Suministro de concreto premezclado Convencional-Bombeable, Módulo de Rotura (MR), Industrializado y Tremie / Tornillo, más bombeo estacionario, autobomba y asistencia técnica en obra en {zone.name}.
                </p>
                <dl className="mt-4 space-y-1.5 border-t border-[var(--border-subtle)] pt-3 text-xs">
                  <div className="flex justify-between gap-2">
                    <dt className="text-[var(--text-tertiary)]">Planta</dt>
                    <dd className="font-mono text-[var(--text-primary)]">
                      {concretos.plant.location}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[var(--text-tertiary)]">Capacidad</dt>
                    <dd className="font-mono text-[var(--text-primary)]">
                      {concretos.plant.capacityM3Hour} m³/h · {concretos.plant.mixersCount} mixers
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-primary)] hover:underline"
                >
                  Ver Coval Concretos <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <OpenCalculatorButton className="text-xs font-mono text-[#f06399] hover:underline">
                  Calcular m³
                </OpenCalculatorButton>
              </div>
            </article>

            {/* Icopores Modulado / IMT */}
            <article className="flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 sm:p-7">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#b88b32]">
                  02 · Poliestireno Expandido (EPS)
                </p>
                <h2 className="mt-2 text-xl font-bold text-[var(--text-primary)]">
                  Icopores Modulado (IMT)
                </h2>
                <p className="mt-3 font-serif text-sm leading-relaxed text-[var(--text-secondary)]">
                  Fabricación y entrega de casetón modulado, casetón perdido para forjados unidireccionales y reticulares, muro panel y juntas de dilatación para proyectos en {zone.name}.
                </p>
                <dl className="mt-4 space-y-1.5 border-t border-[var(--border-subtle)] pt-3 text-xs">
                  <div className="flex justify-between gap-2">
                    <dt className="text-[var(--text-tertiary)]">Planta</dt>
                    <dd className="font-mono text-[var(--text-primary)]">
                      {icopores.about.address}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[var(--text-tertiary)]">Experiencia</dt>
                    <dd className="font-mono text-[var(--text-primary)]">
                      +{icopores.stats.years} años en EPS
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <Link
                  href="/icopores-modulado"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-primary)] hover:underline"
                >
                  Ver IMT Icopores <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/icopores-modulado#estimador-casetones"
                  className="text-xs font-mono text-[#b88b32] hover:underline"
                >
                  Estimar casetones
                </Link>
              </div>
            </article>

            {/* VT Ingequipos */}
            <article className="flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 sm:p-7">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#e30613]">
                  03 · Maquinaria y Formaleta
                </p>
                <h2 className="mt-2 text-xl font-bold text-[var(--text-primary)]">
                  VT Ingequipos S.A.S.
                </h2>
                <p className="mt-3 font-serif text-sm leading-relaxed text-[var(--text-secondary)]">
                  Alquiler, venta y mantenimiento de 6 líneas de maquinaria, encofrados Steel-Ply, andamios colgantes, bombas de concreto, accesorios de torre grúa y mixer en {zone.name}.
                </p>
                <dl className="mt-4 space-y-1.5 border-t border-[var(--border-subtle)] pt-3 text-xs">
                  <div className="flex justify-between gap-2">
                    <dt className="text-[var(--text-tertiary)]">Trayectoria</dt>
                    <dd className="font-mono text-[var(--text-primary)]">
                      +{vt.stats.years} años · {vt.stats.lines} líneas
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[var(--text-tertiary)]">Atención</dt>
                    <dd className="font-mono text-[var(--text-primary)]">
                      {group.phoneDisplay}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <Link
                  href="/vt-ingequipos"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-primary)] hover:underline"
                >
                  Ver VT Ingequipos <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/alquiler"
                  className="text-xs font-mono text-[#e30613] hover:underline"
                >
                  Ver catálogo
                </Link>
              </div>
            </article>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[var(--brand-primary)] mt-0.5 shrink-0" />
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)]">
                  Programar despacho hacia {zone.name}
                </h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Valide disponibilidad de mixers, casetones o formaleta antes de programar fundición.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contacto"
                className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 text-xs font-semibold text-white hover:bg-[var(--brand-primary-hover)]"
              >
                Solicitar cotización
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border-strong)] px-4 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--text-primary)]"
              >
                <PhoneCall className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                {group.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
