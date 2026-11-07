import type { FilterState, Property } from "@/types";
import { toSqFt } from "@/lib/area";
import { getSupabase } from "@/lib/supabase";
import { rowToProperty, type PropertyRow } from "@/lib/admin/property-mapper";

/**
 * Mobile counterpart of the website's src/lib/repositories/property-repository.ts.
 * Listings come from the same Supabase `properties` table the admin
 * dashboard writes to. Filtering and sorting are identical to the website,
 * so a search returns the same results in both places.
 */
export async function fetchAllProperties(): Promise<Property[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("added_at", { ascending: false })
    .returns<PropertyRow[]>();

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToProperty);
}

export function filterProperties(all: Property[], filters: FilterState): Property[] {
  let results = all;

  if (filters.purpose) results = results.filter((p) => p.purpose === filters.purpose);
  if (filters.category) results = results.filter((p) => p.category === filters.category);
  if (filters.types?.length) {
    const set = new Set(filters.types);
    results = results.filter((p) => set.has(p.type));
  }
  if (filters.cities?.length) {
    const set = new Set(filters.cities);
    results = results.filter((p) => set.has(p.location.city));
  }
  if (filters.areas?.length) {
    const set = new Set(filters.areas);
    results = results.filter((p) => set.has(p.location.areaSlug));
  }
  if (typeof filters.priceMin === "number") {
    const min = filters.priceMin;
    results = results.filter((p) => p.price >= min);
  }
  if (typeof filters.priceMax === "number") {
    const max = filters.priceMax;
    results = results.filter((p) => p.price <= max);
  }
  if (typeof filters.areaMin === "number") {
    const min = filters.areaUnit ? toSqFt(filters.areaMin, filters.areaUnit) : filters.areaMin;
    results = results.filter((p) => p.area.sqft >= min);
  }
  if (typeof filters.areaMax === "number") {
    const max = filters.areaUnit ? toSqFt(filters.areaMax, filters.areaUnit) : filters.areaMax;
    results = results.filter((p) => p.area.sqft <= max);
  }
  if (typeof filters.beds === "number") {
    const beds = filters.beds;
    results = results.filter((p) => typeof p.beds === "number" && p.beds >= beds);
  }
  if (typeof filters.baths === "number") {
    const baths = filters.baths;
    results = results.filter((p) => typeof p.baths === "number" && p.baths >= baths);
  }
  if (filters.approval?.length) {
    const set = new Set(filters.approval);
    results = results.filter((p) => set.has(p.pakistanFields.approval));
  }
  if (filters.possession?.length) {
    const set = new Set(filters.possession);
    results = results.filter((p) => set.has(p.pakistanFields.possession));
  }
  const keyword = filters.keyword?.trim().toLowerCase();
  if (keyword) {
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword) ||
        p.location.area.toLowerCase().includes(keyword) ||
        p.ref.toLowerCase().includes(keyword),
    );
  }
  if (typeof filters.addedWithinDays === "number") {
    const cutoff = Date.now() - filters.addedWithinDays * 24 * 60 * 60 * 1000;
    results = results.filter((p) => new Date(p.addedAt).getTime() >= cutoff);
  }

  return sortProperties(results, filters.sort);
}

export function sortProperties(properties: Property[], sort: FilterState["sort"]): Property[] {
  const sorted = properties.slice();
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "area-desc":
      return sorted.sort((a, b) => b.area.sqft - a.area.sqft);
    case "price-per-marla-asc":
      return sorted.sort((a, b) => (a.pricePerMarla ?? Infinity) - (b.pricePerMarla ?? Infinity));
    case "newest":
    default:
      return sorted.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
  }
}

/** Same category and city as the given property, excluding itself. */
export function similarProperties(all: Property[], property: Property, limit = 4): Property[] {
  return all
    .filter((p) => p.id !== property.id && p.category === property.category && p.location.city === property.location.city)
    .slice(0, limit);
}

/** Counts active filters for the badge on the Filters button (purpose/sort/keyword excluded). */
export function countActiveFilters(f: FilterState): number {
  let n = 0;
  if (f.category) n++;
  if (f.types?.length) n++;
  if (f.cities?.length) n++;
  if (f.areas?.length) n++;
  if (typeof f.priceMin === "number" || typeof f.priceMax === "number") n++;
  if (typeof f.areaMin === "number" || typeof f.areaMax === "number") n++;
  if (typeof f.beds === "number") n++;
  if (typeof f.baths === "number") n++;
  if (f.approval?.length) n++;
  if (f.possession?.length) n++;
  if (typeof f.addedWithinDays === "number") n++;
  return n;
}
