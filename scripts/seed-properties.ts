/**
 * One-time (re-runnable) seed: pushes the built-in mock listings from
 * src/data/properties.ts into the Supabase `properties` table, so the admin
 * dashboard and the public site both show them from day one. Safe to re-run —
 * listings already present (matched by slug) are skipped.
 *
 * Usage:
 *   SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD=yourpassword npm run seed
 *
 * The admin email/password must already exist under Supabase ->
 * Authentication -> Users (RLS only allows authenticated writes).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { PROPERTIES } from "../src/data/properties";
import type { Property } from "../src/types";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  let content: string;
  try {
    content = readFileSync(path, "utf8");
  } catch {
    return;
  }
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY — set them in .env.local first (see supabase/schema.sql).",
  );
  process.exit(1);
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to the admin login you created under\n" +
      "Supabase -> Authentication -> Users, e.g.\n\n" +
      "  SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD=yourpassword npm run seed\n",
  );
  process.exit(1);
}

function propertyToRow(p: Property) {
  return {
    ref: p.ref,
    slug: p.slug,
    purpose: p.purpose,
    type: p.type,
    category: p.category,
    title: p.title,
    description: p.description,
    price: p.price,
    price_unit: p.priceUnit,
    price_per_marla: p.pricePerMarla ?? null,
    area_value: p.area.value,
    area_unit: p.area.unit,
    area_sqft: p.area.sqft,
    beds: p.beds ?? null,
    baths: p.baths ?? null,
    city: p.location.city,
    city_label: p.location.cityLabel,
    area_name: p.location.area,
    area_slug: p.location.areaSlug,
    sector: p.location.sector ?? null,
    lat: p.location.coords.lat,
    lng: p.location.coords.lng,
    features: p.features,
    amenities: p.amenities,
    approval: p.pakistanFields.approval,
    possession: p.pakistanFields.possession,
    plot_file_or_registry: p.pakistanFields.plotFileOrRegistry,
    corner_plot: p.pakistanFields.cornerPlot,
    boulevard_facing: p.pakistanFields.boulevardFacing,
    park_facing: p.pakistanFields.parkFacing,
    gas_available: p.pakistanFields.gasAvailable,
    electricity_available: p.pakistanFields.electricityAvailable,
    water_source: p.pakistanFields.waterSource,
    sewerage: p.pakistanFields.sewerage,
    floors: p.pakistanFields.floors ?? null,
    servant_quarter: p.pakistanFields.servantQuarter,
    basement: p.pakistanFields.basement,
    images: p.images,
    floor_plans: p.floorPlans,
    agent_id: p.agentId || null,
    added_at: new Date(p.addedAt).toISOString(),
    is_featured: p.isFeatured,
    is_verified: p.isVerified,
  };
}

async function main() {
  const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL!,
    password: ADMIN_PASSWORD!,
  });
  if (signInError) {
    console.error("Could not sign in as admin:", signInError.message);
    process.exit(1);
  }

  const { data: existing, error: existingError } = await supabase.from("properties").select("slug");
  if (existingError) {
    console.error("Could not read existing properties (has supabase/schema.sql been run yet?):", existingError.message);
    process.exit(1);
  }
  const existingSlugs = new Set((existing ?? []).map((r) => r.slug as string));

  const toInsert = PROPERTIES.filter((p) => !existingSlugs.has(p.slug)).map(propertyToRow);

  if (toInsert.length === 0) {
    console.log("Every mock listing is already in Supabase — nothing to seed.");
    return;
  }

  const { error: insertError } = await supabase.from("properties").insert(toInsert);
  if (insertError) {
    console.error("Insert failed:", insertError.message);
    process.exit(1);
  }

  console.log(
    `Seeded ${toInsert.length} listing(s) into Supabase (skipped ${PROPERTIES.length - toInsert.length} already present).`,
  );
}

main();
