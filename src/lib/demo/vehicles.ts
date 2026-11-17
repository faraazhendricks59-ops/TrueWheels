export interface DemoVehicle {
  id: string;
  title: string;
  price: number;
  mileage: number;
  location: string;
  year: number;
}

const MAKES = ["BMW", "Volkswagen", "Toyota", "Mercedes-Benz", "Ford", "Hyundai", "Audi", "Kia"];
const MODELS = ["M3 Competition", "Golf GTI", "Hilux Legend", "C-Class AMG", "Ranger Raptor", "Tucson", "RS6", "Sportage"];
const LOCATIONS = ["Sandton, GP", "Umhlanga, KZN", "Cape Town, WC", "Pretoria, GP", "Port Elizabeth, EC"];

/** Deterministic demo data — no network, no Math.random (stable across SSR/CSR). */
export const DEMO_VEHICLES: DemoVehicle[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `v-${i}`,
  title: `${2015 + (i % 9)} ${MAKES[i % MAKES.length]} ${MODELS[i % MODELS.length]}`,
  price: 149900 + i * 13750,
  mileage: 5000 + i * 1187,
  location: LOCATIONS[i % LOCATIONS.length],
  year: 2015 + (i % 9),
}));
