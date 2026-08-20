import { PROPERTY_TYPE_CATEGORY } from "@/types";
import type { FloorPlan, Property, PropertyImage } from "@/types";
import { toSqFt } from "@/lib/area";
import { getLocationBySlug } from "@/data/locations";
import type { PropertyFormValues } from "@/lib/validation/property-schema";

/** Row shape of the `properties` table — see supabase/schema.sql. */
export interface PropertyRow {
  id: string;
  ref: string;
  slug: string;
  purpose: string;
  type: string;
  category: string;
  title: string;
  description: string;
  price: number;
  price_unit: string;
  price_per_marla: number | null;
  area_value: number;
  area_unit: string;
  area_sqft: number;
  beds: number | null;
  baths: number | null;
  city: string;
  city_label: string;
  area_name: string;
  area_slug: string;
  sector: string | null;
  lat: number;
  lng: number;
  features: string[];
  amenities: string[];
  approval: string;
  possession: string;
  plot_file_or_registry: string;
  corner_plot: boolean;
  boulevard_facing: boolean;
  park_facing: boolean;
  gas_available: boolean;
  electricity_available: boolean;
  water_source: string;
  sewerage: boolean;
  floors: number | null;
  servant_quarter: boolean;
  basement: boolean;
  images: PropertyImage[];
  floor_plans: FloorPlan[];
  agent_id: string | null;
  added_at: string;
  is_featured: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export type PropertyRowInsert = Omit<PropertyRow, "id" | "category" | "area_sqft" | "city_label" | "area_name" | "lat" | "lng" | "created_at" | "updated_at">;

/** Form values -> the row Supabase expects, resolving the area pick into its city/label/coords. */
export function formValuesToRow(values: PropertyFormValues): PropertyRowInsert & { category: string; area_sqft: number; city_label: string; area_name: string; lat: number; lng: number } {
  const location = getLocationBySlug(values.areaSlug);
  if (!location) {
    throw new Error(`Unknown area "${values.areaSlug}" — pick an area from the list.`);
  }

  return {
    ref: values.ref,
    slug: values.slug,
    purpose: values.purpose,
    type: values.type,
    category: PROPERTY_TYPE_CATEGORY[values.type],
    title: values.title,
    description: values.description,
    price: values.price,
    price_unit: values.priceUnit,
    price_per_marla: values.pricePerMarla ?? null,
    area_value: values.areaValue,
    area_unit: values.areaUnit,
    area_sqft: toSqFt(values.areaValue, values.areaUnit),
    beds: values.beds ?? null,
    baths: values.baths ?? null,
    city: location.city,
    city_label: location.cityLabel,
    area_name: location.name,
    area_slug: location.slug,
    sector: values.sector || null,
    lat: location.coords.lat,
    lng: location.coords.lng,
    features: values.features,
    amenities: values.amenities,
    approval: values.approval,
    possession: values.possession,
    plot_file_or_registry: values.plotFileOrRegistry,
    corner_plot: values.cornerPlot,
    boulevard_facing: values.boulevardFacing,
    park_facing: values.parkFacing,
    gas_available: values.gasAvailable,
    electricity_available: values.electricityAvailable,
    water_source: values.waterSource,
    sewerage: values.sewerage,
    floors: values.floors ?? null,
    servant_quarter: values.servantQuarter,
    basement: values.basement,
    images: values.images,
    floor_plans: values.floorPlans,
    agent_id: values.agentId || null,
    added_at: new Date(values.addedAt).toISOString(),
    is_featured: values.isFeatured,
    is_verified: values.isVerified,
  };
}

/** DB row -> form values, for pre-filling the edit form. */
export function rowToFormValues(row: PropertyRow): PropertyFormValues {
  return {
    purpose: row.purpose as PropertyFormValues["purpose"],
    type: row.type as PropertyFormValues["type"],
    title: row.title,
    ref: row.ref,
    slug: row.slug,
    description: row.description,
    price: row.price,
    priceUnit: row.price_unit as PropertyFormValues["priceUnit"],
    pricePerMarla: row.price_per_marla ?? undefined,
    areaValue: row.area_value,
    areaUnit: row.area_unit as PropertyFormValues["areaUnit"],
    beds: row.beds ?? undefined,
    baths: row.baths ?? undefined,
    city: row.city as PropertyFormValues["city"],
    areaSlug: row.area_slug,
    sector: row.sector ?? undefined,
    features: row.features ?? [],
    amenities: row.amenities ?? [],
    approval: row.approval as PropertyFormValues["approval"],
    possession: row.possession as PropertyFormValues["possession"],
    plotFileOrRegistry: row.plot_file_or_registry as PropertyFormValues["plotFileOrRegistry"],
    cornerPlot: row.corner_plot,
    boulevardFacing: row.boulevard_facing,
    parkFacing: row.park_facing,
    gasAvailable: row.gas_available,
    electricityAvailable: row.electricity_available,
    waterSource: row.water_source as PropertyFormValues["waterSource"],
    sewerage: row.sewerage,
    floors: row.floors ?? undefined,
    servantQuarter: row.servant_quarter,
    basement: row.basement,
    images: row.images ?? [],
    floorPlans: row.floor_plans ?? [],
    agentId: row.agent_id ?? "",
    addedAt: row.added_at.slice(0, 10),
    isFeatured: row.is_featured,
    isVerified: row.is_verified,
  };
}

/** DB row -> the app-wide `Property` type, so admin list views can reuse the public PropertyCard. */
export function rowToProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    ref: row.ref,
    slug: row.slug,
    purpose: row.purpose as Property["purpose"],
    type: row.type as Property["type"],
    category: row.category as Property["category"],
    title: row.title,
    description: row.description,
    price: row.price,
    priceUnit: row.price_unit as Property["priceUnit"],
    pricePerMarla: row.price_per_marla ?? undefined,
    area: { value: row.area_value, unit: row.area_unit as Property["area"]["unit"], sqft: row.area_sqft },
    beds: row.beds ?? undefined,
    baths: row.baths ?? undefined,
    location: {
      city: row.city as Property["location"]["city"],
      cityLabel: row.city_label,
      area: row.area_name,
      areaSlug: row.area_slug,
      sector: row.sector ?? undefined,
      coords: { lat: row.lat, lng: row.lng },
    },
    features: row.features ?? [],
    amenities: row.amenities ?? [],
    pakistanFields: {
      approval: row.approval as Property["pakistanFields"]["approval"],
      possession: row.possession as Property["pakistanFields"]["possession"],
      plotFileOrRegistry: row.plot_file_or_registry as Property["pakistanFields"]["plotFileOrRegistry"],
      cornerPlot: row.corner_plot,
      boulevardFacing: row.boulevard_facing,
      parkFacing: row.park_facing,
      gasAvailable: row.gas_available,
      electricityAvailable: row.electricity_available,
      waterSource: row.water_source as Property["pakistanFields"]["waterSource"],
      sewerage: row.sewerage,
      floors: row.floors ?? undefined,
      servantQuarter: row.servant_quarter,
      basement: row.basement,
    },
    images: row.images ?? [],
    floorPlans: row.floor_plans ?? [],
    agentId: row.agent_id ?? "",
    addedAt: row.added_at,
    isFeatured: row.is_featured,
    isVerified: row.is_verified,
  };
}
