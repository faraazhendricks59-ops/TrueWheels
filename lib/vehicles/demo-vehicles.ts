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
  /** Surfaced in the "Featured" rail; a small curated subset. */
  featured?: boolean;
  /** ISO date the listing was published, used for "newest first". */
  createdAt: string;
}

/**
 * Attribution for a demo photo. These images are Creative Commons works
 * from Wikimedia Commons, so the licence and author must travel with
 * them wherever they are displayed.
 */
export interface PhotoCredit {
  author: string;
  licence: string;
  licenceUrl: string;
  sourceUrl: string;
}

/** Keyed by image URL. CC BY / CC BY-SA both require attribution. */
export const PHOTO_CREDITS: Record<string, PhotoCredit> = {
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Volkswagen_Golf_GTI_Mk8_Dolphin_Gray_Metallic_%288%29.jpg/1920px-Volkswagen_Golf_GTI_Mk8_Dolphin_Gray_Metallic_%288%29.jpg": {
    author: "Damian B Oh",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Volkswagen_Golf_GTI_Mk8_Dolphin_Gray_Metallic_(8).jpg",
  },
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/BMW_M3_Competition_%28G80%29_1X7A0170.jpg/1920px-BMW_M3_Competition_%28G80%29_1X7A0170.jpg": {
    author: "Alexander Migl",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:BMW_M3_Competition_(G80)_1X7A0170.jpg",
  },
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Ford_Ranger_Raptor_%28P703%29_1X7A6774.jpg/1920px-Ford_Ranger_Raptor_%28P703%29_1X7A6774.jpg": {
    author: "Alexander-93",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ford_Ranger_Raptor_(P703)_1X7A6774.jpg",
  },
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/2020_Toyota_Hilux_Revo_4x4_Double-Cab_2.8_Rocco.jpg/1920px-2020_Toyota_Hilux_Revo_4x4_Double-Cab_2.8_Rocco.jpg": {
    author: "Chanokchon",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2020_Toyota_Hilux_Revo_4x4_Double-Cab_2.8_Rocco.jpg",
  },
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Toyota_Fortuner%2C_Cape_Town_%28P1060077%29.jpg/1920px-Toyota_Fortuner%2C_Cape_Town_%28P1060077%29.jpg": {
    author: "Matti Blume",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Toyota_Fortuner,_Cape_Town_(P1060077).jpg",
  },
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Toyota_Corolla_Cross_Hybrid_1X7A1861.jpg/1920px-Toyota_Corolla_Cross_Hybrid_1X7A1861.jpg": {
    author: "Alexander-93",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Toyota_Corolla_Cross_Hybrid_1X7A1861.jpg",
  },
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Volkswagen_Polo_VI_%282021%29_IMG_5322.jpg/1920px-Volkswagen_Polo_VI_%282021%29_IMG_5322.jpg": {
    author: "Alexander Migl",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Volkswagen_Polo_VI_(2021)_IMG_5322.jpg",
  },
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/MERCEDES-BENZ_C-CLASS_LWB_%28W206%29_China_%2816%29.jpg/1920px-MERCEDES-BENZ_C-CLASS_LWB_%28W206%29_China_%2816%29.jpg": {
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:MERCEDES-BENZ_C-CLASS_LWB_(W206)_China_(16).jpg",
  },
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Audi-Q5_%282%29_Foto_2020_Free_image_%2849647488661%29.jpg/1920px-Audi-Q5_%282%29_Foto_2020_Free_image_%2849647488661%29.jpg": {
    author: "Autobilder  Gratis",
    licence: "CC BY 2.0",
    licenceUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Audi-Q5_(2)_Foto_2020_Free_image_(49647488661).jpg",
  },
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/2022_Hyundai_Tucson_SEL_with_HTRAC_All_Wheel_Drive.jpg/1920px-2022_Hyundai_Tucson_SEL_with_HTRAC_All_Wheel_Drive.jpg": {
    author: "MercurySable99",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2022_Hyundai_Tucson_SEL_with_HTRAC_All_Wheel_Drive.jpg",
  },
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Kia_Sportage_%28NQ5%29_1X7A0319.jpg/1920px-Kia_Sportage_%28NQ5%29_1X7A0319.jpg": {
    author: "Alexander Migl",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Kia_Sportage_(NQ5)_1X7A0319.jpg",
  },
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/2021_Nissan_Navara_facelift.jpg/1920px-2021_Nissan_Navara_facelift.jpg": {
    author: "Vogue2Voke",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2021_Nissan_Navara_facelift.jpg",
  },
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/2020_Suzuki_Swift_Facelift_IMG_1880.jpg/1920px-2020_Suzuki_Swift_Facelift_IMG_1880.jpg": {
    author: "Alexander-93",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2020_Suzuki_Swift_Facelift_IMG_1880.jpg",
  },
  "https://upload.wikimedia.org/wikipedia/commons/e/e4/2021_Isuzu_D-Max_1.jpg": {
    author: "Calreyn88",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2021_Isuzu_D-Max_1.jpg",
  },
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Haval_Jolion_001.jpg/1920px-Haval_Jolion_001.jpg": {
    author: "JustAnotherCarDesigner",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Haval_Jolion_001.jpg",
  },
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/2020_Land_Rover_Defender.jpg/1920px-2020_Land_Rover_Defender.jpg": {
    author: "Calreyn88",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2020_Land_Rover_Defender.jpg",
  },
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/16_Volkswagen_Tiguan_%282016-2021%29_1.jpg/1920px-16_Volkswagen_Tiguan_%282016-2021%29_1.jpg": {
    author: "Benespit",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:16_Volkswagen_Tiguan_(2016-2021)_1.jpg",
  },
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/2021_Renault_Kwid_1.0_Life.jpg/1920px-2021_Renault_Kwid_1.0_Life.jpg": {
    author: "RL GNZLZ",
    licence: "CC BY-SA 2.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2021_Renault_Kwid_1.0_Life.jpg",
  },
};

