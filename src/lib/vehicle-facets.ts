import { DEMO_VEHICLES, type DemoVehicle } from "@/lib/demo/vehicles";

/**
 * The demo vehicles carry only title, price, mileage, location and year, so the
 * facets are derived from those rather than stored. Everything here is a pure
 * function of the record, so facets and counts stay consistent with the rows.
 */

const BODY_BY_MODEL: { match: string; body: string }[] = [
  { match: "Hilux", body: "Bakkie" },
  { match: "Ranger", body: "Bakkie" },
  { match: "Tucson", body: "SUV" },
  { match: "Sportage", body: "SUV" },
  { match: "Golf", body: "Hatchback" },
  { match: "M3", body: "Sedan" },
  { match: "C-Class", body: "Sedan" },
  { match: "RS6", body: "Sedan" },
];

export const BODY_TYPES = ["Bakkie", "SUV", "Hatchback", "Sedan"];

export const FEATURES: { id: string; label: string; premium?: boolean }[] = [
  { id: "sunroof", label: "Sunroof / Moonroof" },
  { id: "leather", label: "Leather seats" },
  { id: "verified", label: "Verified dealers only", premium: true },
];

/** Title is "<year> <make> <model>", so the make is the second token. */
export function vehicleMake(vehicle: DemoVehicle): string {
  return vehicle.title.split(" ")[1] ?? "Other";
}

export function vehicleBodyType(vehicle: DemoVehicle): string {
  return BODY_BY_MODEL.find((entry) => vehicle.title.includes(entry.match))?.body ?? "Sedan";
}

/** Location is "<suburb>, <province>". */
export function vehicleProvince(vehicle: DemoVehicle): string {
  return vehicle.location.split(", ")[1] ?? "";
}

/**
 * Equipment is not in the demo set, so it is derived deterministically from the
 * record id — the same approach the rest of the demo data uses. It is stable
 * across renders and identical on server and client.
 */
export function vehicleHasFeature(vehicle: DemoVehicle, featureId: string): boolean {
  const seed = Number(vehicle.id.replace(/\D/g, "")) || 0;
  switch (featureId) {
    case "sunroof":
      return seed % 4 === 0;
    case "leather":
      return seed % 2 === 0;
    case "verified":
      return seed % 3 === 0;
    default:
      return false;
  }
}

export const ALL_MAKES: string[] = Array.from(new Set(DEMO_VEHICLES.map(vehicleMake))).sort();
export const ALL_PROVINCES: string[] = Array.from(new Set(DEMO_VEHICLES.map(vehicleProvince))).sort();

export function featureLabel(featureId: string): string {
  return FEATURES.find((feature) => feature.id === featureId)?.label ?? featureId;
}
