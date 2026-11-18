/**
 * Saved searches are stored on the device until an account exists. This keeps
 * the Save Search flow honest: the search really is persisted and can be
 * reopened, rather than only producing a confirmation toast.
 */
export type AlertFrequency = "instant" | "daily" | "weekly" | "off";

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  emailAlerts: boolean;
  pushAlerts: boolean;
  /** Defaults to "instant" for entries saved before frequency existed. */
  frequency?: AlertFrequency;
  createdAt: string;
}

export const FREQUENCY_OPTIONS: { id: AlertFrequency; label: string; description: string }[] = [
  { id: "instant", label: "Instant", description: "Notify me as soon as a match is listed." },
  { id: "daily", label: "Daily digest", description: "One summary each morning." },
  { id: "weekly", label: "Weekly digest", description: "One summary every Monday." },
  { id: "off", label: "Paused", description: "Keep the search, stop the alerts." },
];

export function frequencyOf(search: SavedSearch): AlertFrequency {
  return search.frequency ?? "instant";
}

export function updateSavedSearch(
  id: string,
  patch: Partial<Omit<SavedSearch, "id" | "createdAt">>
): SavedSearch | null {
  if (typeof window === "undefined") return null;
  const searches = readSavedSearches();
  const index = searches.findIndex((entry) => entry.id === id);
  if (index === -1) return null;
  const updated = { ...searches[index], ...patch };
  searches[index] = updated;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    return updated;
  } catch {
    return null;
  }
}

export function removeSavedSearch(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const remaining = readSavedSearches().filter((entry) => entry.id !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
  } catch {
    // Storage being unavailable must not break the page.
  }
}

const STORAGE_KEY = "truewheels_saved_searches";

export function readSavedSearches(): SavedSearch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedSearch[]) : [];
  } catch {
    return [];
  }
}

export function addSavedSearch(input: Omit<SavedSearch, "id" | "createdAt">): SavedSearch | null {
  if (typeof window === "undefined") return null;
  const entry: SavedSearch = {
    ...input,
    id: `ss-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...readSavedSearches()]));
    return entry;
  } catch {
    return null;
  }
}

// Keys must match what AdvancedFilterPanel writes to the URL (min/max, not
// minPrice/maxPrice), or the generated name silently omits the price range.
const LABELS: Record<string, string> = {
  q: "Search",
  make: "Make",
  body: "Body type",
  province: "Province",
  maxMileage: "Max mileage",
  minMileage: "Min mileage",
  yearFrom: "Year from",
  features: "Features",
};

const FEATURE_LABELS: Record<string, string> = {
  sunroof: "Sunroof",
  leather: "Leather seats",
};

/** Builds a readable default name such as "BMW, SUV under R 500 000". */
export function describeFilters(queryString: string): string {
  const params = new URLSearchParams(queryString);
  const parts: string[] = [];
  const features: string[] = [];

  params.forEach((value, key) => {
    if (!value) return;
    if (key === "features") {
      features.push(...value.split(",").filter(Boolean).map((id) => FEATURE_LABELS[id] ?? id));
      return;
    }
    if (key === "min" || key === "max" || key === "radius") return;
    if (key === "lat" || key === "lng") return;
    const label = LABELS[key];
    if (!label) return;
    parts.push(key === "q" ? value : `${label}: ${value}`);
  });

  const min = Number(params.get("min") ?? 0);
  const max = Number(params.get("max") ?? 0);
  if (min > 0 && max > 0) parts.push(`R ${min.toLocaleString("en-ZA")} - R ${max.toLocaleString("en-ZA")}`);
  else if (max > 0) parts.push(`under R ${max.toLocaleString("en-ZA")}`);
  else if (min > 0) parts.push(`over R ${min.toLocaleString("en-ZA")}`);

  if (features.length > 0) parts.push(features.join(", "));
  return parts.length > 0 ? parts.join(", ") : "All vehicles";
}
