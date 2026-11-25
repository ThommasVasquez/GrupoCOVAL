import { getGroupEntity } from "@/lib/content/repository";
import type { FaqItem } from "@/lib/content/schemas";
import { absoluteUrl } from "@/lib/utils";

export interface BreadcrumbEntry {
  name: string;
  path: string;
}

/**
 * Organization raíz con sus 3 subOrganizations conectadas mediante @id estables
 * para máxima desambiguación de entidades en Google y motores generativos (GEO).
 */
export function buildGroupOrganizationJsonLd() {
  const group = getGroupEntity();
  const orgId = `${absoluteUrl("/")}#organization`;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: group.groupName,
    url: absoluteUrl("/"),
    description: group.summary,
    telephone: group.phoneE164,
    areaServed: group.serviceAreas.map((city) => ({
      "@type": "City",
      name: city,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Cundinamarca, Colombia",
      },
    })),
    address: {
      "@type": "PostalAddress",
      streetAddress: group.headquarters.streetAddress,
      addressLocality: group.headquarters.addressLocality,
      addressRegion: group.headquarters.addressRegion,
      addressCountry: group.headquarters.addressCountry,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: group.phoneE164,
        contactType: "sales",
        areaServed: "CO",
        availableLanguage: ["es"],
      },
    ],
    subOrganization: group.companies.map((company) => ({
      "@type": "LocalBusiness",
      "@id": `${absoluteUrl(company.href)}#business`,
      name: company.name,
      url: absoluteUrl(company.href),
      description: company.summary,
      telephone: group.phoneE164,
      parentOrganization: { "@id": orgId },
      address: {
        "@type": "PostalAddress",
        streetAddress: company.address,
        addressRegion: "Cundinamarca",
        addressCountry: "CO",
      },
      areaServed: group.serviceAreas.map((city) => ({
        "@type": "City",
        name: city,
      })),
    })),
  };
}

export function buildCompanyLocalBusinessJsonLd(
  companyId: "concretos" | "ingequipos" | "icopores",
) {
  const group = getGroupEntity();
  const company = group.companies.find((c) => c.id === companyId);
  if (!company) {
    throw new Error(`Unidad no encontrada: ${companyId}`);
  }

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${absoluteUrl(company.href)}#business`,
    name: company.name,
    url: absoluteUrl(company.href),
    description: company.summary,
    telephone: group.phoneE164,
    priceRange: "$$",
    parentOrganization: {
      "@type": "Organization",
      "@id": `${absoluteUrl("/")}#organization`,
      name: group.groupName,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address,
      addressRegion: "Cundinamarca",
      addressCountry: "CO",
    },
    areaServed: group.serviceAreas.map((city) => ({
      "@type": "City",
      name: city,
    })),
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildFaqPageJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
