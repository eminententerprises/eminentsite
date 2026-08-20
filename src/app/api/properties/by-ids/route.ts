import { NextRequest, NextResponse } from "next/server";
import { getAllProperties } from "@/lib/repositories/property-repository";

/**
 * Additive lookup endpoint — the mock repository layer only exposes
 * slug/filter-based reads, but the localStorage-backed shortlist/compare
 * hooks store arbitrary property `id`s. This resolves an id array to full
 * Property records without touching the repository files themselves.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const ids = Array.isArray(body?.ids) ? body.ids.filter((id: unknown): id is string => typeof id === "string") : null;

  if (!ids) {
    return NextResponse.json({ results: [] }, { status: 400 });
  }

  const idSet = new Set(ids);
  const results = getAllProperties().filter((p) => idSet.has(p.id));

  return NextResponse.json({ results });
}
