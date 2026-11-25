import Link from "next/link";
import { Layers, Mail, MapPin, PhoneCall, ArrowUpRight } from "lucide-react";
import {
  getCompanyByBrand,
  getGroupEntity,
  getIcoporesModuladoContent,
} from "@/lib/content/repository";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildCompanyLocalBusinessJsonLd } from "@/lib/seo/schema-builders";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { absoluteUrl } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { HeroArchitecturalSketch } from "@/components/architectural/HeroArchitecturalSketch";
import { AnswerCapsule } from "@/components/ui/AnswerCapsule";
import { Button } from "@/components/ui/Button";
import { FaqSection } from "@/components/ui/FaqSection";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import {
  DraftingCornerTicks,
  SheetSectionHeader,
  PhotoPlate,
} from "@/components/architectural/DraftingMarks";
import { SlabSectionDiagram } from "@/components/architectural/SlabSectionDiagram";
import { EpsSlabEstimatorClient } from "@/components/calculators/EpsSlabEstimatorClient";

const content = getIcoporesModuladoContent();

export const metadata = buildPageMetadata({
  title: content.seo.title,
  description: content.seo.description,
  path: "/icopores-modulado",
  ogImagePath: "/icopores-modulado/opengraph-image",
});

export default function IcoporesModuladoPage() {
  const group = getGroupEntity();
  const company = getCompanyByBrand("icopores");
  const data = getIcoporesModuladoContent();
  const whatsappHref = buildWhatsAppUrl({ pathname: "/icopores-modulado" });

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Soluciones en Poliestireno Expandido (EPS) — Icopores Modulador Tequendama (IMT)",
    provider: {
      "@type": "LocalBusiness",
      "@id": `${absoluteUrl("/icopores-modulado")}#business`,
      name: company.name,
    },
    areaServed: group.serviceAreas.map((city) => ({
      "@type": "City",
      name: city,
    })),
    serviceType: [
      "Casetón Modulado en EPS",
      "Casetón Perdido para forjados unidireccionales y reticulares",
      "Muro Panel liviano",
      "Juntas de Dilatación en EPS",
    ],
  };

  return (
    <div data-brand="icopores" className="w-full">
      <JsonLd data={buildCompanyLocalBusinessJsonLd("icopores")} />
      <JsonLd data={serviceJsonLd} />

      {/* PANTALLA 1: Hero Perspectiva Arquitectónica IMT */}
      <HeroArchitecturalSketch
        ariaLabel="Icopores Modulador Tequendama — Soluciones en EPS para Construcción"
        topLeft="Icopores Modulador Tequendama"
        topRight="Kilómetro 14 vía Bogotá–Girardot"
        imageSrc="/images/sketches/icopores-eps-slab.webp"
        imageAlt="Boceto arquitectónico en trazo fino de losa reticular aligerada con casetones en EPS"
        titleLine1="Icopores"
        titleLine2="Modulador"
        titleLine3="IMT · EPS"
        descPrimary="Casetón · Muro Panel · Juntas"
        descSecondary="+10 años · 98% aire · 100% reciclable"
      />

      {/* PANTALLA 2: Propuesta IMT y Capacidad Técnica (oro IMT #d1ac69) */}
      <section
        id="propuesta"
        className="relative flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--surface-card)] px-5 py-8 sm:px-10 sm:py-10 lg:px-16 xl:px-20"
      >
        <DraftingCornerTicks />
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-3.5">
          <Breadcrumbs
            items={[
              { name: "Grupo Coval", path: "/" },
              { name: "Icopores Modulado (IMT)", path: "/icopores-modulado" },
            ]}
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--brand-ink)]">
            Casetón · Muro Panel · Juntas EPS
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
              <Button href="/contacto" variant="secondary" size="lg">
                <Layers aria-hidden="true" className="h-4 w-4" />
                <span>Cotizar casetón / panel</span>
              </Button>
              <Button href={whatsappHref} external variant="primary" size="lg">
                <PhoneCall aria-hidden="true" className="h-4 w-4" />
                <span>Asesoría directa · {data.about.phoneDisplay}</span>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <PhotoPlate
              src={data.hero.heroImage}
              alt="Soluciones en poliestireno expandido EPS de Icopores Modulador Tequendama"
              aspectClass="aspect-[4/3]"
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
            label="Experiencia en mercado"
            sublabel="Trayectoria en proyectos inmobiliarios"
          />
          <AnimatedCounter
            value={data.stats.airPercentage}
            suffix="% aire"
            label="Composición celular del EPS"
            sublabel="Ligereza en manipulación y menor huella"
          />
          <AnimatedCounter
            value={data.stats.recyclablePercentage}
            suffix="%"
            label="Monomaterial reciclable"
            sublabel="Inercia química sin lixiviados"
          />
        </div>
      </section>

      {/* PANTALLA 2: Cuatro Líneas de Producto EPS (1 pantalla exacta) */}
      <section
        id="productos"
        aria-labelledby="productos-eps-heading"
        className="relative flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--surface-page)] px-5 py-8 sm:px-10 sm:py-10 lg:px-16 xl:px-20"
      >
        <DraftingCornerTicks />
        <SheetSectionHeader
          eyebrow="Nuestros productos"
          headingId="productos-eps-heading"
          title="Sistemas constructivos en EPS"
          subtitle="Cuatro soluciones especializadas en poliestireno expandido adaptables mediante corte o moldeo a cada diseño estructural."
        />

        <div
          data-arch="stagger"
          className="relative z-20 my-auto grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {data.products.map((product, idx) => {
            const productWa = buildWhatsAppUrl({
              pathname: "/icopores-modulado",
              customMessage: `Hola Icopores Modulador Tequendama (Grupo Coval), necesito cotizar ${product.name} para mi proyecto.`,
            });
            return (
              <article
                key={product.id}
                className="flex flex-col justify-between"
              >
                <div>
                  <PhotoPlate
                    src={product.image}
                    alt={product.name}
                    aspectClass="aspect-[4/3]"
                    imageClassName="scale-[1.06]"
                    sizes="(max-width: 768px) 100vw, 24vw"
                  />

                  <p className="mt-4 font-mono text-xs font-semibold text-[var(--brand-ink)]">
                    0{idx + 1} · PORTAFOLIO EPS
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
                    {product.name}
                  </h2>
                  <p className="mt-2 font-serif text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
                    {product.summary}
                  </p>
                </div>

                <div className="mt-5 space-y-2.5 border-t border-[var(--border-subtle)] pt-3.5">
                  <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                    {product.applicationNote}
                  </p>
                  <a
                    href={productWa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-[var(--brand-ink)] underline underline-offset-4 hover:opacity-75 transition-opacity"
                  >
                    <span>Cotizar {product.name}</span>
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* PANTALLA 3: Función de los Casetones y Corte Unidireccional vs. Reticular */}
      <section
        id="forjados"
        aria-labelledby="forjados-heading"
        className="relative flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--surface-card)] px-5 py-8 sm:px-10 sm:py-10 lg:px-16 xl:px-20"
      >
        <DraftingCornerTicks />
        <SheetSectionHeader
          eyebrow="Ingeniería de entrepisos"
          headingId="forjados-heading"
          title="¿Para qué se utilizan los casetones?"
          subtitle={data.slabSystemsIntro}
          className="mb-4 pb-4"
        />

        <div className="relative z-20 my-auto space-y-6">
          <div className="mx-auto w-full max-w-5xl">
            <SlabSectionDiagram />
          </div>

          <div
            data-arch="stagger"
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 border-t border-[var(--border-subtle)] pt-5"
          >
            {data.slabSystems.map((sys, idx) => (
              <article key={sys.id}>
                <p className="font-mono text-xs font-semibold text-[var(--brand-ink)]">
                  0{idx + 1} · Sistema in situ
                </p>
                <h2 className="mt-1.5 text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                  {sys.name}
                </h2>
                <p className="mt-2 font-serif text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
                  {sys.description}
                </p>
              </article>
            ))}
          </div>

          <EpsSlabEstimatorClient phoneDisplay={data.about.phoneDisplay} />
        </div>
      </section>

      {/* PANTALLA 4: Los 9 Beneficios del EPS + Respaldo en Obra */}
      <section
        id="beneficios"
        aria-labelledby="beneficios-eps-heading"
        className="relative flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--surface-page)] px-5 py-8 sm:px-10 sm:py-10 lg:px-16 xl:px-20"
      >
        <DraftingCornerTicks />
        <SheetSectionHeader
          eyebrow="Propiedades técnicas del material"
          headingId="beneficios-eps-heading"
          title="Beneficios del EPS en construcción"
          subtitle="Comportamiento frente a humedad, cargas mecánicas, aislamiento térmico y manipulación segura en obra."
        />

        <div className="relative z-20 my-auto grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          <div
            data-arch="stagger"
            className="lg:col-span-8 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-3 border-t border-[var(--border-subtle)] pt-5"
          >
            {data.benefits.map((benefit, idx) => (
              <div
                key={benefit.id}
                className="border-b border-[var(--border-subtle)] pb-4"
              >
                <span className="font-mono text-xs font-semibold text-[var(--brand-ink)]">
                  0{idx + 1}
                </span>
                <h3 className="mt-1 text-base font-bold text-[var(--text-primary)]">
                  {benefit.title}
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          <div
            data-arch="heading"
            className="lg:col-span-4 space-y-5 border-t border-[var(--border-strong)] pt-5"
          >
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-ink)]">
              Somos expertos en
            </p>
            <p className="font-serif text-base sm:text-lg leading-relaxed text-[var(--text-primary)]">
              {data.about.experienceSummary}
            </p>
            <ul className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
              {data.about.expertisePillars.map((pillar) => (
                <li
                  key={pillar}
                  className="py-2.5 text-sm font-medium text-[var(--text-primary)]"
                >
                  — {pillar}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PANTALLA 5: Sinergia Grupo Coval, Fotos Reales IMT, Sede Km 14 y FAQs */}
      <section
        id="sinergia"
        aria-labelledby="sinergia-eps-heading"
        className="relative flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--surface-card)] px-5 py-8 sm:px-10 sm:py-10 lg:px-16 xl:px-20"
      >
        <DraftingCornerTicks />
        <SheetSectionHeader
          eyebrow="Atención directa y sinergia"
          headingId="sinergia-eps-heading"
          title="Suministro coordinado con concreto y formaletería"
        />

        <div className="relative z-20 my-auto space-y-8">
          <div className="grid grid-cols-1 gap-8 border-b border-[var(--border-subtle)] pb-6 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <p className="font-serif text-base sm:text-lg leading-relaxed text-[var(--text-primary)]">
                Integre Icopores Modulador Tequendama con{" "}
                <Link
                  href="/"
                  className="underline underline-offset-4 hover:text-[var(--brand-ink)]"
                >
                  Coval Concretos
                </Link>{" "}
                y{" "}
                <Link
                  href="/vt-ingequipos"
                  className="underline underline-offset-4 hover:text-[var(--brand-ink)]"
                >
                  VT Ingequipos
                </Link>{" "}
                en un único cronograma logístico.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs sm:text-sm text-[var(--text-secondary)]">
                <div>
                  <p className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
                    <MapPin
                      aria-hidden="true"
                      className="h-3.5 w-3.5 text-[var(--brand-ink)]"
                    />
                    <span>Sede</span>
                  </p>
                  <p className="mt-1">{data.about.address}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
                    <Mail
                      aria-hidden="true"
                      className="h-3.5 w-3.5 text-[var(--brand-ink)]"
                    />
                    <span>Contacto</span>
                  </p>
                  <p className="mt-1 font-mono text-xs break-all text-[var(--text-primary)]">
                    {data.about.email}
                  </p>
                  <p className="font-mono text-xs text-[var(--text-primary)]">
                    {data.about.phoneDisplay}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <PhotoPlate
                src={data.hero.heroImage}
                alt="Soluciones en poliestireno expandido IMT junto a edificación inmobiliaria"
                aspectClass="aspect-[4/3]"
                sizes="(max-width: 1024px) 100vw, 18vw"
              />
              {data.about.galleryImages.map((img) => (
                <PhotoPlate
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  aspectClass="aspect-[4/3]"
                  sizes="(max-width: 1024px) 100vw, 18vw"
                />
              ))}
            </div>
          </div>

          <FaqSection
            title="Preguntas frecuentes de Icopores Modulador Tequendama"
            description="Consultas sobre casetones EPS, forjados unidireccionales y reticulares, muro panel y juntas."
            faqs={data.faqs}
          />
        </div>
      </section>
    </div>
  );
}
