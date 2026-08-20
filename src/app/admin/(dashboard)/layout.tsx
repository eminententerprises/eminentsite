import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Building2, PlusCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { LogoutButton } from "@/components/admin/logout-button";
import { SupabaseNotConfigured } from "@/components/admin/supabase-not-configured";

export const metadata: Metadata = {
  title: { template: "%s — Admin", default: "Admin Dashboard" },
  robots: { index: false, follow: false },
};

// Every page here reads the authenticated user and live Supabase data — never
// statically prerenderable, and must not be attempted at build time (which
// would fail before Supabase credentials even exist).
export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Listings", icon: Building2 },
  { href: "/admin/properties/new", label: "New Listing", icon: PlusCircle },
];

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  try {
    getSupabaseEnv();
  } catch {
    return <SupabaseNotConfigured />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-surface-sunken">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border-hairline bg-surface-raised lg:flex">
        <div className="border-b border-border-hairline px-6 py-6">
          <p className="font-display text-heading-md uppercase tracking-tight text-navy-800">Eminent Enterprises</p>
          <p className="text-body-sm text-ink-muted">Admin Dashboard</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-body-sm font-medium text-ink-primary transition-colors hover:bg-surface-sunken hover:text-accent-strong"
            >
              <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border-hairline p-4">
          <p className="truncate px-1 pb-2 text-body-sm text-ink-muted">{user.email}</p>
          <LogoutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border-hairline bg-surface-raised px-4 py-3 lg:hidden">
          <p className="font-display text-heading-md uppercase tracking-tight text-navy-800">Admin</p>
          <LogoutButton />
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-border-hairline bg-surface-raised px-4 py-2 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-border-hairline px-3 py-1.5 text-body-sm font-medium text-ink-primary hover:border-accent-strong hover:text-accent-strong"
            >
              <item.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
