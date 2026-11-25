export type ConcreteShapeId =
  | "cubo-losa"
  | "columna"
  | "tubo"
  | "pared"
  | "cimientos-corridos"
  | "escaleras";

export type LengthUnit = "m" | "cm" | "mm";

export interface DimensionValue {
  amount: string;
  unit: LengthUnit;
}

export interface ConcreteShapeItem {
  id: string;
  label: string; // "Forma A", "Forma B", ...
  shape: ConcreteShapeId;
  quantity: number;
  dims: Record<string, DimensionValue>;
}

export interface ShapeFieldSpec {
  key: string;
  label: string;
  defaultUnit: LengthUnit;
  placeholder: string;
  symbol: string;
}

export interface ShapeDefinition {
  id: ConcreteShapeId;
  name: string;
  shortName: string;
  formulaLabel: string;
  helperNote: string;
  fields: ShapeFieldSpec[];
}

export const SHAPE_DEFINITIONS: ShapeDefinition[] = [
  {
    id: "cubo-losa",
    name: "Cubo / Losa",
    shortName: "Cubo / Losa",
    formulaLabel: "V = L × A × H",
    helperNote: "Losas de entrepiso, placas macizas, zapatas cuadradas o dados.",
    fields: [
      { key: "length", label: "Longitud", defaultUnit: "m", placeholder: "4.0", symbol: "L" },
      { key: "width", label: "Ancho", defaultUnit: "m", placeholder: "3.0", symbol: "A" },
      { key: "height", label: "Altura / Espesor", defaultUnit: "cm", placeholder: "15", symbol: "H" },
    ],
  },
  {
    id: "columna",
    name: "Columna circular",
    shortName: "Columna",
    formulaLabel: "V = π × (Ø / 2)² × H",
    helperNote: "Pilotes cilíndricos, columnas circulares o caissons.",
    fields: [
      { key: "diameter", label: "Diámetro", defaultUnit: "m", placeholder: "0.45", symbol: "Ø" },
      { key: "height", label: "Altura", defaultUnit: "cm", placeholder: "300", symbol: "H" },
    ],
  },
  {
    id: "tubo",
    name: "Tubo / Anillo",
    shortName: "Tubo",
    formulaLabel: "V = π × ((Øe / 2)² − (Øi / 2)²) × H",
    helperNote: "Cilindros huecos, anillos estructurales o pozos.",
    fields: [
      { key: "outerDiameter", label: "Diámetro exterior", defaultUnit: "m", placeholder: "1.2", symbol: "Øe" },
      { key: "innerDiameter", label: "Diámetro interior", defaultUnit: "m", placeholder: "0.9", symbol: "Øi" },
      { key: "height", label: "Altura / Longitud", defaultUnit: "cm", placeholder: "200", symbol: "H" },
    ],
  },
  {
    id: "pared",
    name: "Pared / Muro",
    shortName: "Pared",
    formulaLabel: "V = A × L × H",
    helperNote: "Muros pantalla, muros de contención o muros estructurales.",
    fields: [
      { key: "width", label: "Espesor / Ancho", defaultUnit: "cm", placeholder: "15", symbol: "A" },
      { key: "length", label: "Longitud", defaultUnit: "m", placeholder: "6.0", symbol: "L" },
      { key: "height", label: "Altura", defaultUnit: "m", placeholder: "2.6", symbol: "H" },
    ],
  },
  {
    id: "cimientos-corridos",
    name: "Cimientos corridos",
    shortName: "Cimientos corridos",
    formulaLabel: "V = (Le × Ae − Li × Ai) × P",
    helperNote: "Anillo perimetral de vigas de cimentación o cimiento continuo.",
    fields: [
      { key: "outerLength", label: "Longitud exterior", defaultUnit: "m", placeholder: "10.0", symbol: "Le" },
      { key: "outerWidth", label: "Ancho exterior", defaultUnit: "m", placeholder: "8.0", symbol: "Ae" },
      { key: "innerLength", label: "Longitud interior", defaultUnit: "m", placeholder: "9.2", symbol: "Li" },
      { key: "innerWidth", label: "Ancho interior", defaultUnit: "m", placeholder: "7.2", symbol: "Ai" },
      { key: "depth", label: "Profundidad / Altura", defaultUnit: "cm", placeholder: "40", symbol: "P" },
    ],
  },
  {
    id: "escaleras",
    name: "Escaleras",
    shortName: "Escaleras",
    formulaLabel: "V = N × A × [(r·t)/2 + g·√(r²+t²)]",
    helperNote: "Tramo recto de escalera estructural según huella, contrahuella y garganta.",
    fields: [
      { key: "width", label: "Ancho", defaultUnit: "m", placeholder: "1.2", symbol: "A" },
      { key: "rise", label: "Contrahuella (elevación paso)", defaultUnit: "cm", placeholder: "18", symbol: "r" },
      { key: "run", label: "Huella (avance paso)", defaultUnit: "cm", placeholder: "28", symbol: "t" },
      { key: "throat", label: "Espesor de losa / plataforma", defaultUnit: "cm", placeholder: "15", symbol: "g" },
    ],
  },
];

