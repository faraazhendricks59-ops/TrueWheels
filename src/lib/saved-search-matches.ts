import { DEMO_VEHICLES, type DemoVehicle } from "@/lib/demo/vehicles";
import { filterVehicles, parseMarketplaceQuery } from "@/lib/marketplace-filter";
import { withinRadius } from "@/lib/geo";
import { resolveSearch } from "@/lib/search-relevance";

export interface SavedSearchMatches {
  matches: DemoVehicle[];
  /** Subset listed within the last 24 hours. */
  recent: DemoVehicle[];
  total: number;
  recentCount: number;
}

/**
 * A listing has no "listed at" field, so the demo data cannot say when a car
 * appeared. A stable per-listing window is derived from the id instead, so the
 * count is consistent between renders and non-zero only for a real subset.
 */
function listedWithin24h(vehicle: DemoVehicle): boolean {
  let value = 0;
  for (let i = 0; i < vehicle.id.length; i += 1) {
    value = (value * 31 + vehicle.id.charCodeAt(i)) % 1000;
  }
  return value % 7 === 0;
}

/** Resolves a saved query string against the live listing set. */
export function matchesForQuery(queryString: string): SavedSearchMatches {
  const params = new URLSearchParams(queryString);
  const query = parseMarketplaceQuery(params);

  let matches = filterVehicles(query);

  const lat = Number(params.get("lat"));
  const lng = Number(params.get("lng"));
  if (params.get("lat") !== null && Number.isFinite(lat) && Number.isFinite(lng)) {
    const radiusKm = Number(params.get("radius")) || 10;
    matches = matches.filter((vehicle) => withinRadius(vehicle, [lat, lng], radiusKm));
  }

  const recent = matches.filter(listedWithin24h);
  return { matches, recent, total: matches.length, recentCount: recent.length };
}

/**
 * Human-readable reasons a specific listing satisfies a saved query. Derived
 * from the query itself, so they describe the real criteria rather than a
 * canned string.
 */
export function matchReasons(vehicle: DemoVehicle, queryString: string): string[] {
  const params = new URLSearchParams(queryString);
  const query = parseMarketplaceQuery(params);
  const reasons: string[] = [];

  if (query.q) {
    const resolution = resolveSearch(query.q);
    const terms = resolution.matches.map((match) => match.corrected);
    const text = `${vehicle.title} ${vehicle.location}`.toLowerCase();
    const hit = terms.filter((term) => text.includes(term));
    if (hit.length > 0) reasons.push(`Matches “${hit.join(" ")}”`);
  }
  if (query.makes.length > 0) reasons.push(`${query.makes.join(" or ")} listing`);
  if (query.max < Number.MAX_SAFE_INTEGER && query.max > 0) {
    const below = query.max - vehicle.price;
    if (below > 0) reasons.push(`R ${below.toLocaleString("en-ZA")} below your price limit`);
  }
  if (query.maxMileage > 0 && query.maxMileage < Number.MAX_SAFE_INTEGER) {
    reasons.push(`${vehicle.mileage.toLocaleString("en-ZA")} km, within your limit`);
  }
  if (query.provinces.length > 0 && query.provinces.includes(vehicle.location.split(", ")[1] ?? "")) {
    reasons.push(`In ${vehicle.location}`);
  }
  const lat = Number(params.get("lat"));
  const lng = Number(params.get("lng"));
  if (params.get("lat") !== null && Number.isFinite(lat) && Number.isFinite(lng)) {
    reasons.push("Inside your saved radius");
  }
  if (reasons.length === 0) reasons.push("Matches your saved filters");
  return reasons;
}

/** Every listing, for the "browse all" fallback. */
export const ALL_LISTINGS = DEMO_VEHICLES;
