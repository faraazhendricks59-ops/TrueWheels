import { DEMO_VEHICLES, type DemoVehicle } from "@/lib/demo/vehicles";
import { EMPTY_QUERY, filterVehicles, type MarketplaceQuery } from "@/lib/marketplace-filter";
import { resolveSearch } from "@/lib/search-relevance";
import { ALL_MAKES, BODY_TYPES, vehicleMake } from "@/lib/vehicle-facets";
import { localeTag } from "@/lib/i18n/locale";
import { instalmentFor } from "@/lib/finance";

export type ToolType = "search" | "finance" | "valuation";

export interface Citation {
  id: string;
  label: string;
  href: string;
}

export interface ToolCall {
  type: ToolType;
  label: string;
  /** What was actually run, shown so the answer can be checked. */
  query: string;
  resultCount?: number;
}

export interface ConciergeReply {
  content: string;
  toolCall?: ToolCall;
  citations: Citation[];
}

const rand = (value: number) => value.toLocaleString(localeTag("en"));

function vehicleHref(vehicle: DemoVehicle): string {
  return `/marketplace?q=${encodeURIComponent(vehicle.title)}`;
}

function citationFor(vehicle: DemoVehicle, index: number): Citation {
  return { id: vehicle.id, label: `${index}. ${vehicle.title}`, href: vehicleHref(vehicle) };
}

/** Human summary of a set of matching vehicles, with the cheapest called out. */
function describeMatches(matches: DemoVehicle[], toolCall: ToolCall): ConciergeReply {
  if (matches.length === 0) {
    return {
      content: `I could not find any listings for that. Try a broader request, for example a make on its own or a higher price ceiling.`,
      toolCall: { ...toolCall, resultCount: 0 },
      citations: [],
    };
  }

  const cheapest = matches.reduce((best, row) => (row.price < best.price ? row : best), matches[0]);
  const top = matches.slice(0, 3);

  return {
    content: `I found ${rand(matches.length)} ${matches.length === 1 ? "listing" : "listings"} matching that. The lowest priced is the ${cheapest.title} at R ${rand(cheapest.price)}, with ${rand(cheapest.mileage)} km in ${cheapest.location}.`,
    toolCall: { ...toolCall, resultCount: matches.length },
    citations: top.map((vehicle, index) => citationFor(vehicle, index + 1)),
  };
}

function parseBudget(text: string): number | null {
  // "under R1.5m", "below 1,5 million", "less than R900k", "under 500 000"
  const million = text.match(/(\d+(?:[.,]\d+)?)\s*(?:m\b|million)/i);
  if (million) return Math.round(Number(million[1].replace(",", ".")) * 1_000_000);
  const thousand = text.match(/(\d+(?:[.,]\d+)?)\s*k\b/i);
  if (thousand) return Math.round(Number(thousand[1].replace(",", ".")) * 1_000);
  const plain = text.match(/r?\s*(\d[\d\s,]{2,})/i);
  if (plain) return Number(plain[1].replace(/[\s,]/g, ""));
  return null;
}

/** Model name (lower case) to the make that sells it, derived from the data. */
const MODEL_TO_MAKE: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const vehicle of DEMO_VEHICLES) {
    const words = vehicle.title.split(" ");
    const make = words[1];
    const model = (words[2] ?? "").toLowerCase();
    if (make && model && !map[model]) map[model] = make;
  }
  return map;
})();

export function findMake(text: string): string | null {
  const lower = text.toLowerCase();
  const direct = ALL_MAKES.find((make) => lower.includes(make.toLowerCase()));
  if (direct) return direct;
  // "Golf" is not a make, but it identifies one; so does a misspelling.
  const model = Object.keys(MODEL_TO_MAKE).find((name) => lower.includes(name));
  if (model) return MODEL_TO_MAKE[model];
  const resolution = resolveSearch(text);
  const corrected = resolution.matches.map((match) => match.corrected);
  return ALL_MAKES.find((make) => corrected.includes(make.toLowerCase())) ?? null;
}

/** The model name in the question, if one is named. */
function findModel(text: string): string | null {
  const lower = text.toLowerCase();
  const model = Object.keys(MODEL_TO_MAKE).find((name) => lower.includes(name));
  return model ? model.replace(/\b\w/g, (c) => c.toUpperCase()) : null;
}

function findBody(text: string): string | null {
  const lower = text.toLowerCase();
  return BODY_TYPES.find((body) => lower.includes(body.toLowerCase())) ?? null;
}

function searchIntent(text: string): ConciergeReply {
  const make = findMake(text);
  const body = findBody(text);
  const budget = parseBudget(text);
  const wantsLowMileage = /low mileage|low km|few km|barely driven/i.test(text);

  // Free text is only used when nothing structured was recognised. Passing the
  // whole sentence through the text matcher resolves to nothing, because words
  // like "under" and "500k" appear in no listing title.
  const recognised = Boolean(make || body || budget || wantsLowMileage);
  const query: MarketplaceQuery = {
    ...EMPTY_QUERY,
    q: recognised ? "" : text.replace(/[?.,]/g, " ").trim(),
    makes: make ? [make] : [],
    bodies: body ? [body] : [],
    max: budget ?? EMPTY_QUERY.max,
    maxMileage: wantsLowMileage ? 60_000 : EMPTY_QUERY.maxMileage,
  };

  let matches = filterVehicles(query);
  // A free-text query that matches nothing should still offer the make's stock.
  if (matches.length === 0 && query.q && make) {
    matches = filterVehicles({ ...query, q: "" });
  }

  const parts: string[] = [];
  if (make) parts.push(make);
  if (body) parts.push(body);
  if (budget) parts.push(`under R ${rand(budget)}`);
  if (wantsLowMileage) parts.push("low mileage");

  return describeMatches(matches, {
    type: "search",
    label: "Searched the listings",
    query: parts.length > 0 ? parts.join(" · ") : `“${text.trim()}”`,
  });
}

