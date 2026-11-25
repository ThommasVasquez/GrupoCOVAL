import { z } from "zod";

export const BrandIdSchema = z.enum([
  "grupo",
  "concretos",
  "ingequipos",
  "icopores",
]);

export type BrandId = z.infer<typeof BrandIdSchema>;

export const ImageAssetSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export type ImageAsset = z.infer<typeof ImageAssetSchema>;

export const CompanySummarySchema = z.object({
  id: z.enum(["concretos", "ingequipos", "icopores"]),
  slug: z.string(),
  name: z.string(),
  shortName: z.string(),
  href: z.string(),
  badge: z.string(),
  headline: z.string(),
  summary: z.string(),
  address: z.string(),
  experienceLabel: z.string(),
  foundedLabel: z.string().optional(),
  heroImage: z.string().optional(),
  logo: ImageAssetSchema.optional(),
  highlights: z.array(z.string()),
});

export type CompanySummary = z.infer<typeof CompanySummarySchema>;

export const GroupEntitySchema = z.object({
  groupName: z.string(),
  legalName: z.string(),
  taxId: z.string(),
  domain: z.string().url(),
  tagline: z.string(),
  summary: z.string(),
  phoneDisplay: z.string(),
  phoneE164: z.string(),
  whatsappNumber: z.string(),
  email: z.string(),
  privacyEmail: z.string(),
  logo: ImageAssetSchema.optional(),
  headquarters: z.object({
    streetAddress: z.string(),
    addressLocality: z.string(),
    addressRegion: z.string(),
    postalCode: z.string(),
    addressCountry: z.literal("CO"),
  }),
  openingHours: z.string(),
  serviceAreas: z.array(z.string()),
  socialLinks: z.array(z.string()),
  companies: z.array(CompanySummarySchema).length(3),
});

export type GroupEntity = z.infer<typeof GroupEntitySchema>;

export const NavItemSchema = z.object({
  label: z.string(),
  href: z.string(),
  brand: BrandIdSchema.optional(),
  description: z.string().optional(),
});

export type NavItem = z.infer<typeof NavItemSchema>;

export const NavigationSchema = z.object({
  primaryNav: z.array(NavItemSchema),
  quickTools: z.array(NavItemSchema),
  zonesNav: z.array(NavItemSchema),
  legalNav: z.array(NavItemSchema),
});

export type NavigationData = z.infer<typeof NavigationSchema>;

export const FaqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export type FaqItem = z.infer<typeof FaqItemSchema>;

export const TechnicalSheetSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: BrandIdSchema,
  category: z.string(),
  fileUrl: z.string(),
  fileSizeLabel: z.string(),
  statusNote: z.string().optional(),
});

export type TechnicalSheet = z.infer<typeof TechnicalSheetSchema>;

export const ScrollyStageSchema = z.object({
  stepCode: z.string(),
  brand: BrandIdSchema,
  badge: z.string(),
  title: z.string(),
  description: z.string(),
  metrics: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
  primaryCta: z.object({
    label: z.string(),
    href: z.string(),
  }),
  secondaryCta: z.object({
    label: z.string(),
    href: z.string(),
  }),
  layerTarget: z.enum(["all", "foundation", "machinery", "slabs"]),
});

export type ScrollyStage = z.infer<typeof ScrollyStageSchema>;

export const SynergyRowSchema = z.object({
  stage: z.string(),
  concretos: z.string(),
  ingequipos: z.string(),
  icopores: z.string(),
});

export type SynergyRow = z.infer<typeof SynergyRowSchema>;

export const HomeContentSchema = z.object({
  hero: z.object({
    eyebrow: z.string(),
    h1: z.string(),
    geoQuestion: z.string(),
    geoAnswer: z.string(),
  }),
  scrollyStages: z.array(ScrollyStageSchema).min(4),
  synergyMatrix: z.array(SynergyRowSchema),
  zonesOverview: z.array(
    z.object({
      slug: z.string(),
      name: z.string(),
      href: z.string(),
      distanceNote: z.string(),
      summary: z.string(),
    }),
  ),
  faqs: z.array(FaqItemSchema),
});

export type HomeContent = z.infer<typeof HomeContentSchema>;

export const ConcreteMixSchema = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  image: z.string(),
  pdfUrl: z.string(),
  pdfTitle: z.string(),
  strengths: z.string(),
  specAge: z.string(),
  maxAggregate: z.string(),
  workability: z.string(),
  slump: z.string(),
  settingTime: z.string(),
  densityOrAir: z.string(),
  applications: z.string(),
});

export type ConcreteMix = z.infer<typeof ConcreteMixSchema>;

export const PumpingOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  recommendedFor: z.string(),
  images: z.array(z.string()),
});

export type PumpingOption = z.infer<typeof PumpingOptionSchema>;

