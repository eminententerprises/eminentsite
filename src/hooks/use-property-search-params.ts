"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { FilterState } from "@/types";
import { parseFilters, filtersToParams } from "@/lib/property-filters-url";

export function usePropertySearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const obj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      obj[key] = value;
    });
    return parseFilters(obj);
  }, [searchParams]);

  const setFilters = useCallback(
    (partial: Partial<FilterState>, options?: { resetPage?: boolean }) => {
      const next: FilterState = { ...filters, ...partial };
      if (options?.resetPage !== false) next.page = 1;
      const params = filtersToParams(next);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [filters, pathname, router],
  );

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return { filters, setFilters, clearFilters };
}
