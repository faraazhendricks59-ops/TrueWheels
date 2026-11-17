"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { readSavedSearches } from "@/lib/saved-searches";

const VIEWED_KEY = "truewheels_viewed_vehicles";
const SAVED_KEY = "truewheels_saved_vehicles";
const VIEW_LIMIT = 20;

interface PersonalizationContextValue {
  viewedVehicles: string[];
  savedVehicles: string[];
  /** Query strings of the user's saved searches. */
  searchQueries: string[];
  isHydrated: boolean;
  trackView: (vehicleId: string) => void;
  trackSave: (vehicleId: string) => void;
  toggleSave: (vehicleId: string) => void;
  clearHistory: () => void;
}

const PersonalizationContext = createContext<PersonalizationContextValue>({
  viewedVehicles: [],
  savedVehicles: [],
  searchQueries: [],
  isHydrated: false,
  trackView: () => {},
  trackSave: () => {},
  toggleSave: () => {},
  clearHistory: () => {},
});

export const usePersonalization = () => useContext(PersonalizationContext);

function readIds(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // Storage being unavailable must not break the page.
  }
}

/**
 * Tracks what the visitor has looked at and saved, on this device only. Signals
 * are read after mount, because reading during render would disagree with the
 * server-rendered HTML.
 */
export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const [viewedVehicles, setViewedVehicles] = useState<string[]>([]);
  const [savedVehicles, setSavedVehicles] = useState<string[]>([]);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setViewedVehicles(readIds(VIEWED_KEY));
    setSavedVehicles(readIds(SAVED_KEY));
    setSearchQueries(readSavedSearches().map((search) => search.query).filter(Boolean));
    setIsHydrated(true);
  }, []);

  const trackView = useCallback((vehicleId: string) => {
    setViewedVehicles((previous) => {
      const next = [vehicleId, ...previous.filter((id) => id !== vehicleId)].slice(0, VIEW_LIMIT);
      writeIds(VIEWED_KEY, next);
      return next;
    });
  }, []);

  const trackSave = useCallback((vehicleId: string) => {
    setSavedVehicles((previous) => {
      if (previous.includes(vehicleId)) return previous;
      const next = [vehicleId, ...previous].slice(0, VIEW_LIMIT);
      writeIds(SAVED_KEY, next);
      return next;
    });
  }, []);

  const toggleSave = useCallback((vehicleId: string) => {
    setSavedVehicles((previous) => {
      const next = previous.includes(vehicleId)
        ? previous.filter((id) => id !== vehicleId)
        : [vehicleId, ...previous].slice(0, VIEW_LIMIT);
      writeIds(SAVED_KEY, next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setViewedVehicles([]);
    writeIds(VIEWED_KEY, []);
  }, []);

  const value = useMemo(
    () => ({
      viewedVehicles,
      savedVehicles,
      searchQueries,
      isHydrated,
      trackView,
      trackSave,
      toggleSave,
      clearHistory,
    }),
    [viewedVehicles, savedVehicles, searchQueries, isHydrated, trackView, trackSave, toggleSave, clearHistory]
  );

  return <PersonalizationContext.Provider value={value}>{children}</PersonalizationContext.Provider>;
}
