"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import type { Property } from "@/types";
import { useShortlist } from "@/hooks/use-shortlist";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionReveal, StaggerGroup, StaggerItem } from "@/components/home/section-reveal";

export default function ShortlistPage() {
  const { shortlistedIds, hydrated, clearShortlist } = useShortlist();
  const [properties, setProperties] = useState<Property[]>([]);
  // Key of the id set the fetched `properties` currently correspond to — lets
  // "loading" be derived at render time instead of set imperatively in the effect.
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  const idsKey = JSON.stringify([...shortlistedIds].sort());

  useEffect(() => {
    if (!hydrated || shortlistedIds.length === 0) return;

    let ignore = false;
    const key = JSON.stringify([...shortlistedIds].sort());

    fetch("/api/properties/by-ids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: shortlistedIds }),
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
  }, [hydrated, shortlistedIds]);

  // Derived at render time so clearing the shortlist is reflected immediately
  // without a stale fetch result lingering.
  const displayedProperties = shortlistedIds.length === 0 ? [] : properties;
  const loading = hydrated && shortlistedIds.length > 0 && loadedKey !== idsKey;

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shortlist" }]} />

      <SectionReveal>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-label font-semibold uppercase tracking-widest text-accent-strong">Saved Properties</p>
            <h1 className="mt-2 text-display-lg">Your Shortlist</h1>
          </div>
          {displayedProperties.length > 0 && (
            <Button variant="outline" onClick={clearShortlist}>
              Clear Shortlist
            </Button>
          )}
        </div>
      </SectionReveal>

      <p aria-live="polite" className="mt-3 text-body-sm text-ink-muted">
        {hydrated ? `${displayedProperties.length} propert${displayedProperties.length === 1 ? "y" : "ies"} shortlisted` : "Loading…"}
      </p>

      {!hydrated || loading ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full" />
          ))}
        </div>
      ) : displayedProperties.length === 0 ? (
        <SectionReveal>
          <div className="mt-16 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border-strong bg-surface-sunken px-6 py-16 text-center">
            <Heart className="h-10 w-10 text-ink-muted" aria-hidden="true" />
            <h2 className="text-heading-lg uppercase text-ink-primary">Your shortlist is empty</h2>
            <p className="max-w-md text-body-md text-ink-secondary">
              Browse properties and tap the heart icon to save the ones you&apos;re interested in — they&apos;ll show up here.
            </p>
            <Button asChild size="lg" className="mt-2">
              <Link href="/properties">
                Browse Properties <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </SectionReveal>
      ) : (
        <StaggerGroup className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {displayedProperties.map((p) => (
            <StaggerItem key={p.id}>
              <PropertyCard property={p} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </div>
  );
}
