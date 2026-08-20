import type { AreaLocation } from "./location";

export type Purpose = "buy" | "rent";

export type PropertyCategory = "residential" | "commercial" | "plots";

export type PropertyType =
  | "House"
  | "Upper Portion"
  | "Lower Portion"
  | "Flat/Apartment"
  | "Penthouse"
  | "Farm House"
  | "Residential Plot"
  | "Commercial Plot"
  | "Plot File"
  | "Agricultural Land"
  | "Shop"
  | "Office"
  | "Warehouse"
  | "Building"
  | "Factory";

export const PROPERTY_TYPE_CATEGORY: Record<PropertyType, PropertyCategory> = {
  House: "residential",
  "Upper Portion": "residential",
  "Lower Portion": "residential",
  "Flat/Apartment": "residential",
  Penthouse: "residential",
  "Farm House": "residential",
  "Residential Plot": "plots",
  "Commercial Plot": "plots",
  "Plot File": "plots",
  "Agricultural Land": "plots",
  Shop: "commercial",
  Office: "commercial",
  Warehouse: "commercial",
  Building: "commercial",
  Factory: "commercial",
};

export type ApprovalStatus = "CDA Approved" | "RDA Approved" | "Approval Pending" | "Not Applicable";

export type PossessionStatus = "Ready" | "Under Development" | "Balloted";

export type WaterSource = "Boring" | "Tanker" | "Supply Line" | "Boring + Supply";

export type AreaUnit = "marla" | "kanal" | "sqft" | "sqyd";

export interface PropertyArea {
  value: number;
  unit: AreaUnit;
  sqft: number;
}

export interface PropertyImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface FloorPlan {
  src: string;
  alt: string;
  label: string;
}

export interface PakistanFields {
  approval: ApprovalStatus;
  possession: PossessionStatus;
  plotFileOrRegistry: "Plot File" | "Registry" | "Not Applicable";
  cornerPlot: boolean;
  boulevardFacing: boolean;
  parkFacing: boolean;
  gasAvailable: boolean;
  electricityAvailable: boolean;
  waterSource: WaterSource;
  sewerage: boolean;
  floors?: number;
  servantQuarter: boolean;
  basement: boolean;
}

export interface Property {
  id: string;
  ref: string;
  slug: string;
  purpose: Purpose;
  type: PropertyType;
  category: PropertyCategory;
  title: string;
  description: string;
  price: number;
  priceUnit: "total" | "month";
  pricePerMarla?: number;
  area: PropertyArea;
  beds?: number;
  baths?: number;
  location: AreaLocation;
  features: string[];
  amenities: string[];
  pakistanFields: PakistanFields;
  images: PropertyImage[];
  floorPlans: FloorPlan[];
  agentId: string;
  addedAt: string; // ISO date
  isFeatured: boolean;
  isVerified: boolean;
}

export interface FilterState {
  purpose?: Purpose;
  category?: PropertyCategory;
  types?: PropertyType[];
  cities?: string[];
  areas?: string[];
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  areaUnit?: AreaUnit;
  beds?: number;
  baths?: number;
  approval?: ApprovalStatus[];
  possession?: PossessionStatus[];
  keyword?: string;
  addedWithinDays?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "area-desc" | "price-per-marla-asc";
  page?: number;
}
