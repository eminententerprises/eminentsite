import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";

/** Same storage keys and compare limit as the website's localStorage lists. */
const SHORTLIST_KEY = "eminent:shortlist";
const COMPARE_KEY = "eminent:compare";
export const MAX_COMPARE = 3;

interface SavedState {
  shortlist: string[];
  compare: string[];
  hydrated: boolean;
  isShortlisted: (id: string) => boolean;
  toggleShortlist: (id: string) => void;
  clearShortlist: () => void;
  isInCompare: (id: string) => boolean;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
}

const SavedContext = createContext<SavedState | null>(null);

function parse(raw: string | null): string[] {
  try {
    const value = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function SavedProvider({ children }: { children: ReactNode }) {
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.multiGet([SHORTLIST_KEY, COMPARE_KEY])
      .then(([[, s], [, c]]) => {
        setShortlist(parse(s));
        setCompare(parse(c).slice(0, MAX_COMPARE));
      })
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(SHORTLIST_KEY, JSON.stringify(shortlist)).catch(() => undefined);
  }, [shortlist, hydrated]);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(COMPARE_KEY, JSON.stringify(compare)).catch(() => undefined);
  }, [compare, hydrated]);

  const toggleShortlist = useCallback((id: string) => {
    Haptics.selectionAsync().catch(() => undefined);
    setShortlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) {
        Alert.alert("Compare is full", `You can compare up to ${MAX_COMPARE} properties. Remove one to add another.`);
        return prev;
      }
      Haptics.selectionAsync().catch(() => undefined);
      return [...prev, id];
    });
  }, []);

  const value = useMemo<SavedState>(
    () => ({
      shortlist,
      compare,
      hydrated,
      isShortlisted: (id) => shortlist.includes(id),
      toggleShortlist,
      clearShortlist: () => setShortlist([]),
      isInCompare: (id) => compare.includes(id),
      toggleCompare,
      clearCompare: () => setCompare([]),
    }),
    [shortlist, compare, hydrated, toggleShortlist, toggleCompare],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used inside SavedProvider");
  return ctx;
}
