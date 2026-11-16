export type FuelType = "Petrol" | "Diesel" | "Hybrid" | "Electric";

export type Transmission = "Manual" | "Automatic";

export type VehicleCondition = "New" | "Used" | "Demo";

export interface VehicleDealer {
  name: string;
  /** slug used by the (future) dealer profile route */
  slug: string;
  verified: boolean;
}

export interface Vehicle {
  id: string;
  title: string;
  description: string;
  make: string;
  model: string;
  /** e.g. "GTI" — the trim, kept separate from the model. */
  variant?: string;
  year: number;
  price: number;
  /** Kilometres on the odometer. */
  mileage: number;
  fuelType: FuelType;
  transmission: Transmission;
  condition: VehicleCondition;
  colour: string;
  bodyType: string;
  city: string;
  province: string;
  images: string[];
  dealer: VehicleDealer;
}

/**
 * Demo listings backing the vehicle detail page until the real data layer
 * lands. Ids match the entries already referenced by the command palette's
 * search index, so those links resolve instead of 404ing.
 */
export const DEMO_VEHICLES: Vehicle[] = [
  {
    id: "1",
    title: "2021 Volkswagen Golf 8 GTI",
    description:
      "Immaculate 2021 VW Golf 8 GTI with 32,000km. Full service history, one owner, and balance of the factory motor plan. Finished in Moonstone Grey with the optional sunroof and Harmon Kardon sound.",
    make: "Volkswagen",
    model: "Golf 8",
    variant: "GTI",
    year: 2021,
    price: 649000,
    mileage: 32000,
    fuelType: "Petrol",
    transmission: "Automatic",
    condition: "Used",
    colour: "Moonstone Grey",
    bodyType: "Hatchback",
    city: "Sandton",
    province: "Gauteng",
    images: [
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    ],
    dealer: { name: "Prestige Motors SA", slug: "prestige-motors-sa", verified: true },
  },
  {
    id: "2",
    title: "2022 BMW M3 Competition",
    description:
      "2022 BMW M3 Competition with 18,500km. Carbon bucket seats, M Driver's Package, and ceramic brakes. Accident-free with full BMW service history.",
    make: "BMW",
    model: "M3",
    variant: "Competition",
    year: 2022,
    price: 1450000,
    mileage: 18500,
    fuelType: "Petrol",
    transmission: "Automatic",
    condition: "Used",
    colour: "Alpine White",
    bodyType: "Sedan",
    city: "Umhlanga",
    province: "KwaZulu-Natal",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=80",
    ],
    dealer: { name: "Coastal Auto Group", slug: "coastal-auto-group", verified: true },
  },
  {
    id: "3",
    title: "2019 Ford Ranger Raptor",
    description:
      "2019 Ford Ranger Raptor 2.0 BiTurbo 4x4 with 74,000km. Fitted with a canopy and tow bar, serviced on schedule at an authorised Ford dealer.",
    make: "Ford",
    model: "Ranger",
    variant: "Raptor",
    year: 2019,
    price: 785000,
    mileage: 74000,
    fuelType: "Diesel",
    transmission: "Automatic",
    condition: "Used",
    colour: "Conquer Grey",
    bodyType: "Bakkie",
    city: "Cape Town",
    province: "Western Cape",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80",
    ],
    dealer: { name: "Table Bay Motors", slug: "table-bay-motors", verified: false },
  },
];

export function getVehicle(id: string): Vehicle | undefined {
  return DEMO_VEHICLES.find((v) => v.id === id);
}

export const VEHICLE_IDS = DEMO_VEHICLES.map((v) => v.id);

/** "2021 Volkswagen Golf 8 GTI" style label used in titles and breadcrumbs. */
export function vehicleTitle(vehicle: Vehicle): string {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.variant ? ` ${vehicle.variant}` : ""}`;
}

export function formatPrice(price: number): string {
  return `R ${price.toLocaleString("en-ZA")}`;
}
