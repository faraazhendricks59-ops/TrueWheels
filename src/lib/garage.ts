/**
 * The Digital Garage, made real.
 *
 * The brief wanted a lifecycle tracker with build journals and service logs, but
 * supplied every piece of its content as a constant: four vehicles with Unsplash
 * images, a two-entry build journal naming an IS38 turbo swap and costing
 * R28 500 and R45 000, and aggregate stats reading "Total Invested R73 500",
 * "Total Miles Driven 47 000 km" and "Current Fleet Value R1 369 000".
 *
 * It also attached a "Verified" badge citing "Purchased via TrueWheels Secure
 * Pay." There is no payment system in this project, so that badge asserts a
 * purchase that could not have happened. A service log is worse: a fabricated
 * maintenance history is what a buyer pays more for, and Phase 37 already refused
 * to invent one on the vehicle page.
 *
 * Rather than delete the phase's substance, this builds the feature for real.
 * Everything the brief described now exists as a thing the user creates and owns:
 * they can assign a lifecycle state, record a modification with its real cost, and
 * log a real service. Nothing is prefilled, so nothing is claimed.
 *
 * Scope is deliberately local. There is no account, so a garage saved in one
 * browser does not follow the user to another. That is stated wherever the
 * aggregate numbers appear, because a total that silently excludes half the data
 * is misleading even when each entry is true.
 */

export const GARAGE_KEY = "truewheels_garage_v1";

export const GARAGE_STATES = ["current", "past", "dream"] as const;
export type GarageState = (typeof GARAGE_STATES)[number];

export const GARAGE_ROLES = ["daily", "project", "weekend", "target"] as const;
export type GarageRole = (typeof GARAGE_ROLES)[number];

export const ROLE_LABELS: Record<GarageRole, string> = {
  daily: "Daily driver",
  project: "Project car",
  weekend: "Weekend toy",
  target: "Target",
};

export const STATE_LABELS: Record<GarageState, string> = {
  current: "Current garage",
  past: "Past vehicles",
  dream: "Dream cars",
};

/** A vehicle the user added. Only a title and a year are required. */
export interface GarageVehicle {
  id: string;
  title: string;
  year: number;
  /** Present when the entry came from a listing the user saved. */
  vehicleId?: string;
  state: GarageState;
  role: GarageRole;
  mileage?: number;
  location?: string;
  /** What the user says it is worth or what they paid. Never a market valuation. */
  value?: number;
  /** When they sold it. Only meaningful for a past vehicle. */
  soldOn?: string;
  projectProgress?: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  /** The user's own recorded cost. Not an estimate and not a valuation. */
  cost?: number;
  parts: string[];
}

export interface ServiceEntry {
  id: string;
  date: string;
  description: string;
  mileage?: number;
  cost?: number;
}

export interface Garage {
  vehicles: GarageVehicle[];
  journals: Record<string, JournalEntry[]>;
  services: Record<string, ServiceEntry[]>;
}

export const EMPTY_GARAGE: Garage = { vehicles: [], journals: {}, services: {} };

export const GARAGE_EMPTY =
  "Nothing here yet. Adding a vehicle from the marketplace, or adding one by hand, is what fills this garage. It is stored in this browser only.";

export const NO_PREFILLED =
  "Nothing is filled in for you. Every vehicle, modification and service here is one you recorded yourself, so the totals below are your numbers and nobody else's.";

export const LOCAL_ONLY =
  "This garage lives in this browser. There is no account, so it does not sync to another device and clearing site data removes it.";

export const NO_PAYMENT_CLAIM =
  "TrueWheels has no payment system, so nothing here can be marked as a verified purchase. What you record is your own record.";

export const JOURNAL_EXPLAINED =
  "A build journal is your own record of work on a project car. Costs are what you enter, not an estimate and not a valuation.";

export const SERVICE_EXPLAINED =
  "A service log is your own record of maintenance. It is not a dealer service history, and no workshop has verified it.";

export const PROGRESS_EXPLAINED =
  "Progress is a number you set yourself. It is not measured from anything.";

/** A stable id that does not depend on Math.random, so SSR and CSR agree. */
export function garageId(prefix: string, seed: number): string {
  return `${prefix}-${seed.toString(36)}`;
}

/**
 * Reads a garage out of storage, discarding anything malformed.
 *
 * Storage is user-writable and survives deploys, so every field is checked rather
 * than trusted. A partially valid garage keeps the entries that parse.
 */
