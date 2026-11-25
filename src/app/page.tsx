import Image from "next/image";
import Link from "next/link";
import { Calculator, Download, PhoneCall, ArrowUpRight } from "lucide-react";
import { getCompanyByBrand, getCovalConcretosContent, getGroupEntity, getImageDimensions } from "@/lib/content/repository";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildCompanyLocalBusinessJsonLd } from "@/lib/seo/schema-builders";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { absoluteUrl } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { HeroArchitecturalSketch } from "@/components/architectural/HeroArchitecturalSketch";
import { AnswerCapsule } from "@/components/ui/AnswerCapsule";
import { AdaptiveLogo } from "@/components/ui/AdaptiveLogo";
import { Button } from "@/components/ui/Button";
import { FaqSection } from "@/components/ui/FaqSection";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import {
  DraftingCornerTicks,
  SheetSectionHeader,
  PhotoPlate,
  SketchPlate,
} from "@/components/architectural/DraftingMarks";
import { ConcretePumpingDiagram } from "@/components/architectural/ConcretePumpingDiagram";
import { ConcreteSpecsMatrix } from "@/components/concretos/ConcreteSpecsMatrix";
import { OpenCalculatorButton } from "@/components/calculators/OpenCalculatorButton";

const content = getCovalConcretosContent();

export const metadata = buildPageMetadata({
  title: content.seo.title,
  description: content.seo.description,
  path: "/",
  ogImagePath: "/opengraph-image",
});

