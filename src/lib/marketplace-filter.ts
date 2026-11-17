import { DEMO_VEHICLES, type DemoVehicle } from "@/lib/demo/vehicles";
import {
  vehicleBodyType,
  vehicleHasFeature,
  vehicleMake,
  vehicleProvince,
} from "@/lib/vehicle-facets";

const prices = DEMO_VEHICLES.map((vehicle) => vehicle.price);
const mileages = DEMO_VEHICLES.map((vehicle) => vehicle.mileage);
const years = DEMO_VEHICLES.map((vehicle) => vehicle.year);

/**
 * Bounds are derived from the data and rounded out, not hardcoded. Fixed
 * "sensible" caps would silently hide every vehicle outside them.
 */
export const PRICE_MIN = 0;
export const PRICE_MAX = Math.ceil(Math.max(...prices) / 500_000) * 500_000;
export const MILEAGE_MIN = 0;
export const MILEAGE_MAX = Math.ceil(Math.max(...mileages) / 100_000) * 100_000;
export const YEAR_MIN = Math.min(...years);
export const YEAR_MAX = Math.max(...years);

export interface MarketplaceQuery {
  q: string;
  makes: string[];
  bodies: string[];
  provinces: string[];
  features: string[];
  min: number;
  max: number;
  minMileage: number;
  maxMileage: number;
  yearFrom: number;
}

export const EMPTY_QUERY: MarketplaceQuery = {
  q: "",
  makes: [],
  bodies: [],
  provinces: [],
  features: [],
  min: PRICE_MIN,
  max: PRICE_MAX,
  minMileage: MILEAGE_MIN,
  maxMileage: MILEAGE_MAX,
  yearFrom: YEAR_MIN,
};

function csv(raw: string | null): string[] {
  return (raw ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function parseMarketplaceQuery(params: URLSearchParams): MarketplaceQuery {
  const numeric = (key: string, fallback: number) => {
    const raw = params.get(key);
    if (raw === null || raw.trim() === "") return fallback;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  return {
    q: params.get("q")?.trim() ?? "",
    makes: csv(params.get("make")),
    bodies: csv(params.get("body")),
    provinces: csv(params.get("province")),
    features: csv(params.get("features")),
    min: numeric("min", PRICE_MIN),
    max: numeric("max", PRICE_MAX),
    minMileage: numeric("minMileage", MILEAGE_MIN),
    maxMileage: numeric("maxMileage", MILEAGE_MAX),
    yearFrom: numeric("yearFrom", YEAR_MIN),
  };
}

/** Which list-valued facet to ignore, so its own counts stay unfiltered by itself. */
export type FacetKey = "makes" | "bodies" | "provinces" | "features";

export function filterVehicles(query: MarketplaceQuery, omit?: FacetKey): DemoVehicle[] {
  const term = query.q.toLowerCase();
  return DEMO_VEHICLES.filter((vehicle) => {
    if (term && !vehicle.title.toLowerCase().includes(term) && !vehicle.location.toLowerCase().includes(term)) {
      return false;
    }
    if (omit !== "makes" && query.makes.length > 0 && !query.makes.includes(vehicleMake(vehicle))) return false;
    if (omit !== "bodies" && query.bodies.length > 0 && !query.bodies.includes(vehicleBodyType(vehicle))) return false;
    if (omit !== "provinces" && query.provinces.length > 0 && !query.provinces.includes(vehicleProvince(vehicle))) {
      return false;
    }
    if (
      omit !== "features" &&
      query.features.length > 0 &&
      !query.features.every((feature) => vehicleHasFeature(vehicle, feature))
    ) {
      return false;
    }
    if (vehicle.price < query.min || vehicle.price > query.max) return false;
    if (vehicle.mileage < query.minMileage || vehicle.mileage > query.maxMileage) return false;
    if (vehicle.year < query.yearFrom) return false;
    return true;
  });
}
