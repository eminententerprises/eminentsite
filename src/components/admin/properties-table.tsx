"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ShieldCheck, Star, Pencil } from "lucide-react";
import type { Property } from "@/types";
import { formatPKR } from "@/lib/format-pkr";
import { formatAreaAuto } from "@/lib/area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeletePropertyButton } from "@/components/admin/delete-property-button";

type SectionKey = "all" | "buy" | "rent" | "featured" | "residential" | "commercial" | "plots";

const SECTIONS: { key: SectionKey; label: string; test: (p: Property) => boolean }[] = [
  { key: "all", label: "All", test: () => true },
  { key: "buy", label: "For Sale", test: (p) => p.purpose === "buy" },
  { key: "rent", label: "For Rent", test: (p) => p.purpose === "rent" },
  { key: "featured", label: "Featured", test: (p) => p.isFeatured },
  { key: "residential", label: "Residential", test: (p) => p.category === "residential" },
  { key: "commercial", label: "Commercial", test: (p) => p.category === "commercial" },
  { key: "plots", label: "Plots", test: (p) => p.category === "plots" },
];

export function PropertiesTable({ properties }: { properties: Property[] }) {
  const [section, setSection] = useState<SectionKey>("all");
  const [query, setQuery] = useState("");

  const sectioned = useMemo(() => {
    const test = SECTIONS.find((s) => s.key === section)?.test ?? (() => true);
    return properties.filter(test);
  }, [properties, section]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sectioned;
    return sectioned.filter((p) => p.title.toLowerCase().includes(q) || p.ref.toLowerCase().includes(q) || p.location.area.toLowerCase().includes(q));
  }, [sectioned, query]);

  return (
    <div className="flex flex-col gap-5">
      <Tabs value={section} onValueChange={(v) => setSection(v as SectionKey)}>
        <TabsList className="flex-wrap">
          {SECTIONS.map((s) => (
            <TabsTrigger key={s.key} value={s.key}>
              {s.label} <span className="ml-1 font-tabular-nums text-ink-muted">({properties.filter(s.test).length})</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title, ref or area…" className="pl-9" />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-strong p-10 text-center">
          <p className="text-body-md text-ink-secondary">{properties.length === 0 ? "No listings yet." : "No listings match this filter."}</p>
          {properties.length === 0 && (
            <Button asChild className="mt-4">
              <Link href="/admin/properties/new">Create Your First Listing</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border-hairline bg-surface-raised">
          <table className="w-full min-w-[860px] border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-border-hairline bg-surface-sunken text-left">
                <th scope="col" className="px-4 py-3 font-semibold text-ink-primary">Listing</th>
                <th scope="col" className="px-4 py-3 font-semibold text-ink-primary">Price</th>
                <th scope="col" className="px-4 py-3 font-semibold text-ink-primary">Area</th>
                <th scope="col" className="px-4 py-3 font-semibold text-ink-primary">Location</th>
                <th scope="col" className="px-4 py-3 font-semibold text-ink-primary">Added</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold text-ink-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border-hairline last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* Admin-only thumbnail of an arbitrary Supabase Storage URL — next/image would need that host allowlisted. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.images[0]?.src} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover bg-surface-sunken" />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink-primary">{p.title}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-body-sm text-ink-muted">
                          <span className="font-tabular-nums">{p.ref}</span>
                          <Badge variant="neutral">{p.purpose === "buy" ? "Sale" : "Rent"}</Badge>
                          {p.isFeatured && (
                            <span title="Featured" className="text-accent-strong">
                              <Star className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                          )}
                          {p.isVerified && (
                            <span title="Verified" className="text-success">
                              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-tabular-nums text-ink-primary">{formatPKR(p.price, { perMonth: p.priceUnit === "month" }).short}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-tabular-nums text-ink-secondary">{formatAreaAuto(p.area.sqft)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-secondary">{p.location.area}, {p.location.cityLabel}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-secondary">
                    {new Date(p.addedAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" aria-label={`Edit ${p.title}`}>
                        <Link href={`/admin/properties/${p.id}/edit`}>
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </Button>
                      <DeletePropertyButton id={p.id} title={p.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
