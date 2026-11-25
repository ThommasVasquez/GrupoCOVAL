import Link from "next/link";
import { Mail, MapPin, PhoneCall, ArrowUpRight } from "lucide-react";
import { getGroupEntity, getIcoporesModuladoContent } from "@/lib/content/repository";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AnswerCapsule } from "@/components/ui/AnswerCapsule";
import { ContactLeadForm } from "@/components/forms/ContactLeadForm";
import { OpenCalculatorButton } from "@/components/calculators/OpenCalculatorButton";
import { DraftingCornerTicks } from "@/components/architectural/DraftingMarks";

export const metadata = buildPageMetadata({
  title: "Contacto Comercial y Cotizaciones",
  description:
    "Solicite cotización directa de concreto premezclado (Coval Concretos Km 5), casetones y muro panel EPS (Icopores Modulado Km 14) y maquinaria de obra (VT Ingequipos).",
  path: "/contacto",
});

export default function ContactoPage() {
  const group = getGroupEntity();
  const icopores = getIcoporesModuladoContent();
  const whatsappHref = buildWhatsAppUrl({ pathname: "/contacto" });

  return (
    <div data-brand="grupo" className="w-full">
      <section className="relative min-h-[calc(100dvh-6.25rem)] w-full overflow-hidden bg-[var(--surface-page)] px-5 py-8 sm:px-10 lg:px-16 xl:px-20">
        <DraftingCornerTicks />

        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <Breadcrumbs
            items={[
              { name: "Coval Concretos", path: "/" },
              { name: "Contacto y Cotizaciones", path: "/contacto" },
            ]}
          />
          <span className="font-mono text-xs text-[var(--text-secondary)]">
            Bogotá · Soacha · Sibaté
          </span>
        </div>

        <div className="relative z-20 mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          {/* Columna izquierda: Canales oficiales y sedes */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand-primary)] font-semibold">
                Atención técnica y comercial
              </p>
              <h1 className="mt-2.5 text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-[var(--text-primary)] leading-[1.05]">
                Cotice concreto, EPS o maquinaria para su obra
              </h1>
            </div>

            <AnswerCapsule
              question="¿Cómo contactar directamente a Grupo Coval y sus unidades de negocio?"
              answer={`Comuníquese a la línea unificada ${group.phoneDisplay} o escriba al correo corporativo oficial ${group.email}.`}
            />

            <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
              <div className="py-4 space-y-1">
                <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                  <PhoneCall aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>Línea comercial y WhatsApp</span>
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-mono text-lg font-bold text-[var(--text-primary)] hover:text-[var(--brand-primary)]"
                >
                  {group.phoneDisplay}
                </a>
              </div>

              <div className="py-4 space-y-1">
                <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                  <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>Plantas y sedes operativas</span>
                </p>
                <p className="text-sm text-[var(--text-primary)]">
                  <strong>Coval Concretos:</strong> Kilómetro 5 vía Bogotá–Girardot
                </p>
                <p className="text-sm text-[var(--text-primary)]">
                  <strong>Icopores Modulado (IMT):</strong>{" "}
                  {icopores.about.address}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  <strong>VT Ingequipos S.A.S.:</strong> Cobertura Bogotá, Soacha y Sibaté
                </p>
              </div>

              <div className="py-4 space-y-1">
                <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                  <Mail aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>Correo electrónico oficial</span>
                </p>
                <a
                  href={`mailto:${group.email}`}
                  className="inline-block font-mono text-xs text-[var(--text-primary)] underline underline-offset-4 hover:text-[var(--brand-primary)]"
                >
                  {group.email}
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-semibold">
              <OpenCalculatorButton className="inline-flex items-center gap-1 underline underline-offset-4 text-[var(--text-primary)] hover:text-[var(--brand-primary)] cursor-pointer">
                <span>Abrir calculadora volumétrica (m³)</span>
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </OpenCalculatorButton>
              <Link
                href="/alquiler"
                className="inline-flex items-center gap-1 underline underline-offset-4 text-[var(--text-primary)] hover:text-[var(--brand-primary)]"
              >
                <span>Ver catálogo de 64 equipos</span>
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Columna derecha: Formulario de solicitud */}
          <div className="lg:col-span-7">
            <ContactLeadForm />
          </div>
        </div>
      </section>
    </div>
  );
}
