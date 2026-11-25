import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, PhoneCall } from "lucide-react";
import {
  getEquipmentByCategory,
  getGroupEntity,
  getRentalCategories,
  getRentalCategoryBySlug,
} from "@/lib/content/repository";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { absoluteUrl } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AnswerCapsule } from "@/components/ui/AnswerCapsule";
import { Button } from "@/components/ui/Button";

export function generateStaticParams() {
  return getRentalCategories().map((cat) => ({
    categoria: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const cat = getRentalCategoryBySlug(categoria);
  if (!cat) {
    return buildPageMetadata({
      title: "Categoría no encontrada",
      description: "Catálogo de equipos VT Ingequipos",
      path: `/alquiler/${categoria}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${cat.name} en Alquiler y Venta | VT Ingequipos`,
    description: `${cat.name}: ${cat.shortDescription} Alquiler, venta y mantenimiento con VT Ingequipos (Grupo Coval).`,
    path: `/alquiler/${cat.slug}`,
    ogImagePath: "/vt-ingequipos/opengraph-image",
  });
}

export default async function RentalCategoryPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const cat = getRentalCategoryBySlug(categoria);
  if (!cat) notFound();

  const group = getGroupEntity();
  const categories = getRentalCategories();
  const items = getEquipmentByCategory(cat.slug);
  const whatsappHref = buildWhatsAppUrl({
    pathname: `/alquiler/${cat.slug}`,
    customMessage: `Hola VT Ingequipos, necesito cotizar equipos de la categoría ${cat.name} para mi obra.`,
  });

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${cat.name} — VT Ingequipos`,
    url: absoluteUrl(`/alquiler/${cat.slug}`),
    numberOfItems: items.length,
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      url: absoluteUrl(`/alquiler/${cat.slug}/${item.slug}`),
    })),
  };

  return (
    <div data-brand="ingequipos" className="w-full">
      <JsonLd data={itemListJsonLd} />

      <section className="relative flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between overflow-hidden bg-[var(--surface-page)] px-5 py-8 sm:px-10 lg:px-16 xl:px-20">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
            <Breadcrumbs
              items={[
                { name: "Grupo Coval", path: "/" },
                { name: "VT Ingequipos", path: "/vt-ingequipos" },
                { name: "Catálogo", path: "/alquiler" },
                { name: cat.name, path: `/alquiler/${cat.slug}` },
              ]}
            />
            <span className="font-mono text-xs font-semibold text-[var(--brand-primary)]">
              {items.length} equipos disponibles
            </span>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                VT Ingequipos · Categoría de equipos
              </p>
              <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-[var(--text-primary)] leading-[1.06]">
                {cat.name}
              </h1>
            </div>

            <div className="lg:col-span-5">
              <AnswerCapsule
                question={`¿Qué equipos incluye la ${cat.name} de VT Ingequipos?`}
                answer={`${cat.shortDescription} Disponibles para alquiler, venta y con soporte de mantenimiento técnico en el ${group.phoneDisplay}.`}
              />
            </div>
          </div>

          {/* Enlaces rápidos a las otras categorías */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-[var(--border-subtle)] py-4">
            <div className="flex flex-wrap gap-4 text-xs">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/alquiler/${c.slug}`}
                  className={
                    c.slug === cat.slug
                      ? "rounded-full bg-[var(--brand-primary)] px-3 py-1 font-semibold text-[var(--brand-on-primary)]"
                      : "py-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }
                >
                  {c.name}
                </Link>
              ))}
            </div>

            <Button href={whatsappHref} external variant="whatsapp" size="md">
              <PhoneCall aria-hidden="true" className="h-4 w-4" />
              <span>Cotizar por WhatsApp</span>
            </Button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.slug}
              className="group flex flex-col justify-between border-t border-[var(--border-subtle)] pt-5"
            >
              <Link
                href={`/alquiler/${cat.slug}/${item.slug}`}
                className="block"
              >
                {item.image && (
                  <div className="aspect-square w-full overflow-hidden bg-[var(--surface-muted)]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={604}
                      height={604}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                )}

                <h2 className="mt-4 text-lg font-bold text-[var(--text-primary)] leading-snug group-hover:underline underline-offset-4">
                  {item.name}
                </h2>
              </Link>

              <Link
                href={`/alquiler/${cat.slug}/${item.slug}`}
                className="mt-3 inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
              >
                <span>Ver especificaciones</span>
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