export const CovalConcretosSchema = z.object({
  seo: z.object({
    title: z.string(),
    description: z.string(),
  }),
  hero: z.object({
    eyebrow: z.string(),
    h1: z.string(),
    geoQuestion: z.string(),
    geoAnswer: z.string(),
    heroImage: z.string(),
  }),
  about: z.object({
    foundedText: z.string(),
    mission: z.string(),
    objectives: z.array(z.string()),
  }),
  trackRecord: z
    .object({
      yearsExperience: z.number(),
      projectsCompleted: z.number(),
      satisfactionPercent: z.number(),
    })
    .optional(),
  allies: z
    .object({
      image: z.string(),
      names: z.array(z.string()),
    })
    .optional(),
  plant: z.object({
    location: z.string(),
    type: z.string(),
    capacityM3Hour: z.number(),
    mixersCount: z.number(),
    roundCapacityM3: z.number(),
    gallery: z.array(
      z.object({
        src: z.string(),
        alt: z.string(),
      }),
    ),
  }),
  concreteTypes: z.array(ConcreteMixSchema),
  pumpingServices: z.array(PumpingOptionSchema),
  sheets: z.array(TechnicalSheetSchema),
  projectGallery: z.array(
    z.object({
      src: z.string(),
      alt: z.string(),
    }),
  ),
  faqs: z.array(FaqItemSchema),
});

export type CovalConcretosContent = z.infer<typeof CovalConcretosSchema>;

export const RentalSpecialServiceSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  details: z.array(z.string()),
  images: z.array(z.string()),
});

export type RentalSpecialService = z.infer<typeof RentalSpecialServiceSchema>;

export const VtIngequiposSchema = z.object({
  seo: z.object({
    title: z.string(),
    description: z.string(),
  }),
  hero: z.object({
    eyebrow: z.string(),
    h1: z.string(),
    geoQuestion: z.string(),
    geoAnswer: z.string(),
    heroImage: z.string(),
  }),
  about: z.object({
    whoWeAre: z.string(),
    mission: z.string(),
    vision: z.string().optional(),
    qualityPolicy: z.string(),
  }),
  stats: z.object({
    years: z.number(),
    lines: z.number(),
    steelPlyUses: z.number(),
  }),
  specialServices: z.array(RentalSpecialServiceSchema),
  clients: z
    .object({
      names: z.array(z.string()),
      strips: z.array(
        z.object({
          dark: z.string(),
          light: z.string(),
          alt: z.string(),
        }),
      ),
    })
    .optional(),
  allies: z
    .object({
      names: z.array(z.string()),
      dark: z.string(),
      light: z.string(),
      alt: z.string(),
    })
    .optional(),
  faqs: z.array(FaqItemSchema),
});

export type VtIngequiposContent = z.infer<typeof VtIngequiposSchema>;

export const RentalCategorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  shortDescription: z.string(),
  coverImage: z.string(),
});

export type RentalCategory = z.infer<typeof RentalCategorySchema>;

export const EquipmentItemSchema = z.object({
  slug: z.string(),
  legacySlug: z.string(),
  name: z.string(),
  category: z.string(),
  image: z.string().nullable(),
  specImage: z.string().nullable().optional(),
  summary: z.string().nullable(),
  description: z.string().nullable(),
});

export type EquipmentItem = z.infer<typeof EquipmentItemSchema>;

export const IcoporesProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  applicationNote: z.string(),
  image: z.string(),
});

export type IcoporesProduct = z.infer<typeof IcoporesProductSchema>;

export const EpsBenefitSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

export type EpsBenefit = z.infer<typeof EpsBenefitSchema>;

export const SlabSystemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export type SlabSystem = z.infer<typeof SlabSystemSchema>;

export const IcoporesModuladoSchema = z.object({
  seo: z.object({
    title: z.string(),
    description: z.string(),
  }),
  hero: z.object({
    eyebrow: z.string(),
    h1: z.string(),
    geoQuestion: z.string(),
    geoAnswer: z.string(),
    heroImage: z.string(),
  }),
  about: z.object({
    experienceSummary: z.string(),
    address: z.string(),
    phoneDisplay: z.string(),
    email: z.string(),
    expertisePillars: z.array(z.string()),
    galleryImages: z.array(
      z.object({
        src: z.string(),
        alt: z.string(),
      }),
    ),
  }),
  stats: z.object({
    years: z.number(),
    airPercentage: z.number(),
    recyclablePercentage: z.number(),
  }),
  products: z.array(IcoporesProductSchema),
  slabSystemsIntro: z.string(),
  slabSystems: z.array(SlabSystemSchema),
  benefits: z.array(EpsBenefitSchema),
  faqs: z.array(FaqItemSchema),
});

export type IcoporesModuladoContent = z.infer<typeof IcoporesModuladoSchema>;
