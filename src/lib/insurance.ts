/**
 * Vehicle insurance arithmetic and vocabulary.
 *
 * There is no insurer integration and no underwriting engine here. What this
 * module does is explain what moves a premium and give a range that is honest
 * about its own uncertainty, using rates that sit inside the published South
 * African market rather than a single confident number.
 *
 * Why a range and not a figure. A real premium depends on facts this app does
 * not hold: the driver's age and licence history, claims record, where the car
 * is parked overnight, its security devices, the annual mileage, who else
 * drives it, and the insurer's own underwriting. Presenting one number to the
 * rand would imply those were known. A range plus the reasons it varies is the
 * truthful version, and it still tells a buyer whether they are looking at
 * R400 or R4 000 a month.
 *
 * The published market for comprehensive cover in South Africa is roughly
 * R350 to R1 500 a month, with luxury and performance cars from about R1 000
 * to R2 500. The rates below are derived from that spread and are labelled as
 * illustrative everywhere they surface.
 */

export type CoverType = "comprehensive" | "third_party_fire_theft" | "third_party";

export interface CoverOption {
  id: CoverType;
  label: string;
  shortLabel: string;
  /** What the policy actually pays for, stated plainly. */
  covers: string;
  /** Premium as a multiple of comprehensive cover. */
  factor: number;
}

/**
 * The three cover levels. The factors are the ratio of each level's premium to
 * comprehensive; third-party-only sits far below because it does not insure the
 * buyer's own car at all.
 */
export const COVER_OPTIONS: readonly CoverOption[] = [
  {
    id: "comprehensive",
    label: "Comprehensive",
    shortLabel: "Comprehensive",
    covers: "Damage to your car, theft, hijacking, fire, and damage you cause to others.",
    factor: 1,
  },
  {
    id: "third_party_fire_theft",
    label: "Third party, fire and theft",
    shortLabel: "3rd party F&T",
    covers:
      "Theft, hijacking and fire damage to your car, and damage you cause to others. Not damage to your own car in a collision.",
    factor: 0.55,
  },
  {
    id: "third_party",
    label: "Third party only",
    shortLabel: "3rd party",
    covers:
      "Damage you cause to other people's property only. Your own car is not insured.",
    factor: 0.2,
  },
] as const;

export function coverOption(id: CoverType): CoverOption {
  return COVER_OPTIONS.find((option) => option.id === id) ?? COVER_OPTIONS[0];
}

/**
 * Comprehensive cover as a fraction of vehicle value per year, by value band.
 *
 * The published market brackets — entry level, mid range, luxury — imply a rate
 * that falls as the car gets dearer, because a large part of any premium is the
 * liability to other people and the cost of a claim, neither of which scales
 * with the price of the car. One flat rate would overstate cheap cars and
 * understate expensive ones.
 */
const VALUE_BANDS: readonly { upTo: number; rate: number }[] = [
  { upTo: 150_000, rate: 0.042 },
  { upTo: 300_000, rate: 0.034 },
  { upTo: 600_000, rate: 0.027 },
  { upTo: 1_000_000, rate: 0.023 },
  { upTo: Infinity, rate: 0.02 },
];

export function annualRateForValue(vehicleValue: number): number {
  const band = VALUE_BANDS.find((entry) => vehicleValue <= entry.upTo);
  return band ? band.rate : VALUE_BANDS[VALUE_BANDS.length - 1].rate;
}

export interface ExcessOption {
  amount: number;
  /** Premium as a multiple of the R2 500 baseline. */
  factor: number;
  label: string;
}

/**
 * Excess steps. A higher excess lowers the premium because the driver carries
 * more of each claim, but the effect is modest and flattens out; the factors
 * are deliberately gentle rather than a straight line to zero.
 */
export const EXCESS_OPTIONS: readonly ExcessOption[] = [
  { amount: 0, factor: 1.12, label: "No extra excess" },
  { amount: 2_500, factor: 1, label: "R2 500" },
  { amount: 5_000, factor: 0.9, label: "R5 000" },
  { amount: 10_000, factor: 0.79, label: "R10 000" },
  { amount: 20_000, factor: 0.7, label: "R20 000" },
] as const;

export const DEFAULT_EXCESS = 2_500;

export function excessOption(amount: number): ExcessOption {
  return (
    EXCESS_OPTIONS.find((option) => option.amount === amount) ??
    EXCESS_OPTIONS[1]
  );
}

export type AddonId = "windscreen" | "tireRim" | "keyCover" | "roadside" | "carHire";

export interface AddonOption {
  id: AddonId;
  label: string;
  /** Monthly cost in rand, flat across vehicle values. */
  cost: number;
  covers: string;
  /** Comprehensive cover usually already includes this. */
  includedInComprehensive?: boolean;
}

export const ADDON_OPTIONS: readonly AddonOption[] = [
  {
    id: "windscreen",
    label: "Windscreen cover",
    cost: 145,
    covers: "Chips, cracks and windscreen replacement without affecting your no-claims bonus.",
    includedInComprehensive: true,
  },
  {
    id: "tireRim",
    label: "Tyre and rim cover",
    cost: 235,
    covers: "Replacement of tyres and rims damaged by potholes or road debris.",
  },
  {
    id: "keyCover",
    label: "Key cover",
    cost: 75,
    covers: "Replacement and reprogramming if your keys are lost or stolen.",
  },
  {
    id: "roadside",
    label: "Roadside assistance",
    cost: 110,
    covers: "Towing, jump starts and flat-tyre help when the car will not drive.",
    includedInComprehensive: true,
  },
  {
    id: "carHire",
    label: "Car hire after a claim",
    cost: 130,
    covers: "A replacement car while yours is being repaired after a claim.",
  },
] as const;