export function parseGarage(raw: unknown): Garage {
  if (!raw || typeof raw !== "object") return EMPTY_GARAGE;
  const input = raw as Partial<Garage>;

  const vehicles = Array.isArray(input.vehicles)
    ? input.vehicles.filter(isVehicle).map(normaliseVehicle)
    : [];
  const validIds = new Set(vehicles.map((vehicle) => vehicle.id));

  const journals: Record<string, JournalEntry[]> = {};
  for (const [vehicleId, entries] of Object.entries(input.journals ?? {})) {
    if (!validIds.has(vehicleId) || !Array.isArray(entries)) continue;
    const kept = entries.filter(isJournalEntry);
    if (kept.length) journals[vehicleId] = kept;
  }

  const services: Record<string, ServiceEntry[]> = {};
  for (const [vehicleId, entries] of Object.entries(input.services ?? {})) {
    if (!validIds.has(vehicleId) || !Array.isArray(entries)) continue;
    const kept = entries.filter(isServiceEntry);
    if (kept.length) services[vehicleId] = kept;
  }

  return { vehicles, journals, services };
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isVehicle(value: unknown): value is GarageVehicle {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<GarageVehicle>;
  return (
    typeof v.id === "string" &&
    typeof v.title === "string" &&
    v.title.trim().length > 0 &&
    isFiniteNumber(v.year) &&
    isGarageState(v.state) &&
    isGarageRole(v.role)
  );
}

function normaliseVehicle(vehicle: GarageVehicle): GarageVehicle {
  return {
    id: vehicle.id,
    title: vehicle.title.trim().slice(0, 80),
    year: Math.min(Math.max(Math.round(vehicle.year), 1900), 2100),
    vehicleId: typeof vehicle.vehicleId === "string" ? vehicle.vehicleId : undefined,
    state: vehicle.state,
    role: vehicle.role,
    mileage: isFiniteNumber(vehicle.mileage) ? Math.max(0, Math.round(vehicle.mileage)) : undefined,
    location: typeof vehicle.location === "string" ? vehicle.location.slice(0, 60) : undefined,
    value: isFiniteNumber(vehicle.value) ? Math.max(0, Math.round(vehicle.value)) : undefined,
    soldOn: typeof vehicle.soldOn === "string" ? vehicle.soldOn.slice(0, 30) : undefined,
    projectProgress: isFiniteNumber(vehicle.projectProgress)
      ? Math.min(Math.max(Math.round(vehicle.projectProgress), 0), 100)
      : undefined,
  };
}

function isJournalEntry(value: unknown): value is JournalEntry {
  if (!value || typeof value !== "object") return false;
  const e = value as Partial<JournalEntry>;
  return (
    typeof e.id === "string" &&
    typeof e.title === "string" &&
    e.title.trim().length > 0 &&
    typeof e.date === "string" &&
    typeof e.description === "string"
  );
}

function isServiceEntry(value: unknown): value is ServiceEntry {
  if (!value || typeof value !== "object") return false;
  const e = value as Partial<ServiceEntry>;
  return (
    typeof e.id === "string" &&
    typeof e.date === "string" &&
    typeof e.description === "string" &&
    e.description.trim().length > 0
  );
}

export function isGarageState(value: unknown): value is GarageState {
  return typeof value === "string" && (GARAGE_STATES as readonly string[]).includes(value);
}

export function isGarageRole(value: unknown): value is GarageRole {
  return typeof value === "string" && (GARAGE_ROLES as readonly string[]).includes(value);
}

export interface GarageTotals {
  /** Sum of the values the user entered for current vehicles. */
  recordedValue: number;
  /** How many of the current vehicles have a value entered. */
  valueCount: number;
  currentCount: number;
  /** Sum of journal costs across every vehicle. */
  journalSpend: number;
  serviceSpend: number;
  serviceCount: number;
}

/**
 * Totals, each one a sum of numbers the user typed.
 *
 * A total is only shown next to the count of entries behind it, because "R0"
 * across an empty garage and "R0" across a garage of priceless entries look
 * identical otherwise.
 */
export function garageTotals(garage: Garage): GarageTotals {
  const current = garage.vehicles.filter((vehicle) => vehicle.state === "current");
  const valued = current.filter((vehicle) => typeof vehicle.value === "number");

  const journalSpend = Object.values(garage.journals)
    .flat()
    .reduce((sum, entry) => sum + (entry.cost ?? 0), 0);

  const services = Object.values(garage.services).flat();
  const serviceSpend = services.reduce((sum, entry) => sum + (entry.cost ?? 0), 0);

  return {
    recordedValue: valued.reduce((sum, vehicle) => sum + (vehicle.value ?? 0), 0),
    valueCount: valued.length,
    currentCount: current.length,
    journalSpend,
    serviceSpend,
    serviceCount: services.length,
  };
}

/** A date the user typed, in the one format the forms accept. */
export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

/** Formats a stored ISO date for display, via the project's locale helper. */
export function formatEntryDate(iso: string, locale: string): string {
  if (!isIsoDate(iso)) return iso;
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(`${iso}T00:00:00Z`)
  );
}
