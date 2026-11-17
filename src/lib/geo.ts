import type { DemoVehicle } from "@/lib/demo/vehicles";

/**
 * Coordinates for the five demo locations. The demo set stores a suburb and
 * province rather than a latitude and longitude, so the map derives positions
 * from that field. This keeps pins consistent with the filtered results instead
 * of a separate invented pin set.
 */
const LOCATION_COORDS: Record<string, [number, number]> = {
  "Sandton, GP": [-26.1076, 28.0567],
  "Pretoria, GP": [-25.7479, 28.2293],
  "Umhlanga, KZN": [-29.7263, 31.0865],
  "Cape Town, WC": [-33.9249, 18.4241],
  "Port Elizabeth, EC": [-33.9608, 25.6022],
};

export const DEFAULT_CENTER: [number, number] = [-29.0, 25.0];
export const DEFAULT_ZOOM = 5;

/** Stable hash so a vehicle always lands on the same spot across renders. */
function hash(id: string): number {
  let value = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    value ^= id.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return Math.abs(value);
}

export function locationCoords(location: string): [number, number] {
  return LOCATION_COORDS[location] ?? DEFAULT_CENTER;
}

/**
 * Spreads pins around their city so they do not stack exactly, using the record
 * id as the seed. Deterministic, so server and client agree.
 */
export function vehicleCoords(vehicle: DemoVehicle): [number, number] {
  const [lat, lng] = locationCoords(vehicle.location);
  const seed = hash(vehicle.id);
  const latOffset = ((seed % 200) / 200 - 0.5) * 0.12;
  const lngOffset = (((seed >> 8) % 200) / 200 - 0.5) * 0.12;
  return [lat + latOffset, lng + lngOffset];
}

/** Great-circle distance in kilometres. */
export function distanceKm(
  [lat1, lng1]: [number, number],
  [lat2, lng2]: [number, number]
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function withinRadius(
  vehicle: DemoVehicle,
  center: [number, number],
  radiusKm: number
): boolean {
  return distanceKm(center, vehicleCoords(vehicle)) <= radiusKm;
}

/** Bounding box of a set of vehicles, for fitting the viewport. */
export function boundsOf(vehicles: DemoVehicle[]): [[number, number], [number, number]] | null {
  if (vehicles.length === 0) return null;
  const coords = vehicles.map(vehicleCoords);
  const lats = coords.map(([lat]) => lat);
  const lngs = coords.map(([, lng]) => lng);
  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)],
  ];
}