export function photoCredit(url: string): PhotoCredit | undefined {
  return PHOTO_CREDITS[url];
}

/**
 * Demo listings backing the marketplace, search and vehicle detail pages
 * until the real data layer lands. Prices and specifications are invented;
 * the imagery is real, so each photo is credited via PHOTO_CREDITS.
 */
export const DEMO_VEHICLES: Vehicle[] = [
  {
    id: "1",
    title: "2021 Volkswagen Golf 8 GTI",
    description:
      "Immaculate 2021 Golf 8 GTI with a full service history and one owner from new. Balance of the factory motor plan applies. Finished in Moonstone Grey with the optional panoramic sunroof and Harman Kardon audio.",
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
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Volkswagen_Golf_GTI_Mk8_Dolphin_Gray_Metallic_%288%29.jpg/1920px-Volkswagen_Golf_GTI_Mk8_Dolphin_Gray_Metallic_%288%29.jpg",
    ],
    dealer: { name: "Prestige Motors SA", slug: "prestige-motors-sa", verified: true },
    featured: true,
    createdAt: "2026-11-12",
  },
  {
    id: "2",
    title: "2022 BMW M3 Competition",
    description:
      "2022 BMW M3 Competition with carbon bucket seats, the M Driver's Package and M Carbon ceramic brakes. Accident-free with a complete BMW service history.",
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
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/BMW_M3_Competition_%28G80%29_1X7A0170.jpg/1920px-BMW_M3_Competition_%28G80%29_1X7A0170.jpg",
    ],
    dealer: { name: "Coastal Auto Group", slug: "coastal-auto-group", verified: true },
    featured: true,
    createdAt: "2026-11-14",
  },
  {
    id: "3",
    title: "2019 Ford Ranger Raptor",
    description:
      "2019 Ranger Raptor 2.0 BiTurbo 4x4 with a fitted canopy and tow bar. Serviced on schedule at an authorised Ford dealer throughout its life.",
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
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Ford_Ranger_Raptor_%28P703%29_1X7A6774.jpg/1920px-Ford_Ranger_Raptor_%28P703%29_1X7A6774.jpg",
    ],
    dealer: { name: "Table Bay Motors", slug: "table-bay-motors", verified: false },
    createdAt: "2026-10-28",
  },
  {
    id: "4",
    title: "2021 Toyota Hilux 2.8 GD-6 Rocco",
    description:
      "2021 Hilux 2.8 GD-6 Rocco double cab 4x4. Fitted with a roller shutter, nudge bar and tow bar. Full Toyota service history and a recent major service.",
    make: "Toyota",
    model: "Hilux",
    variant: "2.8 GD-6 Rocco",
    year: 2021,
    price: 699900,
    mileage: 56000,
    fuelType: "Diesel",
    transmission: "Automatic",
    condition: "Used",
    colour: "Glacier White",
    bodyType: "Bakkie",
    city: "Pretoria",
    province: "Gauteng",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/2020_Toyota_Hilux_Revo_4x4_Double-Cab_2.8_Rocco.jpg/1920px-2020_Toyota_Hilux_Revo_4x4_Double-Cab_2.8_Rocco.jpg",
    ],
    dealer: { name: "Highveld Auto Traders", slug: "highveld-auto-traders", verified: true },
    featured: true,
    createdAt: "2026-11-15",
  },
  {
    id: "5",
    title: "2020 Toyota Fortuner 2.8 GD-6 VX",
    description:
      "2020 Fortuner 2.8 GD-6 VX 4x4 with leather trim and a factory tow bar. Seven seats, full service history and a clean accident record.",
    make: "Toyota",
    model: "Fortuner",
    variant: "2.8 GD-6 VX",
    year: 2020,
    price: 629500,
    mileage: 88000,
    fuelType: "Diesel",
    transmission: "Automatic",
    condition: "Used",
    colour: "Avant-Garde Bronze",
    bodyType: "SUV",
    city: "Cape Town",
    province: "Western Cape",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Toyota_Fortuner%2C_Cape_Town_%28P1060077%29.jpg/1920px-Toyota_Fortuner%2C_Cape_Town_%28P1060077%29.jpg",
    ],
    dealer: { name: "Cape Motor Gallery", slug: "cape-motor-gallery", verified: true },
    createdAt: "2026-10-21",
  },
  {
    id: "6",
    title: "2022 Toyota Corolla Cross 1.8 Hybrid XR",
    description:
      "2022 Corolla Cross 1.8 Hybrid XR with only 24,000km. Balance of the 8-year hybrid battery warranty transfers to the new owner.",
    make: "Toyota",
    model: "Corolla Cross",
    variant: "1.8 Hybrid XR",
    year: 2022,
    price: 479900,
    mileage: 24000,
    fuelType: "Hybrid",
    transmission: "Automatic",
    condition: "Used",
    colour: "Pearl White",
    bodyType: "SUV",
    city: "Durban",
    province: "KwaZulu-Natal",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Toyota_Corolla_Cross_Hybrid_1X7A1861.jpg/1920px-Toyota_Corolla_Cross_Hybrid_1X7A1861.jpg",
    ],
    dealer: { name: "Durban Car Centre", slug: "durban-car-centre", verified: true },
    featured: true,
    createdAt: "2026-11-13",
  },
  {
    id: "7",
    title: "2021 Volkswagen Polo 1.0 TSI Comfortline",
    description:
      "2021 Polo 1.0 TSI Comfortline with a full service history. Economical daily driver with cruise control and a touchscreen infotainment system.",
    make: "Volkswagen",
    model: "Polo",
    variant: "1.0 TSI Comfortline",
    year: 2021,
    price: 339900,
    mileage: 41000,
    fuelType: "Petrol",
    transmission: "Manual",
    condition: "Used",
    colour: "Reflex Silver",
    bodyType: "Hatchback",
    city: "Bloemfontein",
    province: "Free State",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Volkswagen_Polo_VI_%282021%29_IMG_5322.jpg/1920px-Volkswagen_Polo_VI_%282021%29_IMG_5322.jpg",
    ],
    dealer: { name: "Free State Wheels", slug: "free-state-wheels", verified: false },
    createdAt: "2026-10-19",
  },
  {
    id: "8",
    title: "2022 Mercedes-Benz C-Class C200",
    description:
      "2022 Mercedes-Benz C200 with the AMG Line exterior, Burmester sound and a full Mercedes-Benz service history. Balance of the maintenance plan applies.",
    make: "Mercedes-Benz",
    model: "C-Class",
    variant: "C200",
    year: 2022,
    price: 899000,
    mileage: 21000,
    fuelType: "Petrol",
    transmission: "Automatic",
    condition: "Used",
    colour: "Obsidian Black",
    bodyType: "Sedan",
    city: "Sandton",
    province: "Gauteng",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/MERCEDES-BENZ_C-CLASS_LWB_%28W206%29_China_%2816%29.jpg/1920px-MERCEDES-BENZ_C-CLASS_LWB_%28W206%29_China_%2816%29.jpg",
    ],
    dealer: { name: "Prestige Motors SA", slug: "prestige-motors-sa", verified: true },
    featured: true,
    createdAt: "2026-11-11",
  },
  {
    id: "9",
    title: "2020 Audi Q5 40 TDI quattro",
    description:
      "2020 Audi Q5 40 TDI quattro with the S line package, panoramic sunroof and Matrix LED headlights. Serviced at an authorised Audi dealer.",
    make: "Audi",
    model: "Q5",
    variant: "40 TDI quattro",
    year: 2020,
    price: 749000,
    mileage: 67000,
    fuelType: "Diesel",
    transmission: "Automatic",
    condition: "Used",
    colour: "Mythos Black",
    bodyType: "SUV",
    city: "Stellenbosch",
    province: "Western Cape",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Audi-Q5_%282%29_Foto_2020_Free_image_%2849647488661%29.jpg/1920px-Audi-Q5_%282%29_Foto_2020_Free_image_%2849647488661%29.jpg",
    ],
    dealer: { name: "Cape Motor Gallery", slug: "cape-motor-gallery", verified: true },
    createdAt: "2026-10-24",
  },
  {
    id: "10",
    title: "2022 Hyundai Tucson 2.0 Premium",
    description:
      "2022 Hyundai Tucson 2.0 Premium with a panoramic sunroof and heated leather seats. Balance of the 7-year factory warranty applies.",
    make: "Hyundai",
    model: "Tucson",
    variant: "2.0 Premium",
    year: 2022,
    price: 599900,
    mileage: 29000,
    fuelType: "Petrol",
    transmission: "Automatic",
    condition: "Used",
    colour: "Shimmering Silver",
    bodyType: "SUV",
    city: "Port Elizabeth",
    province: "Eastern Cape",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/2022_Hyundai_Tucson_SEL_with_HTRAC_All_Wheel_Drive.jpg/1920px-2022_Hyundai_Tucson_SEL_with_HTRAC_All_Wheel_Drive.jpg",
    ],
    dealer: { name: "Bayview Motors", slug: "bayview-motors", verified: true },
    createdAt: "2026-11-05",
  },
  {
    id: "11",
    title: "2022 Kia Sportage 1.6 CRDi",
    description:
      "2022 Kia Sportage 1.6 CRDi with the GT-Line trim and a full Kia service history. Balance of the 5-year unlimited-kilometre warranty applies.",
    make: "Kia",
    model: "Sportage",
    variant: "1.6 CRDi",
    year: 2022,
    price: 629900,
    mileage: 31000,
    fuelType: "Diesel",
    transmission: "Automatic",
    condition: "Used",
    colour: "Snow White Pearl",
    bodyType: "SUV",
    city: "Centurion",
    province: "Gauteng",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Kia_Sportage_%28NQ5%29_1X7A0319.jpg/1920px-Kia_Sportage_%28NQ5%29_1X7A0319.jpg",
    ],
    dealer: { name: "Centurion Prestige", slug: "centurion-prestige", verified: true },
    createdAt: "2026-11-08",
  },
  {
    id: "12",
    title: "2021 Nissan Navara 2.5 DDTi LE",
    description:
      "2021 Nissan Navara 2.5 DDTi LE double cab 4x4 with a tow bar and rubberised load bin. Serviced on schedule with a full history.",
    make: "Nissan",
    model: "Navara",
    variant: "2.5 DDTi LE",
    year: 2021,
    price: 569900,
    mileage: 52000,
    fuelType: "Diesel",
    transmission: "Automatic",
    condition: "Used",
    colour: "Solid White",
    bodyType: "Bakkie",
    city: "Polokwane",
    province: "Limpopo",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/2021_Nissan_Navara_facelift.jpg/1920px-2021_Nissan_Navara_facelift.jpg",
    ],
    dealer: { name: "Limpopo Auto Hub", slug: "limpopo-auto-hub", verified: false },
    createdAt: "2026-10-16",
  },
  {
    id: "13",
    title: "2020 Suzuki Swift 1.2 GL",
    description:
      "2020 Suzuki Swift 1.2 GL with low running costs and a full service history. An ideal first car or city commuter.",
    make: "Suzuki",
    model: "Swift",
    variant: "1.2 GL",
    year: 2020,
    price: 229900,
    mileage: 48000,
    fuelType: "Petrol",
    transmission: "Manual",
    condition: "Used",
    colour: "Fire Red",
    bodyType: "Hatchback",
    city: "Nelspruit",
    province: "Mpumalanga",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/2020_Suzuki_Swift_Facelift_IMG_1880.jpg/1920px-2020_Suzuki_Swift_Facelift_IMG_1880.jpg",
    ],
    dealer: { name: "Lowveld Motors", slug: "lowveld-motors", verified: true },
    createdAt: "2026-10-13",
  },
  {
    id: "14",
    title: "2021 Isuzu D-Max 1.9 DDi LS",
    description:
      "2021 Isuzu D-Max 1.9 DDi LS double cab with a fitted canopy. Serviced at an authorised Isuzu dealer with a complete history.",
    make: "Isuzu",
    model: "D-Max",
    variant: "1.9 DDi LS",
    year: 2021,
    price: 589900,
    mileage: 61000,
    fuelType: "Diesel",
    transmission: "Manual",
    condition: "Used",
    colour: "Mercury Silver",
    bodyType: "Bakkie",
    city: "Pietermaritzburg",
    province: "KwaZulu-Natal",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e4/2021_Isuzu_D-Max_1.jpg",
    ],
    dealer: { name: "Midlands Car Sales", slug: "midlands-car-sales", verified: false },
    createdAt: "2026-10-30",
  },
  {
    id: "15",
    title: "2022 Haval Jolion 1.5T Super Luxury",
    description:
      "2022 Haval Jolion 1.5T Super Luxury with a panoramic sunroof and heated seats. Balance of the 7-year/200,000km warranty applies.",
    make: "Haval",
    model: "Jolion",
    variant: "1.5T Super Luxury",
    year: 2022,
    price: 399900,
    mileage: 33000,
    fuelType: "Petrol",
    transmission: "Automatic",
    condition: "Used",
    colour: "Hamilton White",
    bodyType: "SUV",
    city: "Johannesburg",
    province: "Gauteng",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Haval_Jolion_001.jpg/1920px-Haval_Jolion_001.jpg",
    ],
    dealer: { name: "Joburg Auto Mart", slug: "joburg-auto-mart", verified: true },
    createdAt: "2026-11-09",
  },
  {
    id: "16",
    title: "2020 Land Rover Defender 110 SE",
    description:
      "2020 Defender 110 SE with the off-road pack, air suspension and a factory tow bar. Full Land Rover service history and a clean accident record.",
    make: "Land Rover",
    model: "Defender",
    variant: "110 SE",
    year: 2020,
    price: 1299000,
    mileage: 44000,
    fuelType: "Diesel",
    transmission: "Automatic",
    condition: "Used",
    colour: "Pangea Green",
    bodyType: "SUV",
    city: "Sandton",
    province: "Gauteng",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/2020_Land_Rover_Defender.jpg/1920px-2020_Land_Rover_Defender.jpg",
    ],
    dealer: { name: "Prestige Motors SA", slug: "prestige-motors-sa", verified: true },
    featured: true,
    createdAt: "2026-11-15",
  },
  {
    id: "17",
    title: "2021 Volkswagen Tiguan 1.4 TSI Trendline",
    description:
      "2021 Tiguan 1.4 TSI Trendline with a full service history and rear parking sensors. A comfortable family SUV with low fuel consumption.",
    make: "Volkswagen",
    model: "Tiguan",
    variant: "1.4 TSI Trendline",
    year: 2021,
    price: 549900,
    mileage: 39000,
    fuelType: "Petrol",
    transmission: "Automatic",
    condition: "Used",
    colour: "Pure White",
    bodyType: "SUV",
    city: "George",
    province: "Western Cape",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/16_Volkswagen_Tiguan_%282016-2021%29_1.jpg/1920px-16_Volkswagen_Tiguan_%282016-2021%29_1.jpg",
    ],
    dealer: { name: "Garden Route Motors", slug: "garden-route-motors", verified: true },
    createdAt: "2026-10-27",
  },
  {
    id: "18",
    title: "2020 Renault Kwid 1.0 Climber",
    description:
      "2020 Renault Kwid 1.0 Climber with raised suspension and a touchscreen infotainment system. Economical and cheap to maintain.",
    make: "Renault",
    model: "Kwid",
    variant: "1.0 Climber",
    year: 2020,
    price: 149900,
    mileage: 55000,
    fuelType: "Petrol",
    transmission: "Manual",
    condition: "Used",
    colour: "Ice Cool White",
    bodyType: "Hatchback",
    city: "Soweto",
    province: "Gauteng",
    images: [
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/2021_Renault_Kwid_1.0_Life.jpg/1920px-2021_Renault_Kwid_1.0_Life.jpg",
    ],
    dealer: { name: "Soweto Wheels", slug: "soweto-wheels", verified: false },
    createdAt: "2026-10-10",
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

/** "32 000 km" — thin-space grouping reads better than a comma in ZA. */
export function formatMileage(mileage: number): string {
  return `${mileage.toLocaleString("en-ZA")} km`;
}

/** Distinct makes present in the demo set, alphabetically. */
export const VEHICLE_MAKES: string[] = Array.from(
  new Set(DEMO_VEHICLES.map((v) => v.make)),
).sort();

/** Distinct provinces present in the demo set, alphabetically. */
export const VEHICLE_PROVINCES: string[] = Array.from(
  new Set(DEMO_VEHICLES.map((v) => v.province)),
).sort();

