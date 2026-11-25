import { NextResponse } from "next/server";
import {
  getAllEquipment,
  getCovalConcretosContent,
  getGroupEntity,
  getHomeContent,
  getIcoporesModuladoContent,
  getRentalCategories,
  getVtIngequiposContent,
} from "@/lib/content/repository";
import { getAllBlogPosts } from "@/lib/content/blog";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-static";

export function GET() {
  const group = getGroupEntity();
  const home = getHomeContent();
  const concretos = getCovalConcretosContent();
  const icopores = getIcoporesModuladoContent();
  const vt = getVtIngequiposContent();
  const categories = getRentalCategories();
  const equipmentCount = getAllEquipment().length;
  const posts = getAllBlogPosts();

  const lines = [
    `# ${group.groupName}`,
    "",
    `> ${group.summary}`,
    "",
    `- Sitio oficial: ${absoluteUrl("/")}`,
    `- Teléfono / WhatsApp comercial: ${group.phoneDisplay} (${group.phoneE164})`,
    `- Correo electrónico principal: ${group.email}`,
    `- Áreas de servicio: ${group.serviceAreas.join(", ")} (Colombia)`,
    "",
    "## Unidades de Negocio",
    "",
    `### 1. Coval Concretos (${absoluteUrl("/")})`,
    `- Planta automatizada: ${concretos.plant.location} (${concretos.plant.capacityM3Hour} m³/h · ${concretos.plant.mixersCount} mixers · respuesta por ronda ${concretos.plant.roundCapacityM3} m³).`,
    ...(concretos.trackRecord
      ? [
          `- Trayectoria reportada: +${concretos.trackRecord.yearsExperience} años · +${concretos.trackRecord.projectsCompleted} proyectos.`,
        ]
      : []),
    `- Líneas de concreto premezclado: ${concretos.concreteTypes.map((c) => c.name).join(", ")}.`,
    `- Servicios: Asistencia técnica en obra, bombeo estacionario y autobomba.`,
    "",
    `### 2. Icopores Modulador Tequendama — IMT (${absoluteUrl("/icopores-modulado")})`,
    `- Planta de fabricación EPS: ${icopores.about.address} · Correo: ${icopores.about.email}.`,
    `- Experiencia: +${icopores.stats.years} años en el sector constructor (98% aire atrapado, 100% reciclable).`,
    `- Productos: ${icopores.products.map((p) => p.name).join(", ")}.`,
    `- Herramienta: Estimador preliminar de casetones EPS en ${absoluteUrl("/icopores-modulado#estimador-casetones")}.`,
    "",
    `### 3. VT Ingequipos S.A.S. (${absoluteUrl("/vt-ingequipos")})`,
    `- Trayectoria: +${vt.stats.years} años fundada en Bogotá.`,
    `- Líneas de maquinaria en catálogo (${categories.length} categorías, ${equipmentCount} referencias): ${categories.map((c) => `${c.name} (${absoluteUrl(`/alquiler/${c.slug}`)})`).join(", ")}.`,
    `- Servicios especiales: ${vt.specialServices.map((s) => s.title).join(", ")}.`,
    `- Catálogo de alquiler y venta: ${absoluteUrl("/alquiler")}.`,
    "",
    "## Zonas de Cobertura",
    ...home.zonesOverview.map(
      (z) => `- ${z.name} (${absoluteUrl(z.href)}): ${z.distanceNote} — ${z.summary}`,
    ),
    "",
    "## Bitácora Técnica y Guías",
    ...posts.map(
      (post) => `- ${post.title} (${absoluteUrl(`/blog/${post.slug}`)}): ${post.summary}`,
    ),
    "",
    "## Contacto y Marco Legal",
    `- Contacto comercial y cotizaciones: ${absoluteUrl("/contacto")}`,
    `- Política de Privacidad (Ley 1581 de 2012): ${absoluteUrl("/legal/politica-privacidad")}`,
    `- Política de Cookies: ${absoluteUrl("/legal/politica-cookies")}`,
    `- Sitemap XML: ${absoluteUrl("/sitemap.xml")}`,
  ];

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
