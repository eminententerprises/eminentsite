import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { FilterState } from "@/types";

interface FiltersState {
  filters: FilterState;
  setFilters: (next: FilterState) => void;
  patchFilters: (patch: Partial<FilterState>) => void;
  resetFilters: () => void;
}

/** Search filters are shared between the Search tab and the Filters sheet. */
export const DEFAULT_FILTERS: FilterState = { sort: "newest" };

const FiltersContext = createContext<FiltersState | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const value = useMemo<FiltersState>(
    () => ({
      filters,
      setFilters,
      patchFilters: (patch) => setFilters((prev) => ({ ...prev, ...patch })),
      resetFilters: () => setFilters((prev) => ({ ...DEFAULT_FILTERS, purpose: prev.purpose })),
    }),
    [filters],
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used inside FiltersProvider");
  return ctx;
}
