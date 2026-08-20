/**
 * Fails loudly at first use, rather than letting a missing env var surface
 * as an opaque Supabase client error deep in a request.
 */
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (see supabase/schema.sql for the matching database setup).",
    );
  }

  return { url, anonKey };
}
