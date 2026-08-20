"use client";

import { useLocalStorageList } from "./use-local-storage-list";

export function useShortlist() {
  const list = useLocalStorageList("eminent:shortlist");
  return { shortlistedIds: list.ids, hydrated: list.hydrated, toggleShortlist: list.toggle, isShortlisted: list.has, clearShortlist: list.clear };
}
