"use client";

import { useLocalStorageList } from "./use-local-storage-list";

const MAX_COMPARE = 3;

export function useCompare() {
  const list = useLocalStorageList("eminent:compare", MAX_COMPARE);
  return {
    compareIds: list.ids,
    hydrated: list.hydrated,
    toggleCompare: list.toggle,
    isInCompare: list.has,
    clearCompare: list.clear,
    isCompareFull: list.isFull,
    maxCompare: MAX_COMPARE,
  };
}
