import Link from "next/link";
import { HardHat, PhoneCall, Wrench, ArrowUpRight } from "lucide-react";
import {
  getAllEquipment,
  getCompanyByBrand,
  getGroupEntity,
  getRentalCategories,
  getVtIngequiposContent,
} from "@/lib/content/repository";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildCompanyLocalBusinessJsonLd } from "@/lib/seo/schema-builders";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { absoluteUrl } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdaptiveLogo } from "@/components/ui/AdaptiveLogo";
import { HeroArchitecturalSketch } from "@/components/architectural/HeroArchitecturalSketch";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AnswerCapsule } from "@/components/ui/AnswerCapsule";
import { Button } from "@/components/ui/Button";
import { FaqSection } from "@/components/ui/FaqSection";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import {
  DraftingCornerTicks,
  SheetSectionHeader,
  PhotoPlate,
} from "@/components/architectural/DraftingMarks";

const content = getVtIngequiposContent();

export const metadata = buildPageMetadata({
  title: content.seo.title,
  description: content.seo.description,
  path: "/vt-ingequipos",
  ogImagePath: "/vt-ingequipos/opengraph-image",
});

export default function VtIngequiposPage() {
  const group = getGroupEntity();
  const company = getCompanyByBrand("ingequipos");
  const data = getVtIngequiposContent();
  const categories = getRentalCategories();
  const allEquipment = getAllEquipment();
  const whatsappHref = buildWhatsAppUrl({ pathname: "/vt-ingequipos" });

  const firstServices = data.specialServices.slice(0, 2);
  const secondServices = data.specialServices.slice(2, 5);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Alquiler, venta y mantenimiento de maquinaria y formaleta — VT Ingequipos S.A.S.",
    provider: {
      "@type": "LocalBusiness",
      "@id": `${absoluteUrl("/vt-ingequipos")}#business`,
      name: company.name,
    },
    areaServed: group.serviceAreas.map((city) => ({
      "@type": "City",
      name: city,
    })),
    serviceType: [
      "Alquiler y venta de equipos para construcción",
      "Encofrados Steel-Ply",
      "Accesorios para torres grúas",
      "Andamios colgantes",
      "Alquiler de bombas de concreto y mixer",
      "Mantenimiento y reparación de maquinaria y formaletas",
    ],
  };

  return (
    <div data-brand="ingequipos" className="w-full">
      <JsonLd data={buildCompanyLocalBusinessJsonLd("ingequipos")} />
      <JsonLd data={serviceJsonLd} />

      {/* PANTALLA 1: Hero Perspectiva Arquitectónica VT Ingequipos */}
      <HeroArchitecturalSketch
        ariaLabel="VT Ingequipos S.A.S. — Maquinaria, Formaleta y Equipos para Obra"
        topLeft="VT Ingequipos S.A.S."
        topRight="Bogotá — Soacha — Sibaté"
        imageSrc="/images/sketches/ingequipos-crane-steelply.webp"
        imageAlt="Boceto arquitectónico en trazo fino de torre grúa, encofrados Steel-Ply y andamios colgantes de VT Ingequipos"
        titleLine1="VT"
        titleLine2="Ingequipos"
        titleLine3="Maquinaria"
        descPrimary="6 Líneas · Steel-Ply · Grúas"
        descSecondary="+20 años en obra · Alquiler y Venta"
      />

      {/* PANTALLA 2: Propuesta VT Ingequipos y Capacidad (acento rojo #e30613) */}
      <section
        id="propuesta"
        className="relative flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--surface-card)] px-5 py-8 sm:px-10 sm:py-10 lg:px-16 xl:px-20"
      >
        <DraftingCornerTicks />

        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-3.5">
          <Breadcrumbs
            items={[
              { name: "Grupo Coval", path: "/" },
              { name: "VT Ingequipos", path: "/vt-ingequipos" },
            ]}
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--brand-primary)] font-semibold">
            Alquiler · Venta · Mantenimiento
          </span>
        </div>

        <div className="relative z-20 my-auto py-4 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div data-arch="heading" className="lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              {data.hero.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[var(--text-primary)] sm:text-5xl xl:text-[3.4rem] leading-[1.03]">
              {data.hero.h1}
            </h2>

            <div className="mt-6">
              <AnswerCapsule
                question={data.hero.geoQuestion}
                answer={data.hero.geoAnswer}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/alquiler" variant="secondary" size="lg">
                <HardHat aria-hidden="true" className="h-4 w-4" />
                <span>Ver catálogo ({allEquipment.length} equipos)</span>
              </Button>
              <Button href={whatsappHref} external variant="primary" size="lg">
                <PhoneCall aria-hidden="true" className="h-4 w-4" />
                <span>Asesoría directa · {group.phoneDisplay}</span>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <PhotoPlate
              src={data.hero.heroImage}
              alt="Equipos y maquinaria de construcción de VT Ingequipos S.A.S."
              aspectClass="aspect-[16/10]"
              priority
              sizes="(max-width: 1024px) 100vw, 44vw"
            />
          </div>
        </div>

        <div
          data-arch="stagger"
          className="relative z-20 grid grid-cols-1 gap-6 pt-4 sm:grid-cols-3"
        >
          <AnimatedCounter
            value={data.stats.years}
            prefix="+"
            suffix=" años"
            label="Experiencia en obra"
            sublabel="Fundada en Bogotá en el sector construcción y agro"
          />
          <AnimatedCounter
            value={data.stats.lines}
            label="Líneas especializadas de equipos"
            sublabel={`${allEquipment.length} referencias en catálogo`}
          />
          <AnimatedCounter
            value={data.stats.steelPlyUses}
            prefix="Hasta "
            suffix=" usos"
            label="Encofrados Steel-Ply"
            sublabel="Paneles en madera laminada con bastidor de acero"
          />
        </div>
      </section>

      {/* PANTALLA 2: 6 Líneas de Maquinaria (3x2 ajustado a 1 pantalla) */}
      <section
        id="lineas"
        aria-labelledby="lineas-heading"
        className="relative flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--surface-page)] px-5 py-8 sm:px-10 sm:py-10 lg:px-16 xl:px-20"
      >
        <DraftingCornerTicks />
        <SheetSectionHeader
          eyebrow="Catálogo por especialidad"
          headingId="lineas-heading"
          title="Seis líneas de equipos para obra"
          subtitle="Seleccione una línea para consultar los equipos disponibles, agregar referencias a su cotización y revisar su ficha técnica."
          className="mb-5 pb-4"
        />

        <div
          data-arch="stagger"
          className="relative z-20 my-auto grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((cat, idx) => {
            const count = allEquipment.filter((e) => e.category === cat.slug).length;
            return (
              <article
                key={cat.slug}
                className="grid grid-cols-12 gap-4 items-center border-b border-[var(--border-subtle)] pb-5"
              >
                <div className="col-span-5">
                  <PhotoPlate
                    src={cat.coverImage}
                    alt={cat.name}
                    aspectClass="aspect-[4/3]"
                    sizes="(max-width: 768px) 40vw, 14vw"
                  />
                </div>
                <div className="col-span-7 flex flex-col justify-between">
                  <div>
                    <p className="font-mono text-[11px] font-semibold text-[var(--brand-primary)]">
                      0{idx + 1} · {count} equipos
                    </p>
                    <h2 className="mt-1 text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                      {cat.name}
                    </h2>
                    <p className="mt-1 font-serif text-xs sm:text-sm leading-snug text-[var(--text-secondary)] line-clamp-2">
                      {cat.shortDescription}
                    </p>
                  </div>
                  <Link
                    href={`/alquiler/${cat.slug}`}
                    className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-primary)] underline underline-offset-4 hover:text-[var(--brand-primary)] transition-colors"
                  >
                    <span>Explorar línea</span>
                    <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* PANTALLA 3: Sistemas de Formaleta e Izaje (todas las vistas oficiales) */}
      <section
        id="sistemas"
        aria-labelledby="sistemas-izaje-heading"
        className="relative flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--surface-card)] px-5 py-8 sm:px-10 sm:py-10 lg:px-16 xl:px-20"
      >
        <DraftingCornerTicks />
        <SheetSectionHeader
          eyebrow="Sistemas constructivos"
          headingId="sistemas-izaje-heading"
          title="Formaletería Steel-Ply y accesorios para torre grúa"
        />

        <div
          data-arch="stagger"
          className="relative z-20 my-auto divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]"
        >
          {firstServices.map((srv, idx) => (
            <article
              key={srv.id}
              className="py-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center"
            >
              <div className="lg:col-span-5">
                <p className="font-mono text-xs font-semibold text-[var(--brand-primary)]">
                  0{idx + 1} · SERVICIO ESPECIALIZADO
                </p>
                <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                  {srv.title}
                </h2>
                <p className="mt-2.5 font-serif text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
                  {srv.summary}
                </p>
                <ul className="mt-3 space-y-1 text-xs sm:text-sm text-[var(--text-secondary)]">
                  {srv.details.map((d) => (
                    <li key={d}>— {d}</li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {srv.images.map((imgSrc, imgIdx) => (
                  <PhotoPlate
                    key={imgSrc}
                    src={imgSrc}
                    alt={`${srv.title} — vista ${imgIdx + 1}`}
                    aspectClass="aspect-[4/3]"
                    sizes="(max-width: 1024px) 50vw, 13vw"
                  />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PANTALLA 4: Andamios Colgantes, Bombas/Mixer y Mantenimiento Técnico */}
      <section
        id="altura"
        aria-labelledby="altura-mantenimiento-heading"
        className="relative flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--surface-page)] px-5 py-8 sm:px-10 sm:py-10 lg:px-16 xl:px-20"
      >
        <DraftingCornerTicks />
        <SheetSectionHeader
          eyebrow="Trabajo en altura, bombeo y taller"
          headingId="altura-mantenimiento-heading"
          title="Andamios colgantes, bombas de concreto y mantenimiento"
        />

        <div
          data-arch="stagger"
          className="relative z-20 my-auto divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]"
        >
          {secondServices.map((srv, idx) => (
            <article
              key={srv.id}
              className="py-5 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center"
            >
              <div className="lg:col-span-5">
                <p className="font-mono text-xs font-semibold text-[var(--brand-primary)]">
                  0{idx + 3} · OPERACIÓN EN OBRA Y TALLER
                </p>
                <h2 className="mt-1 text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                  {srv.title}
                </h2>
                <p className="mt-2 font-serif text-sm leading-relaxed text-[var(--text-secondary)]">
                  {srv.summary}
                </p>
                <ul className="mt-2.5 space-y-1 text-xs sm:text-sm text-[var(--text-secondary)]">
                  {srv.details.map((d) => (
                    <li key={d}>— {d}</li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {srv.images.map((imgSrc, imgIdx) => (
                  <PhotoPlate
                    key={imgSrc}
                    src={imgSrc}
                    alt={`${srv.title} — vista ${imgIdx + 1}`}
                    aspectClass="aspect-[16/10]"
                    sizes="(max-width: 1024px) 50vw, 20vw"
                  />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PANTALLA 5: Filosofía Institucional (Quiénes somos, Misión, Visión, Calidad) y FAQ */}
      <section
        id="empresa"
        aria-labelledby="historia-vt-heading"
        className="relative flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--surface-card)] px-5 py-8 sm:px-10 sm:py-10 lg:px-16 xl:px-20"
      >
        <DraftingCornerTicks />
        <SheetSectionHeader
          eyebrow="Acerca de nosotros"
          headingId="historia-vt-heading"
          title="VT Ingequipos S.A.S."
        />

        <div className="relative z-20 my-auto space-y-8">
          <div
            data-arch="stagger"
            className="grid grid-cols-1 gap-8 lg:grid-cols-12 pb-8 border-b border-[var(--border-subtle)]"
          >
            <div className="lg:col-span-5 space-y-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--brand-primary)] font-semibold">
                Quiénes somos
              </p>
              <p className="font-serif text-base sm:text-lg leading-relaxed text-[var(--text-primary)]">
                {data.about.whoWeAre}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button href="/alquiler" variant="secondary" size="md">
                  <Wrench aria-hidden="true" className="h-4 w-4" />
                  <span>Abrir catálogo completo ({allEquipment.length})</span>
                </Button>
                <Button href="/" variant="outline" size="md">
                  <span>Ver Coval Concretos</span>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="border-t border-[var(--border-strong)] pt-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Nuestra misión
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
                  {data.about.mission}
                </p>
              </div>

              {data.about.vision && (
                <div className="border-t border-[var(--border-strong)] pt-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Nuestra visión
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
                    {data.about.vision}
                  </p>
                </div>
              )}

              <div className="border-t border-[var(--border-strong)] pt-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Políticas de calidad
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
                  {data.about.qualityPolicy}
                </p>
              </div>
            </div>
          </div>

          <FaqSection
            title="Preguntas frecuentes de VT Ingequipos"
            description="Información sobre modalidades de servicio, líneas de equipos, Steel-Ply y andamios colgantes."
            faqs={data.faqs}
          />
        </div>
      </section>

      {/* PANTALLA 6: Nuestros Clientes y Nuestros Aliados a color y sin fondo blanco */}
      <section
        id="respaldo"
        aria-labelledby="respaldo-vt-heading"
        className="relative flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--surface-page)] px-5 py-8 sm:px-10 sm:py-10 lg:px-16 xl:px-20"
      >
        <DraftingCornerTicks />
        <SheetSectionHeader
          eyebrow="Trayectoria y marcas representadas"
          headingId="respaldo-vt-heading"
          title="Nuestros clientes y aliados"
          subtitle="Queremos ser parte de su próximo proyecto con respaldo de constructoras líderes y fabricantes internacionales."
        />

        <div className="relative z-20 my-auto space-y-10">
          {data.clients && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-2">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
                  Nuestros Clientes
                </p>
                <p className="font-mono text-[11px] text-[var(--text-tertiary)]">
                  {data.clients.names.length} constructoras de trayectoria nacional
                </p>
              </div>

              <div className="space-y-6 py-2">
                {data.clients.strips.map((strip) => (
                  <div key={strip.dark} className="w-full py-1">
                    <AdaptiveLogo
                      darkSrc={strip.dark}
                      lightSrc={strip.light}
                      alt={strip.alt}
                      priority={false}
                      className="h-auto w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.allies && (
            <div className="border-t border-[var(--border-strong)] pt-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
                  Nuestros Aliados
                </p>
                <p className="font-mono text-[11px] text-[var(--text-tertiary)]">
                  {data.allies.names.join(" · ")}
                </p>
              </div>

              <div className="w-full py-1">
                <AdaptiveLogo
                  darkSrc={data.allies.dark}
                  lightSrc={data.allies.light}
                  alt={data.allies.alt}
                  priority={false}
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
