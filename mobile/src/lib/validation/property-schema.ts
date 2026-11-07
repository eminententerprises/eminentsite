import { z } from "zod";

export const PROPERTY_TYPES = [
  "House",
  "Upper Portion",
  "Lower Portion",
  "Flat/Apartment",
  "Penthouse",
  "Farm House",
  "Residential Plot",
  "Commercial Plot",
  "Plot File",
  "Agricultural Land",
  "Shop",
  "Office",
  "Warehouse",
  "Building",
  "Factory",
] as const;

export const APPROVAL_STATUSES = ["CDA Approved", "RDA Approved", "Approval Pending", "Not Applicable"] as const;
export const POSSESSION_STATUSES = ["Ready", "Under Development", "Balloted"] as const;
export const PLOT_DOCUMENTATION = ["Plot File", "Registry", "Not Applicable"] as const;
export const WATER_SOURCES = ["Boring", "Tanker", "Supply Line", "Boring + Supply"] as const;
export const AREA_UNITS = ["marla", "kanal", "sqft", "sqyd"] as const;
export const CITY_KEYS = ["islamabad", "rawalpindi", "hills"] as const;

const imageSchema = z.object({
  src: z.string().trim().url("Must be a valid image URL"),
  alt: z.string().trim().min(1, "Add alt text"),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const floorPlanSchema = z.object({
  src: z.string().trim().url("Must be a valid image URL"),
  alt: z.string().trim().min(1, "Add alt text"),
  label: z.string().trim().min(1, "Add a label, e.g. Ground Floor"),
});

export const propertyFormSchema = z.object({
  purpose: z.enum(["buy", "rent"]),
  type: z.enum(PROPERTY_TYPES),
  title: z.string().trim().min(5, "Title should be at least 5 characters"),
  ref: z.string().trim().min(2, "Enter a reference code, e.g. EE-1042"),
  slug: z
    .string()
    .trim()
    .min(3, "Slug should be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  description: z.string().trim().min(20, "Add a fuller description (20+ characters)"),

  price: z.number().positive("Enter a price greater than 0"),
  priceUnit: z.enum(["total", "month"]),
  pricePerMarla: z.number().positive().optional(),

  areaValue: z.number().positive("Enter an area greater than 0"),
  areaUnit: z.enum(AREA_UNITS),

  beds: z.number().int().nonnegative().optional(),
  baths: z.number().int().nonnegative().optional(),

  city: z.enum(CITY_KEYS),
  areaSlug: z.string().trim().min(1, "Select an area"),
  sector: z.string().trim().optional(),

  features: z.array(z.string().trim().min(1)),
  amenities: z.array(z.string().trim().min(1)),

  approval: z.enum(APPROVAL_STATUSES),
  possession: z.enum(POSSESSION_STATUSES),
  plotFileOrRegistry: z.enum(PLOT_DOCUMENTATION),
  cornerPlot: z.boolean(),
  boulevardFacing: z.boolean(),
  parkFacing: z.boolean(),
  gasAvailable: z.boolean(),
  electricityAvailable: z.boolean(),
  waterSource: z.enum(WATER_SOURCES),
  sewerage: z.boolean(),
  floors: z.number().int().positive().optional(),
  servantQuarter: z.boolean(),
  basement: z.boolean(),

  images: z.array(imageSchema).min(1, "Add at least one photo"),
  floorPlans: z.array(floorPlanSchema),

  agentId: z.string().trim().min(1, "Select an agent"),
  addedAt: z.string().trim().min(1),
  isFeatured: z.boolean(),
  isVerified: z.boolean(),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
