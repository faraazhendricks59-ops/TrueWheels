import { DEMO_VEHICLES, type DemoVehicle } from "@/lib/demo/vehicles";
import { ALL_MAKES, ALL_PROVINCES, BODY_TYPES } from "@/lib/vehicle-facets";

/**
 * Search matching and correction. The index is small and in memory, so the
 * vocabulary is derived from the data rather than hardcoded: a term only gets
 * corrected to something that actually exists in the listings.
 */

/** Common shorthand for makes, expanded before matching. */
const ALIASES: Record<string, string> = {
  vw: "volkswagen",
  merc: "mercedes",
  benz: "mercedes",
  "mercedes-benz": "mercedes",
  chevy: "chevrolet",
  beemer: "bmw",
  bimmer: "bmw",
  landy: "land rover",
};

export const VOCABULARY: string[] = Array.from(
  new Set(
    [
      ...ALL_MAKES,
      ...ALL_PROVINCES,
      ...BODY_TYPES,
      ...DEMO_VEHICLES.flatMap((vehicle) => vehicle.title.split(" ")),
      ...DEMO_VEHICLES.flatMap((vehicle) => vehicle.location.split(/[,\s]+/)),
    ]
      .map((word) => word.toLowerCase().replace(/[^a-z0-9-]/g, ""))
      .filter((word) => word.length > 1 && !/^\d+$/.test(word))
  )
).sort();

export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost);
    }
    previous = current;
  }
  return previous[b.length];
}

/** Shorter words get a tighter budget so "gti" is not "corrected" to "golf". */
function budgetFor(token: string): number {
  if (token.length <= 3) return 0;
  if (token.length <= 4) return 1;
  return 2;
}

export interface TokenMatch {
  token: string;
  /** The word actually searched for, after alias and typo correction. */
  corrected: string;
  wasCorrected: boolean;
}

export function correctToken(token: string): TokenMatch {
  const alias = ALIASES[token];
  if (alias) return { token, corrected: alias, wasCorrected: true };
  if (VOCABULARY.includes(token)) return { token, corrected: token, wasCorrected: false };

  const budget = budgetFor(token);
  if (budget === 0) return { token, corrected: token, wasCorrected: false };

  let best: { word: string; distance: number } | null = null;
  for (const word of VOCABULARY) {
    // Cheap length guard before the quadratic comparison.
    if (Math.abs(word.length - token.length) > budget) continue;
    const distance = levenshtein(token, word);
    if (distance > budget) continue;
    if (!best || distance < best.distance || (distance === best.distance && word.length < best.word.length)) {
      best = { word, distance };
    }
  }
  return best
    ? { token, corrected: best.word, wasCorrected: true }
    : { token, corrected: token, wasCorrected: false };
}

export interface SearchResolution {
  /** Vehicles matching every term. */
  results: DemoVehicle[];
  matches: TokenMatch[];
  /** Corrected query, or the original when nothing was corrected. */
  suggestion: string;
  /** Set when the literal query found nothing but a corrected one does. */
  correction: { original: string; corrected: string; count: number } | null;
  /** Set when no term could be satisfied and dropping one would help. */
  broaden: { query: string; count: number } | null;
}

function vehicleText(vehicle: DemoVehicle): string {
  return `${vehicle.title} ${vehicle.location}`.toLowerCase();
}

function matchesAll(vehicle: DemoVehicle, terms: string[]): boolean {
  const text = vehicleText(vehicle);
  return terms.every((term) => text.includes(term));
}

