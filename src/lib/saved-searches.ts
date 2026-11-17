/**
 * Saved searches are stored on the device until an account exists. This keeps
 * the Save Search flow honest: the search really is persisted and can be
 * reopened, rather than only producing a confirmation toast.
 */
export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  emailAlerts: boolean;
  pushAlerts: boolean;
  createdAt: string;
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

const LABELS: Record<string, string> = {
  q: "Search",
  make: "Make",
  body: "Body type",
  minPrice: "Min price",
  maxPrice: "Max price",
  maxMileage: "Max mileage",
  year: "Year from",
  location: "Location",
  features: "Features",
};

/** Builds a readable default name such as "BMW, SUV under R 500 000". */
export function describeFilters(queryString: string): string {
  const params = new URLSearchParams(queryString);
  const parts: string[] = [];
  const features: string[] = [];

  params.forEach((value, key) => {
    if (!value) return;
    if (key === "features") {
      features.push(...value.split(",").filter(Boolean));
      return;
    }
    const label = LABELS[key];
    if (!label) return;
    if (key === "minPrice" || key === "maxPrice") return;
    parts.push(key === "q" ? value : `${label}: ${value}`);
  });

  const maxPrice = params.get("maxPrice");
  if (maxPrice && Number(maxPrice) > 0) {
    parts.push(`under R ${Number(maxPrice).toLocaleString("en-ZA")}`);
  }

  if (features.length > 0) parts.push(features.join(", "));
  return parts.length > 0 ? parts.join(", ") : "All vehicles";
}
