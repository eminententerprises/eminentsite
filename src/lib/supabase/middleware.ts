import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

/**
 * Refreshes the Supabase auth session on every request and redirects
 * unauthenticated visitors away from /admin. Session refresh must happen in
 * middleware (not just in Server Components) because it's the only place
 * that can rewrite the outgoing response's cookies before the browser sees
 * them — see https://supabase.com/docs/guides/auth/server-side/nextjs.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Supabase isn't configured yet (no .env.local) — let the request through
  // so the admin layout itself can render a setup screen instead of a 500.
  let env: { url: string; anonKey: string };
  try {
    env = getSupabaseEnv();
  } catch {
    return response;
  }

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute && !user) {
    const redirectUrl = new URL("/admin/login", request.url);
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoginRoute && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}
