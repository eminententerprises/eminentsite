import { AlertTriangle } from "lucide-react";

export function SupabaseNotConfigured() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-sunken px-4 py-12">
      <div className="max-w-lg rounded-2xl border border-warning bg-surface-raised p-8 shadow-card">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 shrink-0 text-warning" aria-hidden="true" />
          <p className="font-display text-heading-lg uppercase text-navy-800">Supabase Not Configured</p>
        </div>
        <p className="mt-4 text-body-md text-ink-secondary">
          Add <code className="rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-body-sm">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-body-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
          <code className="rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-body-sm">.env.local</code> at the project root, then restart the dev
          server.
        </p>
        <p className="mt-3 text-body-sm text-ink-muted">
          Run <code className="rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-body-sm">supabase/schema.sql</code> in your project&apos;s SQL
          Editor first to create the <code className="rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-body-sm">properties</code> table, then
          create your admin login under Authentication → Users.
        </p>
      </div>
    </div>
  );
}