function financeIntent(text: string): ConciergeReply {
  // Reuses the budget parser so "R1.5m" and "R900k" are read correctly; a bare
  // digit regex read "1.5m" as 1.
  const parsed = parseBudget(text);
  const price = parsed && parsed >= 20_000 ? parsed : 450_000;
  const termMonths = /72|six year/i.test(text) ? 72 : /48|four year/i.test(text) ? 48 : 60;
  const { monthly, deposit, termMonths: term, annualRate } = instalmentFor(price, { termMonths });

  const query = `R ${rand(price)} over ${term} months, 10% deposit, ${(annualRate * 100).toFixed(1)}% interest`;
  const matches = filterVehicles({ ...EMPTY_QUERY, max: price }).slice(0, 3);

  return {
    content: `On R ${rand(price)} with a 10% deposit (R ${rand(deposit)}) over ${term} months at ${(annualRate * 100).toFixed(1)}%, the instalment works out to about R ${rand(monthly)} a month before insurance. That is an estimate, not a credit offer.`,
    toolCall: { type: "finance", label: "Calculated the instalment", query, resultCount: matches.length },
    citations: matches.map((vehicle, index) => citationFor(vehicle, index + 1)),
  };
}

function valuationIntent(text: string): ConciergeReply {
  const make = findMake(text);
  const model = findModel(text);
  const yearMatch = text.match(/\b(20\d\d)\b/);
  const year = yearMatch ? Number(yearMatch[1]) : 2019;
  const mileageMatch = text.match(/(\d[\d\s,]{2,})\s*(?:km|kilomet)/i);
  const mileage = mileageMatch ? Number(mileageMatch[1].replace(/[\s,]/g, "")) : 80_000;

  // Compare like with like: same make and, where named, the same model. The
  // catalogue's prices are spread very wide across a make, so an average over
  // a whole make is not a comparable.
  let pool = make ? DEMO_VEHICLES.filter((row) => vehicleMake(row) === make) : DEMO_VEHICLES;
  if (model) {
    const byModel = pool.filter((row) => row.title.toLowerCase().includes(model.toLowerCase()));
    if (byModel.length >= 3) pool = byModel;
  }

  // Prefer the same model year, since that is what was asked about; only widen
  // if too few listings share it. Within that, nearest mileage wins.
  const sameYear = pool.filter((row) => Math.abs(row.year - year) <= 1);
  const candidatePool = sameYear.length >= 3 ? sameYear : pool;
  const comparables = candidatePool
    .slice()
    .sort((a, b) => Math.abs(a.mileage - mileage) - Math.abs(b.mileage - mileage))
    .slice(0, 5);

  const prices = comparables.map((row) => row.price).sort((a, b) => a - b);
  // Median, not mean: a single outlier would drag a mean far off.
  const median = prices[Math.floor(prices.length / 2)] ?? 0;
  const lowest = prices[0] ?? 0;
  const highest = prices[prices.length - 1] ?? 0;

  const label = model
    ? `${year} ${make} ${model}`
    : make
      ? `${year} ${make}`
      : `${year} vehicle`;

  return {
    content: `${comparables.length} similar ${label} listings are advertised between R ${rand(lowest)} and R ${rand(highest)}, with a middle figure of R ${rand(median)}. Treat that as a rough guide from asking prices in this catalogue, not a formal appraisal.`,
    toolCall: {
      type: "valuation",
      label: "Compared similar listings",
      query: `${label} · ${rand(mileage)} km`,
      resultCount: comparables.length,
    },
    citations: comparables.slice(0, 3).map((vehicle, index) => citationFor(vehicle, index + 1)),
  };
}

function introReply(): ConciergeReply {
  return {
    content:
      "I can search the listings, estimate a monthly instalment, or value a car against what is currently advertised. Ask me something like “bakkes under R400k” or “what would a 2019 Golf with 90000 km be worth?”",
    citations: [],
  };
}

/**
 * Resolves a question to an answer using the catalogue that is actually on this
 * device. No model is called: the figures come from real listings and the
 * arithmetic is shown, so every claim can be checked.
 */
export function answer(question: string): ConciergeReply {
  const text = question.trim();
  if (!text) return introReply();

  if (/\b(instalment|installment|finance|monthly|afford|deposit)\b/i.test(text)) {
    return financeIntent(text);
  }
  if (/\b(worth|value|valuation|trade[- ]?in|resale)\b/i.test(text)) {
    return valuationIntent(text);
  }
  if (/\b(find|show|search|looking for|browse|under|below|cheap)\b/i.test(text) || findMake(text)) {
    return searchIntent(text);
  }
  return {
    content:
      "I can search listings, estimate finance, or value a car. Try “SUVs under R500k” or “instalment on a R600 000 bakkie”.",
    citations: [],
  };
}

export const SUGGESTED_PROMPTS = [
  "Bakkies under R400k",
  "Instalment on a R600 000 car",
  "What is a 2019 Golf with 90 000 km worth?",
];
