import { DEMO_VEHICLES, type DemoVehicle } from "@/lib/demo/vehicles";

/**
 * Comparison specs. The listings carry only price, mileage, year and location,
 * so the mechanical figures are derived deterministically from each record:
 * a per-model profile plus a small jitter seeded from the id. Two vehicles with
 * the same id always produce the same numbers, on the server and the client.
 */
export interface CompareSpecs {
  performance: { "0-100 km/h": number; "Top Speed": number; Power: number; Torque: number };
  efficiency: { "Fuel Consumption": number; "Tank Size": number; "CO2 Emissions": number };
  dimensions: { Length: number; Width: number; "Boot Space": number; "Kerb Weight": number };
}

export const SPEC_CATEGORIES = [
  { id: "performance", label: "Performance" },
  { id: "efficiency", label: "Efficiency" },
  { id: "dimensions", label: "Dimensions" },
] as const;

export type SpecCategory = (typeof SPEC_CATEGORIES)[number]["id"];

/** Which direction is better for each metric. */
export const METRIC_DIRECTIONS: Record<string, "lower" | "higher"> = {
  price: "lower",
  mileage: "lower",
  year: "higher",
  "0-100 km/h": "lower",
  "Fuel Consumption": "lower",
  "CO2 Emissions": "lower",
  "Kerb Weight": "lower",
  "Top Speed": "higher",
  Power: "higher",
  Torque: "higher",
  "Tank Size": "higher",
  "Boot Space": "higher",
  Length: "higher",
  Width: "higher",
};

interface MetricFormat {
  unit: string;
  decimals: number;
}

/** Each metric carries its own unit, so a value is never shown with the wrong one. */
export const METRIC_FORMAT: Record<string, MetricFormat> = {
  "0-100 km/h": { unit: "s", decimals: 1 },
  "Top Speed": { unit: "km/h", decimals: 0 },
  Power: { unit: "kW", decimals: 0 },
  Torque: { unit: "Nm", decimals: 0 },
  "Fuel Consumption": { unit: "L/100km", decimals: 1 },
  "Tank Size": { unit: "L", decimals: 0 },
  "CO2 Emissions": { unit: "g/km", decimals: 0 },
  Length: { unit: "mm", decimals: 0 },
  Width: { unit: "mm", decimals: 0 },
  "Boot Space": { unit: "L", decimals: 0 },
  "Kerb Weight": { unit: "kg", decimals: 0 },
};

interface ModelProfile {
  match: string;
  power: number;
  torque: number;
  accel: number;
  topSpeed: number;
  fuel: number;
  tank: number;
  co2: number;
  length: number;
  width: number;
  boot: number;
  weight: number;
}

const MODEL_PROFILES: ModelProfile[] = [
  { match: "M3", power: 375, torque: 650, accel: 3.9, topSpeed: 290, fuel: 10.2, tank: 59, co2: 232, length: 4794, width: 1903, boot: 480, weight: 1730 },
  { match: "RS6", power: 441, torque: 800, accel: 3.6, topSpeed: 305, fuel: 11.7, tank: 73, co2: 268, length: 4995, width: 1951, boot: 565, weight: 2075 },
  { match: "C-Class", power: 375, torque: 700, accel: 4.0, topSpeed: 290, fuel: 11.5, tank: 66, co2: 262, length: 4751, width: 1877, boot: 455, weight: 1830 },
  { match: "Golf", power: 180, torque: 370, accel: 6.2, topSpeed: 250, fuel: 7.4, tank: 55, co2: 168, length: 4289, width: 1789, boot: 374, weight: 1462 },
  { match: "Hilux", power: 150, torque: 500, accel: 10.7, topSpeed: 175, fuel: 7.9, tank: 80, co2: 208, length: 5325, width: 1855, boot: 0, weight: 2065 },
  { match: "Ranger", power: 154, torque: 500, accel: 10.5, topSpeed: 180, fuel: 8.4, tank: 80, co2: 220, length: 5362, width: 1860, boot: 0, weight: 2134 },
  { match: "Tucson", power: 132, torque: 265, accel: 9.4, topSpeed: 201, fuel: 6.9, tank: 54, co2: 158, length: 4500, width: 1865, boot: 620, weight: 1554 },
  { match: "Sportage", power: 132, torque: 265, accel: 9.6, topSpeed: 199, fuel: 7.1, tank: 54, co2: 162, length: 4515, width: 1865, boot: 587, weight: 1568 },
];

const FALLBACK_PROFILE = MODEL_PROFILES[4];

function profileFor(title: string): ModelProfile {
  return MODEL_PROFILES.find((profile) => title.includes(profile.match)) ?? FALLBACK_PROFILE;
}

/** Stable seed from an id, so a vehicle's figures never change between renders. */
function seedOf(id: string): number {
  let value = 7;
  for (let i = 0; i < id.length; i += 1) {
    value = (value * 33 + id.charCodeAt(i)) % 9973;
  }
  return value;
}