export function resolveSearch(query: string, pool: DemoVehicle[] = DEMO_VEHICLES): SearchResolution {
  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return { results: pool, matches: [], suggestion: query, correction: null, broaden: null };
  }

  const matches = tokens.map(correctToken);
  const literalTerms = tokens;
  const correctedTerms = matches.map((match) => match.corrected);

  const literalResults = pool.filter((vehicle) => matchesAll(vehicle, literalTerms));
  if (literalResults.length > 0) {
    return { results: literalResults, matches, suggestion: query, correction: null, broaden: null };
  }

  // Nothing literal: try the corrected terms.
  const anyCorrected = matches.some((match) => match.wasCorrected);
  if (anyCorrected) {
    const correctedResults = pool.filter((vehicle) => matchesAll(vehicle, correctedTerms));
    if (correctedResults.length > 0) {
      const corrected = correctedTerms.join(" ");
      return {
        results: correctedResults,
        matches,
        suggestion: corrected,
        correction: { original: query.trim(), corrected, count: correctedResults.length },
        broaden: null,
      };
    }
  }

  // Still nothing: find the largest subset of terms that does match, which is
  // the honest way to suggest a broader search.
  if (tokens.length > 1) {
    let best: { query: string; count: number } | null = null;
    for (let drop = 0; drop < tokens.length; drop += 1) {
      const subset = correctedTerms.filter((_, index) => index !== drop);
      const count = pool.filter((vehicle) => matchesAll(vehicle, subset)).length;
      if (count > 0 && (!best || count > best.count)) {
        best = { query: subset.join(" "), count };
      }
    }
    if (best) return { results: [], matches, suggestion: query, correction: null, broaden: best };
  }

  return { results: [], matches, suggestion: query, correction: null, broaden: null };
}

/**
 * Ranking score for a listing against the resolved search terms. Title hits
 * count for more than location hits, and an exact title match dominates. Used
 * by the relevance sort so the top result is genuinely the best match.
 */
export function scoreVehicle(vehicle: DemoVehicle, terms: string[]): number {
  if (terms.length === 0) return 0;
  const title = vehicle.title.toLowerCase();
  const location = vehicle.location.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (title.includes(term)) score += 2;
    else if (location.includes(term)) score += 1;
  }
  if (title === terms.join(" ")) score += 5;
  if (terms.every((term) => title.includes(term))) score += 1;
  return score;
}

export interface RelevanceReason {
  id: string;
  label: string;
  kind: "match" | "price" | "mileage" | "location" | "year";
  weight: "high" | "medium" | "low";
}

/**
 * Reasons are computed from the result set, so they describe the ranking that
 * actually happened rather than a fixed explanation.
 */
export function explainTopMatch(
  vehicle: DemoVehicle,
  results: DemoVehicle[],
  terms: string[]
): RelevanceReason[] {
  // Without search terms there is no ranking to explain, so the badge is not
  // shown at all rather than inventing a reason for a plain browse.
  if (terms.length === 0 || results.length === 0) return [];

  const reasons: RelevanceReason[] = [];

  const text = vehicleText(vehicle);
  const matchedTerms = terms.filter((term) => text.includes(term));
  if (matchedTerms.length > 0) {
    reasons.push({
      id: "terms",
      label:
        matchedTerms.length === terms.length
          ? `Matches all ${terms.length} of your search terms`
          : `Matches ${matchedTerms.length} of ${terms.length} search terms`,
      kind: "match",
      weight: matchedTerms.length === terms.length ? "high" : "medium",
    });
  }

  if (vehicle.title.toLowerCase() === terms.join(" ")) {
    reasons.push({ id: "exact", label: "Exact title match", kind: "match", weight: "high" });
  }

  // Median rather than mean: a couple of very expensive listings would drag a
  // mean far away from what "typical" means for this result set.
  const prices = results.map((row) => row.price).sort((a, b) => a - b);
  const medianPrice = prices[Math.floor(prices.length / 2)];
  const priceDelta = Math.round(((medianPrice - vehicle.price) / medianPrice) * 100);
  if (results.length > 1 && Math.abs(priceDelta) >= 5) {
    reasons.push({
      id: "price",
      label:
        priceDelta > 0
          ? `Priced ${priceDelta}% below the median of these results`
          : `Priced ${Math.abs(priceDelta)}% above the median of these results`,
      kind: "price",
      weight: priceDelta > 0 ? "high" : "low",
    });
  }

  const mileages = results.map((row) => row.mileage);
  if (vehicle.mileage === Math.min(...mileages) && results.length > 1) {
    reasons.push({ id: "mileage", label: "Lowest mileage of these results", kind: "mileage", weight: "medium" });
  }

  const newest = Math.max(...results.map((row) => row.year));
  if (vehicle.year === newest && results.length > 1) {
    reasons.push({ id: "year", label: "Newest of these results", kind: "year", weight: "medium" });
  }

  reasons.push({
    id: "location",
    label: `Located in ${vehicle.location}`,
    kind: "location",
    weight: "low",
  });

  return reasons;
}
