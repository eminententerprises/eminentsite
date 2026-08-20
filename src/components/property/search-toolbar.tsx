"use client";

import { Grid2x2, List, Map as MapIcon, SlidersHorizontal } from "lucide-react";
import { usePropertySearchParams } from "@/hooks/use-property-search-params";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FilterRail } from "@/components/property/filter-rail";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list" | "map";

const SORT_OPTIONS: { value: NonNullable<import("@/types").FilterState["sort"]>; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "area-desc", label: "Area: Largest First" },
  { value: "price-per-marla-asc", label: "Price per Marla: Low to High" },
];

export function SearchToolbar({
  total,
  view,
  onViewChange,
  activeFilterCount,
}: {
  total: number;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  activeFilterCount: number;
}) {
  const { filters, setFilters } = usePropertySearchParams();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-hairline pb-4">
      <p aria-live="polite" className="font-tabular-nums text-body-md text-ink-primary">
        <span className="font-semibold">{total.toLocaleString("en-PK")}</span> propert{total === 1 ? "y" : "ies"} found
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="lg:hidden">
              <SlidersHorizontal className="h-4 w-4" /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-sm overflow-y-auto p-5">
            <SheetHeader className="p-0 pb-4">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <FilterRail />
          </SheetContent>
        </Sheet>

        <Select value={filters.sort ?? "newest"} onValueChange={(v) => setFilters({ sort: v as never }, { resetPage: false })}>
          <SelectTrigger className="w-[200px]" aria-label="Sort properties">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex overflow-hidden rounded-lg border border-border-strong" role="group" aria-label="Result view">
          <ViewButton active={view === "grid"} onClick={() => onViewChange("grid")} label="Grid view">
            <Grid2x2 className="h-4 w-4" />
          </ViewButton>
          <ViewButton active={view === "list"} onClick={() => onViewChange("list")} label="List view">
            <List className="h-4 w-4" />
          </ViewButton>
          <ViewButton active={view === "map"} onClick={() => onViewChange("map")} label="Map view">
            <MapIcon className="h-4 w-4" />
          </ViewButton>
        </div>
      </div>
    </div>
  );
}

function ViewButton({ active, onClick, label, children }: { active: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        "flex h-11 w-11 items-center justify-center border-l border-border-strong first:border-l-0 transition-colors",
        active ? "bg-navy-800 text-white" : "bg-transparent text-ink-secondary hover:text-navy-800",
      )}
    >
      {children}
    </button>
  );
}