export default function CovalHomePage() {
  const group = getGroupEntity();
  const company = getCompanyByBrand("concretos");
  const data = getCovalConcretosContent();
  const whatsappHref = buildWhatsAppUrl({ pathname: "/" });

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Producción, Transporte y Suministro de Concreto Premezclado — Coval Concretos",
    provider: {
      "@type": "LocalBusiness",
      "@id": `${absoluteUrl("/")}#business`,
      name: company.name,
    },
    areaServed: group.serviceAreas.map((city) => ({
      "@type": "City",
      name: city,
    })),
    serviceType: [
      "Concreto premezclado convencional-bombeable",
      "Concreto módulo de rotura MR para pisos y pavimentos",
      "Concreto industrializado",
      "Concreto tremie y tornillo para cimentación profunda",
      "Asistencia técnica, bombeo estacionario y autobomba",
    ],
  };

  return (
    <div data-brand="concretos" className="w-full">
      <JsonLd data={buildCompanyLocalBusinessJsonLd("concretos")} />
      <JsonLd data={serviceJsonLd} />

      {/* PANTALLA 1: Hero Perspectiva Arquitectónica Coval Concretos */}
      <HeroArchitecturalSketch
        ariaLabel="Coval Concretos — Producción, Transporte y Suministro de Concreto Premezclado"
        topLeft="Coval Concretos"
        topRight="Bogotá — Soacha — Sibaté"
        imageSrc="/images/sketches/hero-perspective.webp"
        imageAlt="Perspectiva arquitectónica en trazo fino de edificación contemporánea"
        titleLine1="Coval"
        titleLine2="Concretos"
        titleLine3="Premezclados"
        descPrimary="Convencional · MR · Bombeo"
        descSecondary="Km 5 Vía Bogotá – Girardot"
      />

      {/* PANTALLA 2: Propuesta Coval Concretos y Capacidad Instalada */}
      <section
        id="propuesta"
        className="relative flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--surface-card)] px-5 py-8 sm:px-10 sm:py-10 lg:px-16 xl:px-20"
      >
        <DraftingCornerTicks />

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
              <OpenCalculatorButton className="inline-flex items-center justify-center gap-2 font-sans font-medium tracking-tight transition-colors bg-[var(--surface-button-dark)] text-[var(--surface-button-dark-text)] hover:opacity-85 px-7 py-3.5 text-sm min-h-[50px] cursor-pointer">
                <Calculator aria-hidden="true" className="h-4 w-4" />
                <span>Cotizar concreto (m³)</span>
              </OpenCalculatorButton>
              <Button href={whatsappHref} external variant="primary" size="lg">
                <PhoneCall aria-hidden="true" className="h-4 w-4" />
                <span>Asesoría rápida · {group.phoneDisplay}</span>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <SketchPlate
              src="/images/sketches/concretos-plant-pump.webp"
              alt="Boceto wireframe de planta automatizada, mixer y autobomba de Coval Concretos"
              caption={`${data.plant.location} · ${data.plant.type}`}
              sizes="(max-width: 1024px) 100vw, 44vw"
            />
          </div>
        </div>

        <div
          data-arch="stagger"
          className="relative z-20 grid grid-cols-1 gap-6 pt-4 sm:grid-cols-3"
        >
          <AnimatedCounter
            value={data.plant.capacityM3Hour}
            suffix=" m³/h"
            label="Capacidad de planta automatizada"
            sublabel="Km 5 vía Bogotá–Girardot"
          />
          <AnimatedCounter
            value={data.plant.mixersCount}
            label="Mixers en flota"
            sublabel={`Respuesta por ronda de ${data.plant.roundCapacityM3} m³`}
          />
          <AnimatedCounter
            value={data.trackRecord?.projectsCompleted ?? 1500}
            prefix="+"
            label="Proyectos realizados"
            sublabel={`${data.trackRecord?.yearsExperience ?? 15}+ años experiencia · ${data.trackRecord?.satisfactionPercent ?? 99.9}% clientes satisfechos`}
          />
        </div>
      </section>

      {/* PANTALLA 3: Quiénes Somos, Misión, Objetivos y Nuestra Planta Km 5 */}
      <section
        id="empresa"
        aria-labelledby="planta-heading"
        className="relative flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--surface-page)] px-5 py-8 sm:px-10 sm:py-10 lg:px-16 xl:px-20"
      >
        <DraftingCornerTicks />
        <SheetSectionHeader
          eyebrow="Nuestra empresa y planta"
          headingId="planta-heading"
          title="Planta automatizada Km 5 / Vía Bogotá–Girardot"
          subtitle="Capacidad de 45 m³/h con flota de 7 mixers y respuesta por ronda de 54 m³."
        />

        <div className="relative z-20 my-auto grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
          <div data-arch="heading" className="lg:col-span-5 space-y-5">
            <div className="border-t border-[var(--border-strong)] pt-3">
              <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                Quiénes somos
              </p>
              <p className="mt-2 font-serif text-base sm:text-lg leading-relaxed text-[var(--text-primary)]">
                {data.about.foundedText}
              </p>
            </div>

            <div className="border-t border-[var(--border-subtle)] pt-3">
              <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                Nuestra misión
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {data.about.mission}
              </p>
            </div>

            <div className="border-t border-[var(--border-subtle)] pt-3">
              <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Nuestros objetivos
              </p>
              <ul className="divide-y divide-[var(--border-subtle)] border-b border-[var(--border-subtle)]">
                {data.about.objectives.map((obj) => (
                  <li key={obj} className="py-2 text-xs sm:text-sm text-[var(--text-primary)]">
                    — {obj}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            data-arch="stagger"
            className="lg:col-span-7 grid grid-cols-2 gap-4"
          >
            {data.plant.gallery.map((photo) => (
              <PhotoPlate
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                aspectClass="aspect-[16/10]"
                sizes="(max-width: 1024px) 50vw, 28vw"
              />
            ))}
          </div>
        </div>
      </section>

      {/* PANTALLA 4: Cuatro Líneas de Concreto (1 pantalla exacta) */}
      <section
        id="lineas"
        aria-labelledby="tipos-concreto-heading"
        className="relative flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--surface-card)] px-5 py-8 sm:px-10 sm:py-10 lg:px-16 xl:px-20"
      >
        <DraftingCornerTicks />
        <SheetSectionHeader
          eyebrow="Tipos de concretos"
          headingId="tipos-concreto-heading"
          title="Cuatro líneas de concreto premezclado"
          subtitle="Formulaciones especializadas con descarga directa de ficha técnica oficial y cálculo preliminar de m³."
        />

        <div
          data-arch="stagger"
          className="relative z-20 my-auto grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4"
        >
          {data.concreteTypes.map((mix, idx) => (
            <article key={mix.id} className="flex flex-col justify-between">
              <div>
                <PhotoPlate
                  src={mix.image}
                  alt={mix.name}
                  aspectClass="aspect-[16/10]"
                  sizes="(max-width: 768px) 100vw, 24vw"
                />
                <p className="mt-4 font-mono text-xs text-[var(--text-tertiary)]">
                  0{idx + 1} · {mix.specAge}
                </p>
                <h3 className="mt-1.5 text-xl font-bold text-[var(--text-primary)]">
                  {mix.name}
                </h3>
                <p className="mt-2 font-serif text-sm leading-relaxed text-[var(--text-secondary)]">
                  {mix.summary}
                </p>
                <p className="mt-3 font-mono text-xs text-[var(--text-primary)]">
                  {mix.strengths}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-3">
                <a
                  href={mix.pdfUrl}
                  download
                  className="inline-flex min-h-10 items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <Download aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>Descargar Ficha</span>
                </a>
                <OpenCalculatorButton
                  lineId={mix.id}
                  className="inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-[var(--brand-primary)] underline underline-offset-4 hover:opacity-80 cursor-pointer"
                >
                  <span>Calcular m³</span>
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </OpenCalculatorButton>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PANTALLA 5: Parámetros Técnicos y Fichas PDF (Formato ordenado en 4 columnas) */}
      <section
        id="fichas"
        aria-labelledby="parametros-heading"
        className="relative flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--surface-page)] px-5 py-8 sm:px-10 sm:py-10 lg:px-16 xl:px-20"
      >
        <DraftingCornerTicks />
        <SheetSectionHeader
          eyebrow="Especificaciones de laboratorio"
          headingId="parametros-heading"
          title="Parámetros técnicos y fichas oficiales"
          subtitle="Especificaciones de diseño organizadas por línea para interventoría técnica y programación de vaciado."
        />

        <div className="relative z-20 my-auto">
          <ConcreteSpecsMatrix mixes={data.concreteTypes} sheets={data.sheets} />
        </div>
      </section>

      {/* PANTALLA 6: Colocación y Asistencia Técnica (Solo Coval Concretos) */}
      <section
        id="bombeo"
        aria-labelledby="bombeo-heading"
        className="relative flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--surface-card)] px-5 py-8 sm:px-10 sm:py-10 lg:px-16 xl:px-20"
      >
        <DraftingCornerTicks />
        <SheetSectionHeader
          eyebrow="Colocación de concreto en obra"
          headingId="bombeo-heading"
          title="Asistencia técnica, bombeo estacionario y autobomba"
          subtitle="Servicio directo de colocación de concreto premezclado en alturas y zonas de difícil acceso."
          className="mb-4 pb-4"
        />

        <div className="relative z-20 my-auto space-y-6">
          <div className="mx-auto w-full max-w-5xl">
            <ConcretePumpingDiagram />
          </div>

          <div
            data-arch="stagger"
            className="grid grid-cols-1 gap-8 lg:grid-cols-2"
          >
            {data.pumpingServices.map((pump, idx) => (
              <article key={pump.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">
                    0{idx + 1} · {pump.name}
                  </h3>
                  <span className="text-xs font-mono text-[var(--text-secondary)]">
                    {pump.recommendedFor}
                  </span>
                </div>
                <p className="mt-1.5 font-serif text-sm leading-relaxed text-[var(--text-secondary)]">
                  {pump.summary}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  {pump.images.map((imgSrc, imgIdx) => (
                    <PhotoPlate
                      key={imgSrc}
                      src={imgSrc}
                      alt={`${pump.name} de Coval Concretos — vista ${imgIdx + 1}`}
                      aspectClass="aspect-[16/9]"
                      sizes="(max-width: 1024px) 50vw, 24vw"
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PANTALLA 7: Galería Completa (9 fotos), Nuestros Aliados y Preguntas Frecuentes */}
      <section
        id="trayectoria"
        aria-labelledby="galeria-aliados-heading"
        className="relative flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--surface-page)] px-5 py-8 sm:px-10 sm:py-10 lg:px-16 xl:px-20"
      >
        <DraftingCornerTicks />
        <SheetSectionHeader
          eyebrow="Trayectoria y respaldo"
          headingId="galeria-aliados-heading"
          title="Obras, nuestros aliados y asesoría"
          subtitle="Queremos ser parte de su próximo proyecto: estamos atentos a ofrecerle un excelente servicio."
          className="mb-4 pb-4"
        />

        <div className="relative z-20 my-auto space-y-6">
          {/* Galería de obra completa (las 9 fotos reales de Coval Concretos) */}
          <div
            data-arch="stagger"
            className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-9"
          >
            {data.projectGallery.map((item) => {
              const dims = getImageDimensions(item.src);
              return (
                <div
                  key={item.src}
                  data-arch="photo"
                  className="overflow-hidden bg-[var(--surface-muted)]"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={dims.width}
                    height={dims.height}
                    sizes="(max-width: 640px) 33vw, 11vw"
                    className="sketch-photo-editorial aspect-[4/3] w-full object-cover"
                  />
                </div>
              );
            })}
          </div>

          {/* Nuestros Aliados reales (sin fondo blanco, transparente en ambos temas) */}
          {data.allies && (
            <div className="border-y border-[var(--border-subtle)] py-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                  Nuestros Aliados
                </p>
                <p className="font-mono text-[11px] text-[var(--text-tertiary)]">
                  {data.allies.names.join(" · ")}
                </p>
              </div>
              <div className="w-full py-1">
                <AdaptiveLogo
                  darkSrc="/images/concretos/Aliados-dark.webp"
                  lightSrc="/images/concretos/Aliados-clean.webp"
                  alt="Aliados comerciales y de laboratorio de Coval Concretos: ALION, Cementos Tequendama, Idicol, Concrelab, GCP, Euclid Chemical Toxement y Agregados La Peña de Horeb"
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          )}

          <FaqSection
            title="Preguntas frecuentes"
            description="Cobertura en Soacha, Sibaté y Bogotá, líneas de mezcla y asesoría técnica."
            faqs={data.faqs}
          />
        </div>
      </section>
    </div>
  );
}
