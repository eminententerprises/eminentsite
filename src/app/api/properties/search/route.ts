import { NextRequest, NextResponse } from "next/server";
import { searchProperties } from "@/lib/repositories/property-repository";
import { parseFilters } from "@/lib/property-filters-url";

export async function GET(request: NextRequest) {
  const searchParams: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    searchParams[key] = value;
  });

  const filters = parseFilters(searchParams);
  const { results, total } = await searchProperties(filters);

  return NextResponse.json({ results, total, page: filters.page ?? 1 });
}
