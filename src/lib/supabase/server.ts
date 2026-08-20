import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

/**
 * Server-side Supabase client — use in Server Components, Server Actions and
 * Route Handlers. Reads/writes the auth session via cookies, so it must be
 * created fresh per request rather than module-level cached.
 */
export async function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component — middleware handles session
          // refresh on the next request, so this can be safely ignored.
        }
      },
    },
  });
}
