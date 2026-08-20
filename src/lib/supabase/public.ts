import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

/**
 * Read-only Supabase client for public data (property listings) — no cookies,
 * no auth session handling. Safe to call from anywhere, including
 * generateStaticParams and sitemap.ts, which run outside a request scope
 * where the cookie-based server client (`./server`) cannot be used.
 */
export function createPublicClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createClient(url, anonKey);
}
