import groupRaw from "@content/global/group.json";
import navigationRaw from "@content/global/navigation.json";
import homeRaw from "@content/global/home.json";
import concretosRaw from "@content/companies/coval-concretos.json";
import vtIngequiposRaw from "@content/companies/vt-ingequipos.json";
import icoporesRaw from "@content/companies/icopores-modulado.json";
import categoriasRaw from "@content/catalog/categorias-alquiler.json";
import equiposRaw from "@content/catalog/equipos.json";
import mediaManifestRaw from "@content/media-manifest.json";
import {
  GroupEntitySchema,
  NavigationSchema,
  HomeContentSchema,
  CovalConcretosSchema,
  VtIngequiposSchema,
  IcoporesModuladoSchema,
  RentalCategorySchema,
  EquipmentItemSchema,
  type BrandId,
  type CompanySummary,
  type GroupEntity,
  type NavigationData,
  type HomeContent,
  type CovalConcretosContent,
  type VtIngequiposContent,
  type IcoporesModuladoContent,
  type RentalCategory,
  type EquipmentItem,
} from "./schemas";

/**
 * Capa de acceso a datos desacoplada.
 * Hoy valida y sirve JSON/MDX local; mañana puede conectarse a un Headless CMS
 * (Sanity, Payload, Strapi o Directus) manteniendo intactos los contratos TypeScript.
 */
const parsedGroup = GroupEntitySchema.parse(groupRaw);
const parsedNavigation = NavigationSchema.parse(navigationRaw);
const parsedHome = HomeContentSchema.parse(homeRaw);
const parsedConcretos = CovalConcretosSchema.parse(concretosRaw);
const parsedVt = VtIngequiposSchema.parse(vtIngequiposRaw);
const parsedIcopores = IcoporesModuladoSchema.parse(icoporesRaw);
const parsedCategories = RentalCategorySchema.array().parse(categoriasRaw);
const parsedEquipos = EquipmentItemSchema.array().parse(equiposRaw);
const mediaManifest = mediaManifestRaw as Record<
  string,
  { width: number; height: number }
>;

export function getGroupEntity(): GroupEntity {
  return parsedGroup;
}

export function getNavigationData(): NavigationData {
  return parsedNavigation;
}

export function getHomeContent(): HomeContent {
  return parsedHome;
}

export function getCovalConcretosContent(): CovalConcretosContent {
  return parsedConcretos;
}

export function getVtIngequiposContent(): VtIngequiposContent {
  return parsedVt;
}

export function getIcoporesModuladoContent(): IcoporesModuladoContent {
  return parsedIcopores;
}

export function getRentalCategories(): RentalCategory[] {
  return parsedCategories;
}

export function getRentalCategoryBySlug(slug: string): RentalCategory | null {
  return parsedCategories.find((cat) => cat.slug === slug) ?? null;
}

export function getAllEquipment(): EquipmentItem[] {
  return parsedEquipos;
}

export function getEquipmentByCategory(categorySlug: string): EquipmentItem[] {
  return parsedEquipos.filter((item) => item.category === categorySlug);
}

export function getEquipmentBySlug(
  categorySlug: string,
  equipmentSlug: string,
): EquipmentItem | null {
  return (
    parsedEquipos.find(
      (item) => item.category === categorySlug && item.slug === equipmentSlug,
    ) ?? null
  );
}

export function getImageDimensions(src: string): {
  width: number;
  height: number;
} {
  return mediaManifest[src] ?? { width: 1200, height: 800 };
}

export function getCompanyByBrand(
  brand: Exclude<BrandId, "grupo">,
): CompanySummary {
  const company = parsedGroup.companies.find((item) => item.id === brand);
  if (!company) {
    throw new Error(`No se encontró configuración para la unidad: ${brand}`);
  }
  return company;
}

export function resolveBrandFromPathname(pathname: string): BrandId {
  if (
    pathname === "/" ||
    pathname.startsWith("/coval-concretos") ||
    pathname.startsWith("/cotizador-concreto")
  ) {
    return "concretos";
  }
  if (
    pathname.startsWith("/vt-ingequipos") ||
    pathname.startsWith("/alquiler")
  ) {
    return "ingequipos";
  }
  if (pathname.startsWith("/icopores-modulado")) {
    return "icopores";
  }
  return "grupo";
}
