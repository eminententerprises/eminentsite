"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FilterState, Property } from "@/types";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyCardSkeleton } from "@/components/property/property-card-skeleton";
import { PropertyMap } from "@/components/property/property-map";
import { SearchToolbar, type ViewMode } from "@/components/property/search-toolbar";
import { Button } from "@/components/ui/button";
import { filtersToParams } from "@/lib/property-filters-url";
import { formatPKR } from "@/lib/format-pkr";
import { cn } from "@/lib/utils";
import { StaggerGroup, StaggerItem } from "@/components/home/section-reveal";

export function PropertyResults({
  initialResults,
  initialTotal,
  filters,
  activeFilterCount,
}: {
  initialResults: Property[];
  initialTotal: number;
  filters: FilterState;
  activeFilterCount: number;
}) {
  const [view, setView] = useState<ViewMode>("grid");
  const [results, setResults] = useState(initialResults);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = results.length < total;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = Math.floor(results.length / 12) + 1;
    const params = filtersToParams({ ...filters, page: nextPage });
    try {
      const res = await fetch(`/api/properties/search?${params.toString()}`);
      const data: { results: Property[]; total: number } = await res.json();
      setResults((prev) => [...prev, ...data.results]);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [filters, hasMore, loading, results.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || view === "map") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, view]);

  const markers = results
    .filter((p) => p.location.coords)
    .map((p) => ({
      id: p.id,
      lat: p.location.coords.lat,
      lng: p.location.coords.lng,
      label: formatPKR(p.price, { perMonth: p.priceUnit === "month" }).short.replace("PKR ", ""),
    }));

  return (
    <div>
      <SearchToolbar total={total} view={view} onViewChange={setView} activeFilterCount={activeFilterCount} />

      {results.length === 0 ? (
        <EmptyState />
      ) : view === "map" ? (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="order-2 flex max-h-[720px] flex-col gap-4 overflow-y-auto pr-1 lg:order-1">
            {results.map((p) => (
              <div key={p.id} onMouseEnter={() => setHoveredId(p.id)} onMouseLeave={() => setHoveredId(null)}>
                <PropertyCard property={p} className={cn(hoveredId === p.id && "ring-2 ring-accent-strong")} />
              </div>
            ))}
          </div>
          <div className="order-1 lg:sticky lg:top-20 lg:order-2 lg:h-[720px]">
            <PropertyMap markers={markers} activeId={hoveredId ?? undefined} onMarkerHover={setHoveredId} height="100%" className="h-[420px] lg:h-full" />
          </div>
        </div>
      ) : (
        <>
          <StaggerGroup
            className={cn(
              "mt-6 grid gap-5",
              view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
            )}
          >
            {results.map((p) => (
              <StaggerItem key={p.id}>
                <PropertyCard property={p} featuredLayout={view === "list"} />
              </StaggerItem>
            ))}
            {loading && Array.from({ length: 3 }).map((_, i) => <PropertyCardSkeleton key={`skeleton-${i}`} />)}
          </StaggerGroup>

          <div ref={sentinelRef} className="mt-8 flex justify-center">
            {hasMore && (
              <Button variant="outline" onClick={loadMore} disabled={loading}>
                {loading ? "Loading…" : "Load More Properties"}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState() {
  const suggestions = ["Clear budget filter", "Search all of Islamabad", "Include Rawalpindi", "Try Flat/Apartment"];
  return (
    <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-border-strong px-6 py-16 text-center">
      <p className="text-heading-lg uppercase text-ink-primary">No properties match these filters</p>
      <p className="mt-2 max-w-md text-body-md text-ink-secondary">
        Try widening your budget, area, or location. Here are a few starting points:
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <span key={s} className="rounded-lg border border-border-hairline px-3 py-1.5 text-body-sm text-ink-secondary">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
