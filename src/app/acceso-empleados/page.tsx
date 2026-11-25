import {
  ShieldCheck,
  Truck,
  Wrench,
  Layers,
  Users,
  ExternalLink,
  Lock,
} from "lucide-react";
import { getGroupEntity } from "@/lib/content/repository";
import { getIntranetConfig } from "@/lib/intranet";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";

export const metadata = buildPageMetadata({
  title: "Acceso Empleados e Intranet Corporativa",
  description:
    "Portal de acceso interno para colaboradores de Grupo Coval: Coval Concretos, VT Ingequipos e Icopores Modulado.",
  path: "/acceso-empleados",
  noIndex: true,
});

const INTRANET_MODULES = [
  {
    id: "concretos",
    icon: Truck,
    unit: "Coval Concretos · Planta Km 5",
    title: "Despachos, Dosificación y Remisiones",
    description:
      "Programación diaria de planta, seguimiento de mixers, control de calidad y remisiones de bombeo.",
  },
  {
    id: "ingequipos",
    icon: Wrench,
    unit: "VT Ingequipos",
    title: "Flota en Alquiler, Taller y Mantenimiento",
    description:
      "Disponibilidad de equipos por bodega, órdenes de mantenimiento preventivo/correctivo y actas de entrega en obra.",
  },
  {
    id: "icopores",
    icon: Layers,
    unit: "Icopores Modulado · Planta Km 14",
    title: "Órdenes de Corte EPS e Inventario",
    description:
      "Programación de modulación de casetones, muro panel, control de despachos y trazabilidad de pedidos.",
  },
  {
    id: "corporativo",
    icon: Users,
    unit: "Transversal Grupo Coval",
    title: "Talento Humano, SG-SST y Documentación",
    description:
      "Certificados laborales, desprendibles, formatos del Sistema de Gestión SST y directorio interno.",
  },
];

export default function EmployeeAccessPage() {
  const group = getGroupEntity();
  const intranet = getIntranetConfig();

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] w-full flex-col justify-center bg-[var(--surface-page)] px-5 py-12 sm:px-10 lg:px-16 xl:px-20">
      <Breadcrumbs
        items={[
          { name: "Grupo Coval", path: "/" },
          { name: "Acceso Empleados", path: "/acceso-empleados" },
        ]}
      />

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
        <section
          aria-labelledby="employee-portal-heading"
          className="lg:col-span-5 border-t border-[var(--border-ink)] pt-6"
        >
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            <Lock aria-hidden="true" className="h-3.5 w-3.5" />
            <span>Uso exclusivo colaboradores</span>
          </p>

          <h1
            id="employee-portal-heading"
            className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]"
          >
            Portal de Empleados e Intranet
          </h1>

          <p className="mt-4 font-serif text-lg leading-relaxed text-[var(--text-secondary)]">
            Acceso centralizado para colaboradores operativos, técnicos y
            administrativos de Coval Concretos, VT Ingequipos e Icopores Modulado.
          </p>

          {intranet.isExternalConfigured && intranet.externalPortalUrl ? (
            <div className="mt-8 space-y-4">
              <Button
                href={intranet.externalPortalUrl}
                external
                variant="secondary"
                size="lg"
              >
                <span>Ingresar a la Intranet</span>
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </Button>
              <p className="font-mono text-xs text-[var(--text-secondary)]">
                Subdominio autenticado: {intranet.externalPortalUrl}
              </p>
            </div>
          ) : (
            <div className="mt-8 border-l-2 border-[var(--blueprint)] pl-4 space-y-2 text-sm text-[var(--text-secondary)]">
              <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
                <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                <span>Pasarela lista para subdominio de Intranet</span>
              </div>
              <p>
                Al definir{" "}
                <code className="font-mono text-xs text-[var(--text-primary)]">
                  NEXT_PUBLIC_INTRANET_URL
                </code>{" "}
                (ej. <span className="font-mono">https://intranet.grupocoval.com.co</span>),
                este acceso y la ruta <code className="font-mono text-xs">/intranet</code>{" "}
                conectarán automáticamente.
              </p>
            </div>
          )}

          <p className="mt-8 text-xs text-[var(--text-secondary)]">
            Soporte administrativo:{" "}
            <a
              href={`tel:${group.phoneE164}`}
              className="font-mono font-medium text-[var(--text-primary)] underline underline-offset-4"
            >
              {group.phoneDisplay}
            </a>
          </p>
        </section>

        <section
          aria-labelledby="modules-heading"
          className="lg:col-span-7 divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]"
        >
          <h2 id="modules-heading" className="sr-only">
            Módulos operativos integrados
          </h2>
          {INTRANET_MODULES.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <article key={mod.id} className="py-6 grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-baseline">
                <div className="sm:col-span-4 flex items-center gap-2.5 text-xs text-[var(--text-secondary)]">
                  <span className="font-mono">0{idx + 1}</span>
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                  <span>{mod.unit}</span>
                </div>
                <div className="sm:col-span-8">
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    {mod.title}
                  </h3>
                  <p className="mt-1 font-serif text-base text-[var(--text-secondary)]">
                    {mod.description}
                  </p>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
