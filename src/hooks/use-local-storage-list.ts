"use client";

import { useCallback, useEffect, useState } from "react";

/** A small string-id list persisted to localStorage — backs shortlist & compare. */
export function useLocalStorageList(key: string, max?: number) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reading localStorage must happen post-mount (it's unavailable during
    // SSR) — this is the standard hydrate-from-browser-storage effect, not
    // state derived from props/state, so the usual "avoid setState in
    // effect" guidance doesn't apply here.
    try {
      const raw = window.localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setIds(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, [key]);

  // Persist whenever `ids` changes, once hydrated — kept as its own effect
  // (rather than called from inside a setState updater) so the write is a
  // pure side effect of committed state, not something that can run twice
  // per update under StrictMode's updater-function double-invocation.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(ids));
    } catch {
      // storage unavailable — state still updates in-memory
    }
  }, [key, ids, hydrated]);

  const add = useCallback(
    (id: string) => {
      setIds((prev) => (prev.includes(id) ? prev : max ? [...prev, id].slice(-max) : [...prev, id]));
    },
    [max],
  );

  const remove = useCallback((id: string) => {
    setIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const toggle = useCallback(
    (id: string) => {
      setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : max ? [...prev, id].slice(-max) : [...prev, id]));
    },
    [max],
  );

  const clear = useCallback(() => setIds([]), []);
  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, hydrated, add, remove, toggle, clear, has, isFull: max ? ids.length >= max : false };
}
