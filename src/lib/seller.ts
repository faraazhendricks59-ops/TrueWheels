import type { DemoVehicle } from "@/lib/demo/vehicles";

/**
 * Who is selling the vehicle, and what can actually be verified about them.
 *
 * There are no dealers, no sellers and no user accounts behind these listings:
 * they are generated demo rows. This module therefore models the seller as
 * clearly unverified rather than inventing a showroom, a trading history or a
 * response time.
 *
 * The distinction that matters legally is between a private seller and a
 * dealer, because a dealer must be a registered motor vehicle trader under the
 * National Road Traffic Act and is bound by the Consumer Protection Act, while
 * a private sale is not. That is a real, useful thing to tell a buyer, and it
 * is the reason the two states look different.
 */

export type SellerType = "dealer" | "private";

/**
 * The outcome of an identity check. Only "unverified" is reachable here,
 * because nothing in this project can perform a CIPC, FICA or OTP check. The
 * type keeps the other states so a real verification source can be added
 * without redesigning the card, and so that rendering code has to handle the
 * unverified case explicitly.
 */
export type VerificationState = "verified" | "pending" | "unverified";

export interface SellerIdentity {
  type: SellerType;
  /** The name shown to a buyer. */
  displayName: string;
  location: string;
  verification: VerificationState;
  /** What was checked, and by whom. Never asserted unless it really happened. */
  verificationSource: string;
  /** Trading name of the dealership, when the seller is a dealer. */
  tradingAs?: string;
  /** What the buyer should know about buying from this kind of seller. */
  buyerNote: string;
}

/**
 * A seller for a listing.
 *
 * The name is derived from the listing reference rather than invented, so it is
 * consistent across renders and obviously a placeholder rather than a claim to
 * be a real business. Nothing here asserts that any check has taken place.
 */
export function sellerFor(vehicle: DemoVehicle): SellerIdentity {
  const isDealer = dealerForVehicle(vehicle);

  if (isDealer) {
    return {
      type: "dealer",
      displayName: "Trade seller",
      tradingAs: `Dealer on listing ${listingRef(vehicle)}`,
      location: vehicle.location,
      verification: "unverified",
      verificationSource:
        "No dealership records have been checked. TrueWheels has not confirmed a company registration, a motor vehicle trader licence or any director.",
      buyerNote:
        "A dealer must be registered as a motor vehicle trader and is bound by the Consumer Protection Act, which gives you a right to safe goods and to a remedy if the car is not as described. Ask to see the registration before you buy.",
    };
  }

  return {
    type: "private",
    displayName: "Private seller",
    location: vehicle.location,
    verification: "unverified",
    verificationSource:
      "No identity check has been performed. TrueWheels has not verified a name, an identity number or a phone number for this seller.",
    buyerNote:
      "A private sale is not covered by the Consumer Protection Act, so you have far less protection than with a dealer. Meet in person, check the registration papers and the seller's identity against them, and never pay a deposit before seeing the vehicle.",
  };
}

/**
 * Which listings are shown as trade sellers. Derived from the listing id so it
 * is stable between server and client rather than random.
 */
function dealerForVehicle(vehicle: DemoVehicle): boolean {
  const index = Number(vehicle.id.replace(/\D/g, "")) || 0;
  return index % 3 === 0;
}

/** The same internal reference used elsewhere, so the two agree. */
export function listingRef(vehicle: DemoVehicle): string {
  const digits = vehicle.id.replace(/\D/g, "").padStart(4, "0");
  return `TW-${vehicle.year}-${digits}`;
}

export interface ReviewFact {
  id: string;
  label: string;
  value: string;
  /** Whether this is a real measurement or an absence of one. */
  state: "measured" | "none";
}

/**
 * The review facts for a listing.
 *
 * There are no reviews, because no purchase has ever taken place through this
 * platform. The brief supplied a 4.8 average over 142 reviews with named
 * authors and dated comments, and a "Verified Buyer" badge citing payment
 * through "TrueWheels Secure Pay". None of that is real, and inventing
 * testimonials for a car someone may actually buy is not a cosmetic problem:
 * it is fabricated social proof, and published ratings can be picked up by
 * search engines as structured data.
 *
 * So the honest position is an empty state that says why it is empty.
 */
export function reviewFacts(vehicle: DemoVehicle): ReviewFact[] {
  return [
    {
      id: "reviews",
      label: "Reviews",
      value: "None",
      state: "none",
    },
    {
      id: "purchases",
      label: "Purchases through TrueWheels",
      value: "None recorded",
      state: "none",
    },
    {
      id: "reference",
      label: "Listing reference",
      value: listingRef(vehicle),
      state: "measured",
    },
  ];
}

/**
 * Why reviews cannot be left yet, and what would make them trustworthy.
 *
 * The brief proposed gating reviews behind a verified transaction, which is the
 * right instinct, and then fabricated the transactions. The gate is described
 * here as a requirement rather than claimed to be satisfied.
 */
export const REVIEW_REQUIREMENTS: readonly string[] = [
  "A completed sale recorded against this listing on TrueWheels, with the buyer's account linked to it.",
  "That the reviewer is the account that bought the vehicle, so one person cannot post several reviews.",
  "A review window, so a rating cannot be left long after the sale or before it is completed.",
  "That the seller may reply once, and that a reply is never edited by us.",
  "That a review is only removed for breaking published rules, and that removals are logged.",
] as const;

/**
 * What TrueWheels cannot verify about a seller today. Listed so the limitation
 * is visible rather than hidden behind a badge.
 */
export const UNVERIFIED_CLAIMS: readonly string[] = [
  "Company registration, trading name or directors",
  "Motor vehicle trader registration",
  "Identity number or phone number",
  "Physical showroom or trading address",
  "Bank account ownership",
  "Response times or reply rates",
] as const;
