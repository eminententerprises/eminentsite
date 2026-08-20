"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Scale, ArrowRight } from "lucide-react";
import type { Property } from "@/types";
import { useCompare } from "@/hooks/use-compare";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CompareTable } from "@/components/compare/compare-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionReveal } from "@/components/home/section-reveal";

export default function ComparePage() {
  const { compareIds, hydrated, toggleCompare, clearCompare, maxCompare } = useCompare();
  const [properties, setProperties] = useState<Property[]>([]);
  // Key of the id set the fetched `properties` currently correspond to — lets
  // "loading" be derived at render time instead of set imperatively in the effect.
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  const idsKey = JSON.stringify([...compareIds].sort());

  useEffect(() => {
    if (!hydrated || compareIds.length === 0) return;

    let ignore = false;
    const key = JSON.stringify([...compareIds].sort());

    fetch("/api/properties/by-ids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: compareIds }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (ignore) return;
        setProperties(data.results ?? []);
        setLoadedKey(key);
      })
      .catch(() => {
        if (ignore) return;
        setProperties([]);
        setLoadedKey(key);
      });

    return () => {
      ignore = true;
    };
  }, [hydrated, compareIds]);

  // Preserve the order properties were added in, using the id list as source of truth.
  const orderedProperties = compareIds
    .map((id) => properties.find((p) => p.id === id))
    .filter((p): p is Property => Boolean(p));
  const loading = hydrated && compareIds.length > 0 && loadedKey !== idsKey;

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare" }]} />

      <SectionReveal>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-label font-semibold uppercase tracking-widest text-accent-strong">Side by Side</p>
            <h1 className="mt-2 text-display-lg">Compare Properties</h1>
          </div>
          {orderedProperties.length > 0 && (
            <Button variant="outline" onClick={clearCompare}>
              Clear Comparison
            </Button>
          )}
        </div>
      </SectionReveal>

      <p aria-live="polite" className="mt-3 text-body-sm text-ink-muted">
        {hydrated ? `${orderedProperties.length} of ${maxCompare} properties selected` : "Loading…"}
      </p>

      {!hydrated || loading ? (
        <Skeleton className="mt-8 h-96 w-full" />
      ) : orderedProperties.length === 0 ? (
        <SectionReveal>
          <div className="mt-16 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border-strong bg-surface-sunken px-6 py-16 text-center">
            <Scale className="h-10 w-10 text-ink-muted" aria-hidden="true" />
            <h2 className="text-heading-lg uppercase text-ink-primary">Nothing to compare yet</h2>
            <p className="max-w-md text-body-md text-ink-secondary">
              Add up to {maxCompare} properties to compare — tap the scale icon on any listing to add it here.
            </p>
            <Button asChild size="lg" className="mt-2">
              <Link href="/properties">
                Browse Properties <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </SectionReveal>
      ) : orderedProperties.length === 1 ? (
        <SectionReveal>
          <div className="mt-8 flex flex-col gap-6">
            <p className="rounded-xl border border-dashed border-border-strong bg-surface-sunken px-5 py-4 text-body-md text-ink-secondary">
              Add {maxCompare - orderedProperties.length} more propert{maxCompare - orderedProperties.length === 1 ? "y" : "ies"} to see a full side-by-side comparison.
            </p>
            <CompareTable properties={orderedProperties} onRemove={toggleCompare} />
          </div>
        </SectionReveal>
      ) : (
        <SectionReveal>
          <div className="mt-8">
            <CompareTable properties={orderedProperties} onRemove={toggleCompare} />
          </div>
        </SectionReveal>
      )}
    </div>
  );
}
