import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Tag, ShieldCheck, ArrowRight, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { rowToProperty, type PropertyRow } from "@/lib/admin/property-mapper";
import { formatPKR } from "@/lib/format-pkr";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("properties").select("*").order("added_at", { ascending: false }).returns<PropertyRow[]>();
  const properties = (data ?? []).map(rowToProperty);

  const stats = [
    { label: "Total Listings", value: properties.length, icon: Building2 },
    { label: "For Sale", value: properties.filter((p) => p.purpose === "buy").length, icon: Tag },
    { label: "For Rent", value: properties.filter((p) => p.purpose === "rent").length, icon: Tag },
    { label: "Verified", value: properties.filter((p) => p.isVerified).length, icon: ShieldCheck },
  ];

  const recent = properties.slice(0, 5);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm">Dashboard</h1>
          <p className="mt-1 text-body-md text-ink-secondary">An overview of every listing on the site.</p>
        </div>
        <Button asChild>
          <Link href="/admin/properties/new">
            <Plus className="h-4 w-4" aria-hidden="true" /> New Listing
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border-hairline bg-surface-raised p-5">
            <s.icon className="h-5 w-5 text-accent-strong" aria-hidden="true" />
            <p className="mt-3 font-tabular-nums text-display-sm text-navy-800">{s.value}</p>
            <p className="mt-1 text-body-sm text-ink-secondary">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border-hairline bg-surface-raised p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-heading-md uppercase text-ink-primary">Recent Listings</h2>
          <Link href="/admin/properties" className="flex items-center gap-1 text-body-sm font-semibold uppercase tracking-wide text-accent-strong hover:underline">
            View All <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="mt-4 text-body-md text-ink-secondary">No listings yet — create your first one to see it here.</p>
        ) : (
          <ul className="mt-4 flex flex-col divide-y divide-border-hairline">
            {recent.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/properties/${p.id}/edit`} className="flex items-center gap-3 py-3 hover:text-accent-strong">
                  {/* Admin-only thumbnail of an arbitrary Supabase Storage URL — next/image would need that host allowlisted. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images[0]?.src} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover bg-surface-sunken" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-md font-medium text-ink-primary">{p.title}</p>
                    <p className="text-body-sm text-ink-muted">{p.location.area}, {p.location.cityLabel}</p>
                  </div>
                  <p className="shrink-0 font-tabular-nums text-body-sm font-semibold text-ink-primary">
                    {formatPKR(p.price, { perMonth: p.priceUnit === "month" }).short}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
