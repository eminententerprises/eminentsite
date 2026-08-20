import type { FilterState, Property } from "@/types";
import { PROPERTIES } from "@/data/properties";
import { toSqFt } from "@/lib/area";

const RESULTS_PER_PAGE = 12;

export function getAllProperties(): Property[] {
  return PROPERTIES;
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return PROPERTIES.find((p) => p.slug === slug);
}

export function getFeaturedProperties(limit?: number): Property[] {
  const featured = PROPERTIES.filter((p) => p.isFeatured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

/** Same category and city as the given property, excluding itself. */
export function getSimilarProperties(property: Property, limit = 4): Property[] {
  const similar = PROPERTIES.filter(
    (p) => p.id !== property.id && p.category === property.category && p.location.city === property.location.city
  );
  return similar.slice(0, limit);
}

export function searchProperties(filters: FilterState): { results: Property[]; total: number } {
  let results = PROPERTIES.slice();

  if (filters.purpose) {
    results = results.filter((p) => p.purpose === filters.purpose);
  }
  if (filters.category) {
    results = results.filter((p) => p.category === filters.category);
  }
  if (filters.types && filters.types.length > 0) {
    const typeSet = new Set(filters.types);
    results = results.filter((p) => typeSet.has(p.type));
  }
  if (filters.cities && filters.cities.length > 0) {
    const citySet = new Set(filters.cities);
    results = results.filter((p) => citySet.has(p.location.city));
  }
  if (filters.areas && filters.areas.length > 0) {
    const areaSet = new Set(filters.areas);
    results = results.filter((p) => areaSet.has(p.location.areaSlug));
  }
  if (typeof filters.priceMin === "number") {
    const priceMin = filters.priceMin;
    results = results.filter((p) => p.price >= priceMin);
  }
  if (typeof filters.priceMax === "number") {
    const priceMax = filters.priceMax;
    results = results.filter((p) => p.price <= priceMax);
  }
  if (typeof filters.areaMin === "number") {
    const areaMinSqft = filters.areaUnit ? toSqFt(filters.areaMin, filters.areaUnit) : filters.areaMin;
    results = results.filter((p) => p.area.sqft >= areaMinSqft);
  }
  if (typeof filters.areaMax === "number") {
    const areaMaxSqft = filters.areaUnit ? toSqFt(filters.areaMax, filters.areaUnit) : filters.areaMax;
    results = results.filter((p) => p.area.sqft <= areaMaxSqft);
  }
  if (typeof filters.beds === "number") {
    const beds = filters.beds;
    results = results.filter((p) => typeof p.beds === "number" && p.beds >= beds);
  }
  if (typeof filters.baths === "number") {
    const baths = filters.baths;
    results = results.filter((p) => typeof p.baths === "number" && p.baths >= baths);
  }
  if (filters.approval && filters.approval.length > 0) {
    const approvalSet = new Set(filters.approval);
    results = results.filter((p) => approvalSet.has(p.pakistanFields.approval));
  }
  if (filters.possession && filters.possession.length > 0) {
    const possessionSet = new Set(filters.possession);
    results = results.filter((p) => possessionSet.has(p.pakistanFields.possession));
  }
  if (filters.keyword) {
    const keyword = filters.keyword.trim().toLowerCase();
    if (keyword.length > 0) {
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(keyword) ||
          p.description.toLowerCase().includes(keyword) ||
          p.location.area.toLowerCase().includes(keyword)
      );
    }
  }
  if (typeof filters.addedWithinDays === "number") {
    const days = filters.addedWithinDays;
    const now = new Date();
    const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000;
    results = results.filter((p) => new Date(p.addedAt).getTime() >= cutoff);
  }

  results = sortProperties(results, filters.sort);

  const total = results.length;
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const start = (page - 1) * RESULTS_PER_PAGE;
  const paged = results.slice(start, start + RESULTS_PER_PAGE);

  return { results: paged, total };
}

function sortProperties(properties: Property[], sort: FilterState["sort"]): Property[] {
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
