import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Property } from "@/types";
import { fetchAllProperties } from "@/lib/repositories/property-repository";

interface PropertiesState {
  properties: Property[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  /** Re-fetches from Supabase; pass `silent` to skip the pull-to-refresh spinner. */
  refresh: (opts?: { silent?: boolean }) => Promise<void>;
  getBySlug: (slug: string) => Property | undefined;
  getById: (id: string) => Property | undefined;
}

const PropertiesContext = createContext<PropertiesState | null>(null);

/** Listings are re-fetched when the app returns after this long, so admin edits show up. */
const STALE_AFTER_MS = 5 * 60 * 1000;

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetched = useRef(0);

  /** Fetches listings; every state update happens after the network call resolves. */
  const load = useCallback(
    () =>
      fetchAllProperties()
        .then((data) => {
          setProperties(data);
          setError(null);
          lastFetched.current = Date.now();
        })
        .catch((e: unknown) => {
          setError(e instanceof Error ? e.message : "Couldn't load listings.");
        })
        .finally(() => {
          setLoading(false);
          setRefreshing(false);
        }),
    [],
  );

  const refresh = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!opts?.silent) setRefreshing(true);
      await load();
    },
    [load],
  );

  useEffect(() => {
    load();
  }, [load]);

  // Background refresh when the cached list goes stale.
  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() - lastFetched.current > STALE_AFTER_MS) load();
    }, 60 * 1000);
    return () => clearInterval(id);
  }, [load]);

  const value = useMemo<PropertiesState>(() => {
    const bySlug = new Map(properties.map((p) => [p.slug, p]));
    const byId = new Map(properties.map((p) => [p.id, p]));
    return {
      properties,
      loading,
      refreshing,
      error,
      refresh,
      getBySlug: (slug) => bySlug.get(slug),
      getById: (id) => byId.get(id),
    };
  }, [properties, loading, refreshing, error, refresh]);

  return <PropertiesContext.Provider value={value}>{children}</PropertiesContext.Provider>;
}

export function useProperties() {
  const ctx = useContext(PropertiesContext);
  if (!ctx) throw new Error("useProperties must be used inside PropertiesProvider");
  return ctx;
}
