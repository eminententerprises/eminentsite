import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { SupabaseNotConfigured } from "@/components/admin/supabase-not-configured";
import { getSupabaseEnv } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

// Checks live env config and an active session redirect via proxy — never
// statically prerenderable.
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  try {
    getSupabaseEnv();
  } catch {
    return <SupabaseNotConfigured />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-sunken px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-border-hairline bg-surface-raised p-8 shadow-card">
        <p className="font-display text-heading-lg uppercase tracking-tight text-navy-800">Eminent Enterprises</p>
        <p className="mt-1 text-body-sm text-ink-secondary">Sign in to manage listings.</p>
        <div className="mt-7">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
