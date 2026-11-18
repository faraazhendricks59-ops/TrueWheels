/**
 * Listing imagery for the demo vehicles.
 *
 * There are no photographs of these specific cars; they are generated demo
 * listings. Rather than leave the cards blank or draw a shape, each make uses a
 * real photograph of that model from Wikimedia Commons, so the card shows the
 * right kind of vehicle.
 *
 * Every image here is CC BY-SA 4.0, which requires attribution and share-alike.
 * The attribution is stored with the image and rendered wherever the photograph
 * appears (see PhotoCredit). Do not remove the credit while the image is in use.
 * The subject field records what the file actually depicts, so the picture can
 * be checked against the make it is used for.
 */

export interface VehiclePhoto {
  url: string;
  width: number;
  height: number;
  attribution: string;
  licence: string;
  source: string;
  /** What the file actually depicts, taken from its filename on Commons. */
  subject: string;
}

export const VEHICLE_PHOTOS: Record<string, VehiclePhoto> = {
  "BMW": {
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/BMW_M3_Competition_%28G80%29_1X7A1573.jpg/1280px-BMW_M3_Competition_%28G80%29_1X7A1573.jpg",
    width: 1280,
    height: 611,
    attribution: "Alexander-93",
    licence: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:BMW_M3_Competition_(G80)_1X7A1573.jpg",
    subject: "BMW M3 Competition (G80) 1X7A1573",
  },
  "Volkswagen": {
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Volkswagen_Golf_VIII_GTI_Clubsport_45_IMG_4884.jpg/1280px-Volkswagen_Golf_VIII_GTI_Clubsport_45_IMG_4884.jpg",
    width: 1280,
    height: 665,
    attribution: "Alexander Migl",
    licence: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Volkswagen_Golf_VIII_GTI_Clubsport_45_IMG_4884.jpg",
    subject: "Volkswagen Golf VIII GTI Clubsport 45 IMG 4884",
  },
  "Toyota": {
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Toyota_HiLux_GR_Sport_1X7A7281.jpg/1280px-Toyota_HiLux_GR_Sport_1X7A7281.jpg",
    width: 1280,
    height: 774,
    attribution: "Alexander-93",
    licence: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Toyota_HiLux_GR_Sport_1X7A7281.jpg",
    subject: "Toyota HiLux GR Sport 1X7A7281",
  },
  "Mercedes-Benz": {
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/Mercedes-AMG_C_63_%28W206%29_IMG_0310.jpg/1280px-Mercedes-AMG_C_63_%28W206%29_IMG_0310.jpg",
    width: 1280,
    height: 592,
    attribution: "Alexander-93",
    licence: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Mercedes-AMG_C_63_(W206)_IMG_0310.jpg",
    subject: "Mercedes-AMG C 63 (W206) IMG 0310",
  },
  "Ford": {
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Ford_Ranger_Raptor_%28P703%29_1X7A6774.jpg/1280px-Ford_Ranger_Raptor_%28P703%29_1X7A6774.jpg",
    width: 1280,
    height: 658,
    attribution: "Alexander-93",
    licence: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Ford_Ranger_Raptor_(P703)_1X7A6774.jpg",
    subject: "Ford Ranger Raptor (P703) 1X7A6774",
  },
  "Hyundai": {
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Hyundai_Tucson_%28NX4%29_1X7A0424.jpg/1280px-Hyundai_Tucson_%28NX4%29_1X7A0424.jpg",
    width: 1280,
    height: 698,
    attribution: "Alexander Migl",
    licence: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Hyundai_Tucson_(NX4)_1X7A0424.jpg",
    subject: "Hyundai Tucson (NX4) 1X7A0424",
  },
  "Audi": {
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Audi_RS6_Avant_C8_1X7A0305.jpg/1280px-Audi_RS6_Avant_C8_1X7A0305.jpg",
    width: 1280,
    height: 673,
    attribution: "Alexander Migl",
    licence: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Audi_RS6_Avant_C8_1X7A0305.jpg",
    subject: "Audi RS6 Avant C8 1X7A0305",
  },
  "Kia": {
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Kia_Sportage_%28NQ5%29_1X7A0319.jpg/1280px-Kia_Sportage_%28NQ5%29_1X7A0319.jpg",
    width: 1280,
    height: 668,
    attribution: "Alexander Migl",
    licence: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Kia_Sportage_(NQ5)_1X7A0319.jpg",
    subject: "Kia Sportage (NQ5) 1X7A0319",
  },
};

/** The photograph for a make, or undefined if none is registered. */
export function photoForMake(make: string): VehiclePhoto | undefined {
  return VEHICLE_PHOTOS[make];
}

/**
 * The make in a listing title, or an empty string.
 *
 * Titles read "2016 Volkswagen Golf GTI", so the first word is the year and the
 * make is the second. Looking up the first word that matches a registered make
 * handles that and any other title shape.
 */
export function makeOf(title: string): string {
  return title
    .trim()
    .split(/\s+/)
    .find((word) => VEHICLE_PHOTOS[word]) ?? "";
}

/**
 * The photograph for a listing. Listings are keyed by make, so every Golf shows
 * the same Golf photograph; the picture says what kind of car it is, not that
 * this particular car was photographed.
 */
export function photoForVehicle(vehicle: { id: string; title: string }): VehiclePhoto | undefined {
  const make = makeOf(vehicle.title);
  return make ? VEHICLE_PHOTOS[make] : undefined;
}