export const UNIT_FACTORS: Record<LengthUnit, number> = {
  m: 1,
  cm: 0.01,
  mm: 0.001,
};

export function toMeters(dim: DimensionValue | undefined): number {
  if (!dim) return 0;
  const normalized = dim.amount.replace(",", ".").trim();
  const val = Number.parseFloat(normalized);
  if (!Number.isFinite(val) || val < 0) return 0;
  return val * UNIT_FACTORS[dim.unit];
}

export interface ComputedShapeResult {
  rawVolumeM3: number;
  roundedVolumeM3: number;
  validationError: string | null;
}

/**
 * Redondeo práctico hacia arriba al múltiplo de 0.5 m³ más cercano
 * (mismo criterio estándar empleado en despacho de concreto premezclado).
 */
export function roundUpHalfCubicMeter(m3: number): number {
  if (m3 <= 0) return 0;
  return Math.ceil(m3 * 2 - 1e-9) / 2;
}

export function createDefaultDims(shape: ConcreteShapeId): Record<string, DimensionValue> {
  const def = SHAPE_DEFINITIONS.find((s) => s.id === shape) ?? SHAPE_DEFINITIONS[0]!;
  const dims: Record<string, DimensionValue> = {};
  for (const field of def.fields) {
    dims[field.key] = { amount: "", unit: field.defaultUnit };
  }
  if (shape === "escaleras") {
    dims.steps = { amount: "10", unit: "m" };
  }
  return dims;
}

export function computeShapeVolume(item: ConcreteShapeItem): ComputedShapeResult {
  const qty = Math.max(1, Math.floor(item.quantity || 1));
  let unitVolume = 0;
  let validationError: string | null = null;

  switch (item.shape) {
    case "cubo-losa": {
      const l = toMeters(item.dims.length);
      const w = toMeters(item.dims.width);
      const h = toMeters(item.dims.height);
      unitVolume = l * w * h;
      break;
    }
    case "columna": {
      const d = toMeters(item.dims.diameter);
      const h = toMeters(item.dims.height);
      unitVolume = Math.PI * (d / 2) ** 2 * h;
      break;
    }
    case "tubo": {
      const doM = toMeters(item.dims.outerDiameter);
      const diM = toMeters(item.dims.innerDiameter);
      const h = toMeters(item.dims.height);
      if (doM > 0 && diM >= doM) {
        validationError = "El diámetro exterior debe ser mayor que el interior.";
      } else {
        unitVolume = Math.PI * ((doM / 2) ** 2 - (diM / 2) ** 2) * h;
      }
      break;
    }
    case "pared": {
      const w = toMeters(item.dims.width);
      const l = toMeters(item.dims.length);
      const h = toMeters(item.dims.height);
      unitVolume = w * l * h;
      break;
    }
    case "cimientos-corridos": {
      const lo = toMeters(item.dims.outerLength);
      const wo = toMeters(item.dims.outerWidth);
      const li = toMeters(item.dims.innerLength);
      const wi = toMeters(item.dims.innerWidth);
      const p = toMeters(item.dims.depth);
      const outerArea = lo * wo;
      const innerArea = li * wi;
      if (outerArea > 0 && (li >= lo || wi >= wo)) {
        validationError =
          "Las dimensiones exteriores deben superar a las interiores.";
      } else {
        unitVolume = Math.max(0, outerArea - innerArea) * p;
      }
      break;
    }
    case "escaleras": {
      const w = toMeters(item.dims.width);
      const r = toMeters(item.dims.rise);
      const t = toMeters(item.dims.run);
      const g = toMeters(item.dims.throat);
      const stepsRaw = Number.parseInt(item.dims.steps?.amount ?? "0", 10);
      const n = Number.isFinite(stepsRaw) && stepsRaw > 0 ? stepsRaw : 0;
      if (w > 0 && r > 0 && t > 0 && n > 0) {
        const stepArea = (r * t) / 2;
        const slopedThroat = g * Math.sqrt(r * r + t * t);
        unitVolume = w * n * (stepArea + slopedThroat);
      }
      break;
    }
  }

  const rawVolumeM3 = Math.max(0, unitVolume * qty);
  return {
    rawVolumeM3,
    roundedVolumeM3: roundUpHalfCubicMeter(rawVolumeM3),
    validationError,
  };
}

