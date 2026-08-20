import type { ApprovalStatus, AreaUnit, FilterState, PossessionStatus, PropertyType, Purpose } from "@/types";

export type SearchParamsInput = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function list(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : value.split(",").filter(Boolean);
}

export function parseFilters(searchParams: SearchParamsInput): FilterState {
  const purpose = first(searchParams.purpose) as Purpose | undefined;
  const category = first(searchParams.category) as FilterState["category"];
  const types = list(searchParams.type) as PropertyType[];
  const cityParam = list(searchParams.city);
  const areas = list(searchParams.area);
  const approval = list(searchParams.approval) as ApprovalStatus[];
  const possession = list(searchParams.possession) as PossessionStatus[];
  const sort = first(searchParams.sort) as FilterState["sort"];
  const areaUnit = first(searchParams.areaUnit) as AreaUnit | undefined;

  const priceMin = numberOrUndefined(first(searchParams.priceMin));
  const priceMax = numberOrUndefined(first(searchParams.priceMax));
  const areaMin = numberOrUndefined(first(searchParams.areaMin));
  const areaMax = numberOrUndefined(first(searchParams.areaMax));
  const beds = numberOrUndefined(first(searchParams.beds));
  const baths = numberOrUndefined(first(searchParams.baths));
  const addedWithinDays = numberOrUndefined(first(searchParams.addedWithinDays));
  const page = numberOrUndefined(first(searchParams.page));

  return {
    purpose: purpose === "buy" || purpose === "rent" ? purpose : undefined,
    category: category === "residential" || category === "commercial" || category === "plots" ? category : undefined,
    types: types.length ? types : undefined,
    cities: cityParam.length ? cityParam : undefined,
    areas: areas.length ? areas : undefined,
    priceMin,
    priceMax,
    areaMin,
    areaMax,
    areaUnit,
    beds,
    baths,
    approval: approval.length ? approval : undefined,
    possession: possession.length ? possession : undefined,
    keyword: first(searchParams.q),
    addedWithinDays,
    sort: sort ?? "newest",
    page: page ?? 1,
  };
}

function numberOrUndefined(value: string | undefined): number | undefined {
  if (value === undefined || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/** Builds a URLSearchParams from filters, omitting empty/default values. */
export function filtersToParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.purpose) params.set("purpose", filters.purpose);
  if (filters.category) params.set("category", filters.category);
  if (filters.types?.length) params.set("type", filters.types.join(","));
  if (filters.cities?.length) params.set("city", filters.cities.join(","));
  if (filters.areas?.length) params.set("area", filters.areas.join(","));
  if (typeof filters.priceMin === "number") params.set("priceMin", String(filters.priceMin));
  if (typeof filters.priceMax === "number") params.set("priceMax", String(filters.priceMax));
  if (typeof filters.areaMin === "number") params.set("areaMin", String(filters.areaMin));
  if (typeof filters.areaMax === "number") params.set("areaMax", String(filters.areaMax));
  if (filters.areaUnit) params.set("areaUnit", filters.areaUnit);
  if (typeof filters.beds === "number") params.set("beds", String(filters.beds));
  if (typeof filters.baths === "number") params.set("baths", String(filters.baths));
  if (filters.approval?.length) params.set("approval", filters.approval.join(","));
  if (filters.possession?.length) params.set("possession", filters.possession.join(","));
  if (filters.keyword) params.set("q", filters.keyword);
  if (typeof filters.addedWithinDays === "number") params.set("addedWithinDays", String(filters.addedWithinDays));
  if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  return params;
}
