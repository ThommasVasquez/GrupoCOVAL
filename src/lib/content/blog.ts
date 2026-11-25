export interface BlogPost {
  slug: string;
  category: "Coval Concretos" | "Icopores Modulado (IMT)" | "VT Ingequipos";
  brandHref: string;
  title: string;
  summary: string;
  publishedAt: string;
  readTime: string;
  keyQuestion: string;
  keyAnswer: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
}

const BLOG_POSTS: BlogPost[] = [
  {
    slug: "eleccion-concreto-premezclado-bombeable-mr-tremie",
    category: "Coval Concretos",
    brandHref: "/",
    title: "Cómo elegir entre concreto bombeable, módulo de rotura (MR), industrializado y tremie",
    summary:
      "Criterios técnicos según fichas de Coval Concretos: resistencias en kg/cm², asentamiento, edad de especificación y tiempo de fraguado para cada elemento estructural.",
    publishedAt: "2026-10-15",
    readTime: "4 min lectura",
    keyQuestion: "¿Qué diferencias clave existen entre las 4 líneas de concreto de Coval Concretos?",
    keyAnswer:
      "El Convencional–Bombeable facilita la colocación en altura o zonas de difícil acceso; el Módulo de Rotura (MR) se especifica por resistencia a la flexión para losas y pavimentos; el Industrializado ofrece fluidez para muros y sistemas constructivos rápidos; y el Tremie / Tornillo está formulado para pilotes y fundiciones profundas sin segregación.",
    sections: [
      {
        heading: "1. Concreto Convencional – Bombeable y asistencia de bombeo",
        paragraphs: [
          "Indicado para estructuras aporticadas, losas de entrepiso y puntos elevados donde se requiere bombear de manera continua mediante bomba estacionaria o autobomba.",
          "En las fichas técnicas de Coval Concretos se cubren resistencias desde 175 hasta 420 kg/cm² a 28 días, con tamaño máximo de agregado entre 1\" (25 mm) y 1/2\" (12,5 mm), asentamiento de 150 mm (6\") ± 25 mm y manejabilidad aproximada de 3 horas.",
        ],
      },
      {
        heading: "2. Módulo de Rotura (MR), Industrializado y Tremie / Tornillo",
        paragraphs: [
          "Para pavimentos rígidos y pisos industriales sometidos a flexotracción, el concreto MR prioriza la resistencia a la rotura por flexión.",
          "En sistemas industrializados de formaleta reutilizable o muros vaciados, el concreto Industrializado aporta mayor trabajabilidad y menor tiempo entre ciclos; mientras que para cimentaciones profundas bajo nivel freático, el concreto Tremie / Tornillo mantiene cohesión sin segregación durante el vaciado continuo.",
        ],
        bullets: [
          "Planta automatizada en Km 5 vía Bogotá–Girardot con capacidad de 45 m³/h.",
          "Flota operativa de 7 mixers con respuesta por ronda de 54 m³.",
          "Descarga directa de fichas técnicas en PDF desde la sección Matriz de Concretos en la portada.",
        ],
      },
    ],
  },
  {
    slug: "aligeramiento-losas-caseton-eps-unidireccional-reticular",
    category: "Icopores Modulado (IMT)",
    brandHref: "/icopores-modulado",
    title: "Aligeramiento de entrepisos con EPS: casetón modulado vs. casetón perdido",
    summary:
      "Cómo reducir el peso propio de la estructura y optimizar el rendimiento del concreto en forjados unidireccionales y reticulares usando poliestireno expandido.",
    publishedAt: "2026-10-22",
    readTime: "4 min lectura",
    keyQuestion: "¿Qué aporta el casetón de poliestireno expandido (EPS) en una losa aligerada?",
    keyAnswer:
      "El EPS está compuesto en un 98% por aire atrapado, es 100% reciclable y permite desplazar concreto en zonas no trabajantes de la sección, aligerando el peso propio del edificio y optimizando el consumo de mezcla.",
    sections: [
      {
        heading: "1. Función del casetón en obra",
        paragraphs: [
          "En Icopores Modulado (IMT), desde nuestra planta en el Kilómetro 14 vía Bogotá–Girardot, fabricamos tanto casetón modulado recuperable como casetón perdido para permanecer embebido dentro del forjado.",
          "Además de reducir cargas muertas en vigas y cimentaciones, las piezas en EPS aportan aislamiento térmico y acústico frente a soluciones convencionales de mayor densidad.",
        ],
      },
      {
        heading: "2. Forjado unidireccional vs. reticular y muro panel",
        paragraphs: [
          "El forjado unidireccional trabaja con viguetas paralelas apoyadas en vigas principales, ideal para luces regulares; el forjado reticular distribuye cargas en dos direcciones ortogonales mediante nervios y ábacos.",
          "Para complementar la reducción de peso, IMT también produce muro panel liviano con malla estructural y juntas de dilatación en EPS resistentes a la intemperie.",
        ],
        bullets: [
          "Acompañamiento técnico en anteproyectos de presupuesto, dirección, seguridad y certificados.",
          "Estimador preliminar de volumen EPS disponible en /icopores-modulado#estimador-casetones.",
        ],
      },
    ],
  },
  {
    slug: "encofrado-steel-ply-andamios-colgantes-control-obra",
    category: "VT Ingequipos",
    brandHref: "/vt-ingequipos",
    title: "Productividad en formaleta Steel-Ply, andamios colgantes e izaje en torre grúa",
    summary:
      "Buenas prácticas de obra con sistemas reutilizables de acero y contrachapado, plataformas suspendidas y accesorios certificados de VT Ingequipos S.A.S.",
    publishedAt: "2026-11-02",
    readTime: "5 min lectura",
    keyQuestion: "¿Por qué combinar formaleta Steel-Ply con accesorios dedicados de izaje y mantenimiento?",
    keyAnswer:
      "Los paneles Steel-Ply ofrecen hasta 200 usos antes de reemplazar su cara en madera contrachapada laminada, acelerando armado de muros y reduciendo desperdicios frente a la madera tradicional en obra.",
    sections: [
      {
        heading: "1. Formaleta modular Steel-Ply hasta 200 usos",
        paragraphs: [
          "A diferencia del encofrado artesanal cortado en obra, el sistema Steel-Ply combina bastidores de acero y madera contrachapada laminada en dimensiones estandarizadas que ensamblan muros rectos, columnas y detalles arquitectónicos en menos tiempo.",
        ],
      },
      {
        heading: "2. Trabajo seguro en alturas e izaje continuo",
        paragraphs: [
          "VT Ingequipos complementa el alquiler de maquinaria (líneas eléctrica, diésel/gasolina, general, maquinaria pesada, multifuncional y limpieza) con andamios colgantes desde 1,30 metros, bombas de concreto, alquiler de mixer y accesorios para torre grúa como plataformas de descarga, baldes autodescargables, canastas para estibas, eslingas de nylon y estrobos.",
        ],
        bullets: [
          "Más de 20 años de respaldo técnico en Bogotá y municipios aledaños.",
          "Servicio integral de entrega, venta, alquiler, mantenimiento y reparación en el +57 316 2948000.",
        ],
      },
    ],
  },
];

export function getAllBlogPosts(): BlogPost[] {
  return BLOG_POSTS;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