export interface CovalMixOption {
  id: string;
  name: string;
  strengthChoices: string[];
  unitNote: string;
}

/**
 * Opciones verificadas directamente en las fichas técnicas de Coval Concretos
 * (content/companies/coval-concretos.json).
 */
export const COVAL_MIX_OPTIONS: CovalMixOption[] = [
  {
    id: "convencional-bombeable",
    name: "Convencional – Bombeable",
    strengthChoices: [
      "175 kg/cm² (2500 PSI)",
      "210 kg/cm² (3000 PSI)",
      "245 kg/cm² (3500 PSI)",
      "280 kg/cm² (4000 PSI)",
      "315 kg/cm² (4500 PSI)",
      "350 kg/cm² (5000 PSI)",
      "385 kg/cm² (5500 PSI)",
      "420 kg/cm² (6000 PSI)",
    ],
    unitNote: "Edad 28 días · Asentamiento 150 mm (6\")",
  },
  {
    id: "modulo-rotura-mr",
    name: "Módulo de Rotura (MR)",
    strengthChoices: [
      "MR 36 kg/cm²",
      "MR 39 kg/cm²",
      "MR 41 kg/cm²",
      "MR 43 kg/cm²",
      "MR 45 kg/cm²",
      "MR 50 kg/cm²",
    ],
    unitNote: "Flexión NTC 2871 · Pisos y losas industriales",
  },
  {
    id: "industrializado",
    name: "Industrializados",
    strengthChoices: [
      "210 kg/cm² (Muro / Placa)",
      "245 kg/cm² (Muro / Placa)",
      "280 kg/cm² (Muro / Placa)",
      "315 kg/cm² (Muro / Placa)",
      "350 kg/cm² (Muro / Placa)",
      "385 kg/cm² (Muro / Placa)",
      "420 kg/cm² (Muro / Placa)",
    ],
    unitNote: "Resistencia temprana 14–18 h · Muro 8\" / Placa 6\"",
  },
  {
    id: "tremie-tornillo",
    name: "Tremie / Tornillo",
    strengthChoices: [
      "210 kg/cm² (Cimentación)",
      "245 kg/cm² (Cimentación)",
      "280 kg/cm² (Cimentación)",
      "315 kg/cm² (Cimentación)",
      "350 kg/cm² (Cimentación)",
      "385 kg/cm² (Cimentación)",
      "420 kg/cm² (Cimentación)",
    ],
    unitNote: "Cimentaciones profundas · Flujo / Asentamiento 8\"–10\"",
  },
];

export const PUMPING_MODES = [
  { id: "directa", label: "Descarga directa (Canaleta mixer)" },
  { id: "estacionaria", label: "Bombeo estacionario (tubería)" },
  { id: "autobomba", label: "Autobomba (brazo articulado)" },
] as const;
