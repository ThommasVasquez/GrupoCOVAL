export interface SubNavItem {
  label: string;
  href: string;
  sectionId?: string;
}

export interface PageSubNavConfig {
  items: SubNavItem[];
  cta?: {
    label: string;
    href?: string;
    modalAction?: "open-concrete-calculator";
  };
}

/**
 * Devuelve la barra de navegación específica de cada página o unidad de negocio
 * mostrada debajo de la línea divisoria del encabezado general.
 */
export function getPageSubNav(pathname: string): PageSubNavConfig {
  if (pathname === "/") {
    return {
      items: [
        { label: "Inicio", href: "/#inicio", sectionId: "inicio" },
        { label: "Propuesta", href: "/#propuesta", sectionId: "propuesta" },
        { label: "Empresa y Planta", href: "/#empresa", sectionId: "empresa" },
        { label: "Concretos", href: "/#lineas", sectionId: "lineas" },
        { label: "Fichas Técnicas", href: "/#fichas", sectionId: "fichas" },
        { label: "Bombeo", href: "/#bombeo", sectionId: "bombeo" },
        { label: "Obras y Aliados", href: "/#trayectoria", sectionId: "trayectoria" },
      ],
      cta: { label: "Calcular m³", modalAction: "open-concrete-calculator" },
    };
  }

  if (pathname.startsWith("/vt-ingequipos")) {
    return {
      items: [
        { label: "Inicio", href: "/vt-ingequipos#inicio", sectionId: "inicio" },
        { label: "Propuesta", href: "/vt-ingequipos#propuesta", sectionId: "propuesta" },
        { label: "6 Líneas", href: "/vt-ingequipos#lineas", sectionId: "lineas" },
        { label: "Steel-Ply y Grúas", href: "/vt-ingequipos#sistemas", sectionId: "sistemas" },
        { label: "Andamios y Taller", href: "/vt-ingequipos#altura", sectionId: "altura" },
        { label: "Empresa", href: "/vt-ingequipos#empresa", sectionId: "empresa" },
        { label: "Clientes y Aliados", href: "/vt-ingequipos#respaldo", sectionId: "respaldo" },
      ],
      cta: { label: "Catálogo (64)", href: "/alquiler" },
    };
  }

  if (pathname.startsWith("/alquiler")) {
    return {
      items: [
        { label: "Todas", href: "/alquiler" },
        { label: "Eléctrica", href: "/alquiler/linea-electrica" },
        { label: "Diésel | Gasolina", href: "/alquiler/linea-diesel-gasolina" },
        { label: "General", href: "/alquiler/linea-general" },
        { label: "Maquinaria Pesada", href: "/alquiler/linea-maquinaria-pesada" },
        { label: "Multifuncional", href: "/alquiler/linea-multifuncional" },
        { label: "Limpieza", href: "/alquiler/linea-limpieza" },
      ],
      cta: { label: "Ir a VT Ingequipos", href: "/vt-ingequipos" },
    };
  }

  if (pathname.startsWith("/icopores-modulado")) {
    return {
      items: [
        { label: "Inicio", href: "/icopores-modulado#inicio", sectionId: "inicio" },
        { label: "Propuesta", href: "/icopores-modulado#propuesta", sectionId: "propuesta" },
        { label: "Productos EPS", href: "/icopores-modulado#productos", sectionId: "productos" },
        { label: "Forjados EPS", href: "/icopores-modulado#forjados", sectionId: "forjados" },
        { label: "Beneficios", href: "/icopores-modulado#beneficios", sectionId: "beneficios" },
        { label: "Sinergia Km 14", href: "/icopores-modulado#sinergia", sectionId: "sinergia" },
      ],
      cta: { label: "Cotizar EPS", href: "/contacto" },
    };
  }

  return {
    items: [
      { label: "Coval Concretos", href: "/" },
      { label: "Icopores Modulado", href: "/icopores-modulado" },
      { label: "VT Ingequipos", href: "/vt-ingequipos" },
    ],
    cta: { label: "Contacto directo", href: "/contacto" },
  };
}