export function addonOption(id: AddonId): AddonOption | undefined {
  return ADDON_OPTIONS.find((option) => option.id === id);
}

/** The add-ons a given cover level already includes, so they are not charged twice. */
export function includedAddons(cover: CoverType): AddonId[] {
  if (cover !== "comprehensive") return [];
  return ADDON_OPTIONS.filter((option) => option.includedInComprehensive).map(
    (option) => option.id,
  );
}

export interface InsuranceOptions {
  coverType: CoverType;
  /** Extra excess above the insurer's compulsory excess, in rand. */
  excess: number;
  addons: Record<AddonId, boolean>;
}

export const DEFAULT_INSURANCE: InsuranceOptions = {
  coverType: "comprehensive",
  excess: DEFAULT_EXCESS,
  addons: { windscreen: true, tireRim: false, keyCover: true, roadside: false, carHire: false },
};

export interface PremiumEstimate {
  /** Lower end of the honest range, per month. */
  low: number;
  /** Upper end of the honest range, per month. */
  high: number;
  /** Midpoint, for a single figure where one is needed. */
  monthly: number;
  /** Add-on cost per month, before any cover-level adjustment. */
  addonMonthly: number;
  /** What the range is built from, so the basis can be shown to the buyer. */
  annualRate: number;
  excessFactor: number;
  coverFactor: number;
}

/**
 * The spread between the low and high ends of the range. A premium is not
 * knowable to better than roughly this without the driver's details, so the
 * range is not narrowed artificially.
 */
const RANGE_SPREAD = 0.3;

/**
 * Estimate a monthly premium as a range.
 *
 * Deliberately takes only the vehicle value and the buyer's own choices. It
 * does not ask for age, claims history or address, because asking for personal
 * details in order to show a number that is only an illustration would be
 * collecting data for no purpose.
 */
export function estimatePremium(
  vehicleValue: number,
  options: InsuranceOptions,
): PremiumEstimate {
  const cover = coverOption(options.coverType);
  const excess = excessOption(options.excess);

  // Add-ons already bundled into comprehensive cover are not charged again.
  const included = new Set(includedAddons(options.coverType));
  const addonMonthly = ADDON_OPTIONS.reduce(
    (total, option) =>
      options.addons[option.id] && !included.has(option.id) ? total + option.cost : total,
    0,
  );

  const annualRate = annualRateForValue(vehicleValue);
  const base = (vehicleValue * annualRate) / 12;
  const adjusted = base * cover.factor * excess.factor + addonMonthly;

  // A premium is never zero. Third-party cover on a cheap car still costs money.
  const monthly = Math.max(120, Math.round(adjusted));

  return {
    low: Math.round(monthly * (1 - RANGE_SPREAD)),
    high: Math.round(monthly * (1 + RANGE_SPREAD)),
    monthly,
    addonMonthly,
    annualRate,
    excessFactor: excess.factor,
    coverFactor: cover.factor,
  };
}

export interface RatingFactor {
  id: string;
  label: string;
  detail: string;
  /** How this factor moves a premium, in words rather than a fake number. */
  effect: "lowers" | "raises" | "depends";
}

/**
 * What actually decides a premium. These are the factors South African insurers
 * publish, and they are listed because a buyer cannot change their age but can
 * change where the car sleeps and how much they drive.
 */
export const RATING_FACTORS: readonly RatingFactor[] = [
  {
    id: "profile",
    label: "Driver profile",
    detail:
      "Age, how long you have held a licence, and your claims record over the last few years.",
    effect: "depends",
  },
  {
    id: "history",
    label: "Claims history",
    detail:
      "A no-claims record is the single largest discount most insurers offer; one at-fault claim can raise a premium sharply for several years.",
    effect: "lowers",
  },
  {
    id: "parking",
    label: "Where it is parked overnight",
    detail:
      "A locked garage is cheaper than a street in a high-theft suburb. This is one of the few factors you can change.",
    effect: "lowers",
  },
  {
    id: "security",
    label: "Security and tracking",
    detail:
      "An approved tracking device and immobiliser typically reduce a premium by around 10% to 15%.",
    effect: "lowers",
  },
  {
    id: "mileage",
    label: "Annual mileage",
    detail:
      "Low mileage can qualify for a discount, and some insurers price per kilometre instead.",
    effect: "lowers",
  },
  {
    id: "vehicle",
    label: "The car itself",
    detail:
      "Repair cost, parts availability and theft risk. A performance car costs more to insure than a family hatchback of the same price.",
    effect: "raises",
  },
  {
    id: "excess",
    label: "Excess you accept",
    detail:
      "Taking a larger excess lowers the monthly premium, but you pay that amount yourself on every claim.",
    effect: "lowers",
  },
  {
    id: "use",
    label: "How the car is used",
    detail:
      "Private use is cheaper than business use, and naming additional regular drivers usually lowers risk.",
    effect: "depends",
  },
] as const;

/**
 * What the law requires, stated as obligations rather than reassurance.
 *
 * The National Credit Act obliges a credit provider to ensure a financed asset
 * is insured, and the buyer pays for that cover. This is why a financed car
 * cannot be left uninsured, and it is a fact worth stating before a buyer
 * discovers it at the dealership.
 */
export const INSURANCE_OBLIGATIONS: readonly string[] = [
  "Under the National Credit Act a credit provider may require the financed vehicle to be insured, and you pay for that cover.",
  "Comprehensive cover is what lenders normally require, because the car is their security until it is paid off.",
  "You may choose your own insurer, but the lender must be named as an interested party on the policy.",
  "Insurers must be licensed financial services providers, and an intermediary must be registered with the FSCA.",
] as const;
