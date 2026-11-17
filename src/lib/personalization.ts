import { DEMO_VEHICLES, type DemoVehicle } from "@/lib/demo/vehicles";
import { matchesForQuery } from "@/lib/saved-search-matches";
import { specsFor } from "@/lib/comparison-data";
import { vehicleBodyType, vehicleMake } from "@/lib/vehicle-facets";
import { localeTag } from "@/lib/i18n/locale";

export type ReasonKind = "search" | "similar" | "history" | "budget" | "popular";

export interface Recommendation {
  vehicle: DemoVehicle;
  reason: string;
  kind: ReasonKind;
}

export interface SimilarVehicle {
  vehicle: DemoVehicle;
  /** 0-100, from the weighted signals below. */
  score: number;
  reasons: string[];
}

export interface PersonalizationSignals {
  viewedIds: string[];
  savedIds: string[];
  /** Query strings of the user's saved searches. */
  searchQueries: string[];
}

const rand = (value: number) => value.toLocaleString(localeTag("en"));

function byId(id: string): DemoVehicle | undefined {
  return DEMO_VEHICLES.find((vehicle) => vehicle.id === id);
}

/**
 * How alike two listings are, on the signals the catalogue actually holds:
 * model, make, price band, body type and mileage. Returns the score and the
 * individual contributions, so the number can be explained rather than asserted.
 */
export function similarity(a: DemoVehicle, b: DemoVehicle): SimilarVehicle {
  const reasons: string[] = [];
  let score = 0;

  const aModel = a.title.split(" ").slice(2).join(" ").toLowerCase();
  const bModel = b.title.split(" ").slice(2).join(" ").toLowerCase();
  if (aModel === bModel) {
    score += 40;
    reasons.push("Same model");
  }
  if (vehicleMake(a) === vehicleMake(b)) {
    score += 15;
    if (aModel !== bModel) reasons.push(`Also a ${vehicleMake(a)}`);
  }
  if (vehicleBodyType(a) === vehicleBodyType(b)) {
    score += 10;
    if (aModel !== bModel) reasons.push(`Same body type (${vehicleBodyType(a)})`);
  }

  const priceGap = Math.abs(a.price - b.price) / Math.max(a.price, b.price);
  if (priceGap <= 0.15) {
    score += 20;
    reasons.push("Within 15% on price");
  } else if (priceGap <= 0.35) {
    score += 10;
  }

  const mileageGap = Math.abs(a.mileage - b.mileage) / Math.max(a.mileage, b.mileage, 1);
  if (mileageGap <= 0.25) {
    score += 10;
    reasons.push("Similar mileage");
  }

  if (Math.abs(a.year - b.year) <= 2) {
    score += 5;
    if (a.year !== b.year) reasons.push("Close in age");
  }

  return { vehicle: b, score: Math.min(100, score), reasons };
}

/** Listings most like the given one, best first. */
export function similarTo(vehicle: DemoVehicle, limit = 3): SimilarVehicle[] {
  return DEMO_VEHICLES.filter((row) => row.id !== vehicle.id)
    .map((row) => similarity(vehicle, row))
    .filter((match) => match.score >= 35)
    .sort((a, b) => b.score - a.score || a.vehicle.price - b.vehicle.price)
    .slice(0, limit);
}

/**
 * Recommendations built from what the person has actually done: the searches
 * they saved, the cars they looked at, and what they have saved. Each one
 * carries the reason it was chosen.
 */
export function recommendForYou(signals: PersonalizationSignals, limit = 6): Recommendation[] {
  const { viewedIds, savedIds, searchQueries } = signals;
  const out: Recommendation[] = [];
  const added = new Set<string>();
  // Never recommend something the person has already seen or saved: the rail is
  // for discovery, and repeating a viewed car makes it look broken.
  const excluded = new Set<string>([...viewedIds, ...savedIds]);

  const push = (vehicle: DemoVehicle, reason: string, kind: ReasonKind) => {
    if (excluded.has(vehicle.id) || added.has(vehicle.id) || out.length >= limit) return;
    added.add(vehicle.id);
    out.push({ vehicle, reason, kind });
  };

  // 1. Saved searches are the strongest signal: they were stated explicitly.
  for (const query of searchQueries) {
    const { matches } = matchesForQuery(query);
    for (const vehicle of matches.slice(0, 2)) {
      push(vehicle, "Matches a search you saved", "search");
    }
    if (out.length >= limit) break;
  }

  // 2. Cars like the ones already viewed.
  for (const id of viewedIds.slice(0, 3)) {
    const source = byId(id);
    if (!source) continue;
    for (const match of similarTo(source, 2)) {
      push(match.vehicle, `Similar to the ${source.title} you viewed`, "similar");
    }
  }

  // 3. Fall back to what is cheapest, so the rail is never empty.
  if (out.length < limit) {
    const cheapest = DEMO_VEHICLES.slice().sort((a, b) => a.price - b.price);
    for (const vehicle of cheapest) {
      push(vehicle, "One of the lowest priced listings", "budget");
      if (out.length >= limit) break;
    }
  }

  return out;
}

/** A short list for the "recently viewed" rail, newest first. */
export function viewedVehicles(viewedIds: string[]): DemoVehicle[] {
  return viewedIds.map(byId).filter((vehicle): vehicle is DemoVehicle => Boolean(vehicle));
}

export function vehicleSummary(vehicle: DemoVehicle): string {
  const power = specsFor(vehicle).performance.Power;
  return `${rand(vehicle.mileage)} km · ${vehicle.location} · ${power} kW`;
}