/** Jitter of at most ±3%, applied per metric so specs differ between listings. */
function jitter(seed: number, offset: number): number {
  return 1 + ((((seed >> offset) % 61) - 30) / 1000);
}

export function specsFor(vehicle: DemoVehicle): CompareSpecs {
  const profile = profileFor(vehicle.title);
  const seed = seedOf(vehicle.id);
  const round = (value: number, decimals: number) =>
    Number((Math.round(value * 10 ** decimals) / 10 ** decimals).toFixed(decimals));

  return {
    performance: {
      "0-100 km/h": round(profile.accel * jitter(seed, 0), 1),
      "Top Speed": round(profile.topSpeed * jitter(seed, 3), 0),
      Power: round(profile.power * jitter(seed, 5), 0),
      Torque: round(profile.torque * jitter(seed, 7), 0),
    },
    efficiency: {
      "Fuel Consumption": round(profile.fuel * jitter(seed, 9), 1),
      "Tank Size": round(profile.tank, 0),
      "CO2 Emissions": round(profile.co2 * jitter(seed, 11), 0),
    },
    dimensions: {
      Length: round(profile.length, 0),
      Width: round(profile.width, 0),
      "Boot Space": round(profile.boot, 0),
      "Kerb Weight": round(profile.weight * jitter(seed, 13), 0),
    },
  };
}

/** The metrics for one category, as a plain record so rows can be built by key. */
export function specValues(vehicle: DemoVehicle, category: SpecCategory): Record<string, number> {
  return specsFor(vehicle)[category] as unknown as Record<string, number>;
}

export function formatMetric(key: string, value: number): string {
  // A bakkie has a load bed rather than a boot, so a zero here means "not
  // applicable" and should not read as a measured figure.
  if (key === "Boot Space" && value === 0) return "—";
  const format = METRIC_FORMAT[key];
  if (!format) return value.toLocaleString("en-ZA");
  return `${value.toFixed(format.decimals)} ${format.unit}`;
}

/** At most four columns, which is the width the table stays readable at. */
export const COMPARE_MAX = 4;

export function resolveCompareVehicles(ids: string[]): DemoVehicle[] {
  const seen = new Set<string>();
  const resolved: DemoVehicle[] = [];
  for (const id of ids) {
    if (seen.has(id) || resolved.length >= COMPARE_MAX) continue;
    const vehicle = DEMO_VEHICLES.find((row) => row.id === id);
    if (vehicle) {
      seen.add(id);
      resolved.push(vehicle);
    }
  }
  return resolved;
}

export interface BestOverall {
  vehicle: DemoVehicle;
  score: number;
  reasons: string[];
}

/**
 * A transparent, explainable score rather than a black box: cheaper, lower
 * mileage, newer and more powerful each count towards it, and every point is
 * reported so the ranking can be checked.
 */
export function bestOverall(vehicles: DemoVehicle[]): BestOverall | null {
  if (vehicles.length < 2) return null;

  const prices = vehicles.map((vehicle) => vehicle.price);
  const mileages = vehicles.map((vehicle) => vehicle.mileage);
  const years = vehicles.map((vehicle) => vehicle.year);
  const powers = vehicles.map((vehicle) => specsFor(vehicle).performance.Power);

  const scoreOf = (vehicle: DemoVehicle) => {
    const priceScore = 1 - (vehicle.price - Math.min(...prices)) / (Math.max(...prices) - Math.min(...prices) || 1);
    const mileageScore = 1 - (vehicle.mileage - Math.min(...mileages)) / (Math.max(...mileages) - Math.min(...mileages) || 1);
    const yearScore = (vehicle.year - Math.min(...years)) / (Math.max(...years) - Math.min(...years) || 1);
    const power = specsFor(vehicle).performance.Power;
    const powerScore = (power - Math.min(...powers)) / (Math.max(...powers) - Math.min(...powers) || 1);
    return priceScore * 0.4 + mileageScore * 0.3 + yearScore * 0.15 + powerScore * 0.15;
  };

  const scored = vehicles
    .map((vehicle) => ({ vehicle, score: scoreOf(vehicle) }))
    .sort((a, b) => b.score - a.score);

  const winner = scored[0];
  const reasons: string[] = [];

  if (winner.vehicle.price === Math.min(...prices)) reasons.push("Lowest price of the set");
  if (winner.vehicle.mileage === Math.min(...mileages)) reasons.push("Lowest mileage of the set");
  if (winner.vehicle.year === Math.max(...years)) reasons.push("Newest of the set");
  if (specsFor(winner.vehicle).performance.Power === Math.max(...powers)) reasons.push("Most powerful of the set");
  if (reasons.length === 0) reasons.push("Best overall balance of price, mileage, age and power");

  return { vehicle: winner.vehicle, score: winner.score, reasons };
}
