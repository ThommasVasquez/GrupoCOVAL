import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PhoneCall, Wrench } from "lucide-react";
import {
  getAllEquipment,
  getEquipmentByCategory,
  getEquipmentBySlug,
  getGroupEntity,
  getImageDimensions,
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
  return getAllEquipment().map((item) => ({
    categoria: item.category,
    equipo: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string; equipo: string }>;
}) {
  const { categoria, equipo } = await params;
  const item = getEquipmentBySlug(categoria, equipo);
  const cat = getRentalCategoryBySlug(categoria);

  if (!item || !cat) {
    return buildPageMetadata({
      title: "Equipo no encontrado",
      description: "Catálogo VT Ingequipos",
      path: `/alquiler/${categoria}/${equipo}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${item.name} en Alquiler y Venta | ${cat.name} | VT Ingequipos`,
    description: `${item.name} disponible en alquiler, venta y mantenimiento con VT Ingequipos S.A.S. (Grupo Coval). Solicite disponibilidad para Bogotá, Soacha y Sibaté.`,
    path: `/alquiler/${cat.slug}/${item.slug}`,
    ogImagePath: "/vt-ingequipos/opengraph-image",
  });
}

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ categoria: string; equipo: string }>;
}) {
  const { categoria, equipo } = await params;
  const item = getEquipmentBySlug(categoria, equipo);
  const cat = getRentalCategoryBySlug(categoria);
  if (!item || !cat) notFound();

  const group = getGroupEntity();
  const related = getEquipmentByCategory(cat.slug)
    .filter((e) => e.slug !== item.slug)
    .slice(0, 4);

  const whatsappHref = buildWhatsAppUrl({
    pathname: `/alquiler/${cat.slug}/${item.slug}`,
    customMessage: `Hola VT Ingequipos, necesito cotizar alquiler/venta del equipo: ${item.name} (${cat.name}).`,
  });

  const imgDims = item.image ? getImageDimensions(item.image) : null;
  const specDims = item.specImage ? getImageDimensions(item.specImage) : null;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    category: cat.name,
    image: item.image ? absoluteUrl(item.image) : undefined,
    description: `${item.name} disponible para alquiler, venta y mantenimiento con VT Ingequipos S.A.S.`,
    brand: {
      "@type": "Brand",
      name: "VT Ingequipos",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "COP",
      url: absoluteUrl(`/alquiler/${cat.slug}/${item.slug}`),
      seller: {
        "@type": "LocalBusiness",
        "@id": `${absoluteUrl("/vt-ingequipos")}#business`,
        name: "VT Ingequipos S.A.S.",
      },
    },
  };

  return (
    <div data-brand="ingequipos" className="w-full">
      <JsonLd data={productJsonLd} />

      <section className="flex min-h-[calc(100dvh-6.25rem)] w-full flex-col justify-between bg-[var(--surface-page)] px-5 py-8 sm:px-10 lg:px-16 xl:px-20">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <Breadcrumbs
            items={[
              { name: "Grupo Coval", path: "/" },
              { name: "VT Ingequipos", path: "/vt-ingequipos" },
              { name: "Catálogo", path: "/alquiler" },
              { name: cat.name, path: `/alquiler/${cat.slug}` },
              { name: item.name, path: `/alquiler/${cat.slug}/${item.slug}` },
            ]}
          />

          <Link
            href={`/alquiler/${cat.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
            <span>Volver a {cat.name}</span>
          </Link>
        </div>

        <div className="my-auto py-10 grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          {/* Imagen del equipo */}
          <div className="lg:col-span-5">
            {item.image && imgDims && (
              <div className="aspect-square w-full overflow-hidden bg-[var(--surface-muted)]">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={imgDims.width}
                  height={imgDims.height}
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="h-full w-full object-contain p-6"
                />
              </div>
            )}
          </div>

          {/* Información y ficha técnica oficial */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                {cat.name} · VT Ingequipos S.A.S.
              </p>
              <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-[var(--text-primary)] leading-[1.06]">
                {item.name}
              </h1>
            </div>

            <AnswerCapsule
              question={`¿Cómo cotizar ${item.name} con VT Ingequipos?`}
              answer={`${item.name} forma parte de la ${cat.name} de VT Ingequipos S.A.S., disponible para alquiler, venta y soporte de mantenimiento técnico en Bogotá, Soacha y Sibaté. Solicite disponibilidad inmediata en el ${group.phoneDisplay}.`}
            />

            <div className="flex flex-wrap gap-3">
              <Button href={whatsappHref} external variant="whatsapp" size="lg">
                <PhoneCall aria-hidden="true" className="h-4 w-4" />
                <span>Cotizar por WhatsApp</span>
              </Button>
              <Button href="/contacto" variant="outline" size="lg">
                <Wrench aria-hidden="true" className="h-4 w-4" />
                <span>Solicitar cotización formal</span>
              </Button>
            </div>

            {/* Ficha oficial de especificaciones descargada de grupocoval.com.co */}
            {item.specImage && specDims && (
              <div className="border-t border-[var(--border-subtle)] pt-8">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)] mb-4">
                  Ficha técnica oficial del equipo
                </p>
                <div className="overflow-hidden border border-[var(--border-subtle)] bg-white p-2">
                  <Image
                    src={item.specImage}
                    alt={`Especificaciones técnicas de ${item.name}`}
                    width={specDims.width}
                    height={specDims.height}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Equipos relacionados de la misma línea */}
        {related.length > 0 && (
          <div className="border-t border-[var(--border-subtle)] pt-10">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Otros equipos de {cat.name}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/alquiler/${cat.slug}/${rel.slug}`}
                  className="group block border-t border-[var(--border-subtle)] pt-3"
                >
                  {rel.image && (
                    <div className="aspect-square w-full bg-[var(--surface-muted)]">
                      <Image
                        src={rel.image}
                        alt={rel.name}
                        width={604}
                        height={604}
                        sizes="(max-width: 1024px) 50vw, 24vw"
                        className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  )}
                  <p className="mt-3 text-sm font-semibold text-[var(--text-primary)] group-hover:underline underline-offset-4">
                    {rel.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
