import Link from "next/link";
import { PhoneCall } from "lucide-react";
import {
  getAllEquipment,
  getGroupEntity,
  getRentalCategories,
} from "@/lib/content/repository";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AnswerCapsule } from "@/components/ui/AnswerCapsule";
import { Button } from "@/components/ui/Button";
import { DraftingCornerTicks } from "@/components/architectural/DraftingMarks";
import { RentalCatalogClient } from "@/components/catalog/RentalCatalogClient";

export const metadata = buildPageMetadata({
  title: "Catálogo de Alquiler y Venta de Equipos | VT Ingequipos",
  description:
    "Explore las 6 líneas de maquinaria y equipos de VT Ingequipos: eléctrica, diésel/gasolina, general, maquinaria pesada, multifuncional y limpieza.",
  path: "/alquiler",
  ogImagePath: "/vt-ingequipos/opengraph-image",
});

export default function AlquilerDirectoryPage() {
  const group = getGroupEntity();
  const categories = getRentalCategories();
  const equipment = getAllEquipment();
  const whatsappHref = buildWhatsAppUrl({ pathname: "/alquiler" });

  return (
    <div data-brand="ingequipos" className="w-full">
      <section className="relative flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between overflow-hidden bg-[var(--surface-page)] px-5 py-8 sm:px-10 lg:px-16 xl:px-20">
        <DraftingCornerTicks />
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
            <Breadcrumbs
              items={[
                { name: "Grupo Coval", path: "/" },
                { name: "VT Ingequipos", path: "/vt-ingequipos" },
                { name: "Catálogo de Alquiler", path: "/alquiler" },
              ]}
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--brand-primary)]">
              6 líneas · {equipment.length} referencias
            </span>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                VT Ingequipos S.A.S. · Portafolio de maquinaria
              </p>
              <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-[var(--text-primary)] leading-[1.06]">
                Catálogo de equipos para alquiler y venta
              </h1>
            </div>

            <div className="lg:col-span-5">
              <AnswerCapsule
                question="¿Qué líneas de equipos están disponibles en VT Ingequipos?"
                answer={`Nuestro catálogo reúne ${equipment.length} equipos distribuidos en 6 líneas: Eléctrica, Diésel | Gasolina, General, Maquinaria Pesada, Multifuncional y Limpieza, con respaldo de mantenimiento y asesoría en el ${group.phoneDisplay}.`}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3 text-xs">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/alquiler/${c.slug}`}
                  className="underline underline-offset-4 text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            <Button href={whatsappHref} external variant="primary" size="md">
              <PhoneCall aria-hidden="true" className="h-4 w-4" />
              <span>Solicitar disponibilidad {group.phoneDisplay}</span>
            </Button>
          </div>
        </div>

        <div className="mt-10 flex-1">
          <RentalCatalogClient
            categories={categories}
            equipment={equipment}
            phoneDisplay={group.phoneDisplay}
          />
        </div>
      </section>
    </div>
  );
}
