import type { DemoVehicle } from "./demo/vehicles";

/**
 * Auctions, and what this project actually has of them.
 *
 * The phase brief asked for "a realtime, WebSocket-ready auction interface" with a
 * live scrolling bid feed, a proxy-bidding engine, "deep-decoded bid verification
 * badges" and, in its own sample code, a `setInterval` that fabricates a new bid
 * from "Anonymous Buyer" every few seconds and a toast reading "Bid verified by
 * TrueWheels Auction Engine. Funds pre-authorized."
 *
 * None of that machinery exists, and the repo already recorded why for each part:
 *
 *  - There is no auction engine, no bidding service and no server. A bid that
 *    nobody placed is not a bid. The brief's own "Live Bid Activity" panel is the
 *    exact surface Phase 45 deleted from the home page ("M3 bid R1 450 000") and
 *    from the dashboard ("Bid verified by the TrueWheels Auction Engine"), because
 *    an invented bid at an invented price is the strongest evidence a marketplace
 *    can show and the easiest to fake. `src/lib/listing-activity.ts` states plainly
 *    that there is no auction or deadline feature.
 *  - There is no payment rail and no authorisation hold. "Funds pre-authorized" is
 *    a claim about a buyer's bank that this project cannot make and must never
 *    imply: a person who believes their money is committed will act as if it is.
 *  - There are no bidder accounts (src/lib/profile.ts, NO_FOLLOW_GRAPH), so a
 *    bidder name, an "outbid" alert and a "verified bidder" badge would all
 *    describe people who do not exist. A verification badge is a claim that
 *    something was checked; nothing was.
 *
 * Scarcity and urgency that are invented are not a harmless flourish. They push a
 * buyer past the point of comparing, and section 5(2)(b) of the Consumer
 * Protection Act prohibits marketing that is misleading in any way, including by
 * the manner in which it is conveyed. A countdown to a deadline that no seller set
 * is precisely that.
 *
 * What is real is arithmetic on the asking price: a buyer can work out what a bid
 * would cost them, and can set their own ceiling and their own reminder to come
 * back. That is what this module models — a calculator and a reminder the reader
 * owns, on their own device — and the UI says plainly that no auction is running
 * and no bid can be placed here.
 */

/** False while no auction, bidding or payment machinery exists in the project. */
export const AUCTIONS_UNAVAILABLE = true;

export const AUCTION_DISCLOSURE =
  "TrueWheels does not run auctions. There is no bidding service, no auction clock and no payment system, so nothing on this page can be bid on, no bid can be placed, and no money can be held. Every vehicle here is an ordinary listing at the asking price shown on its own page.";

export const BIDDING_DISCLOSURE =
  "No bids have been placed and none can be placed here. TrueWheels has no bidder accounts and no bidding service, so any bid amount, bidder name or bid count would be invented.";

export const PAYMENT_DISCLOSURE =
  "TrueWheels cannot take a payment, hold a deposit or pre-authorise funds. Nothing on this page touches your bank. Any deposit is a matter between you and the seller, and you should agree in writing what it is for and when it is returned.";

/** What a buyer can establish for themselves instead of trusting a countdown. */
export const BIDDING_CHECKS: readonly string[] = [
  "Decide the most you are willing to pay before you contact the seller, and write it down. A deadline you set yourself is the only one that is real.",
  "Ask the seller directly whether anyone else has offered, and what the highest offer is. A seller who will not say is telling you something.",
  "Ask whether the seller will hold the vehicle, for how long, and on what terms. Get any deposit agreement in writing, with the amount and the refund conditions.",
  "Have the vehicle inspected before you commit. An inspection is worth more than any sense of urgency.",
] as const;

/** The step between sensible offers on a listing, for the calculator only. */
export const OFFER_STEPS: readonly number[] = [5000, 10000, 25000] as const;

/**
 * Illustrative finance figures, for a calculator the reader drives.
 *
 * These are labelled as illustrative everywhere they appear and are not an offer
 * of finance: TrueWheels does not lend and is not a credit provider. The point is
 * only to let a buyer see what a monthly figure looks like at a stated rate, so
 * they can judge affordability before they talk to a seller. The rate is a round
 * number chosen to be recognisable, not a rate anyone has been quoted.
 */
export const ILLUSTRATIVE_RATE = 0.125;
export const ILLUSTRATIVE_MONTHS = 60;

export function monthlyRepayment(
  principal: number,
  annualRate: number = ILLUSTRATIVE_RATE,
  months: number = ILLUSTRATIVE_MONTHS
): number {
  if (principal <= 0 || months <= 0) return 0;
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

/**
 * A reference for a listing, in the same form the rest of the app uses, so a
 * reader can quote it to the seller. This is derived from the listing, not issued
 * by any registry.
 */
export function auctionRef(vehicle: DemoVehicle): string {
  const digits = vehicle.id.replace(/\D/g, "").padStart(4, "0");
  return `TW-${vehicle.year}-${digits}`;
}

export function formatRand(value: number): string {
  return `R ${Math.round(value).toLocaleString("en-ZA")}`;
}

/**
 * Follow-up reminders, kept on the reader's own device.
 *
 * This is the only honest form of a countdown here. The brief wanted a clock to a
 * deadline the seller never set, which manufactures urgency out of nothing. A
 * reminder the reader sets counts down to a moment they chose, for a reason they
 * chose, and the page says so. It is not an auction clock and it makes no claim
 * about anyone else.
 */
export const FOLLOWUP_KEY = "truewheels_followup_v1";

/** Milliseconds from now for each preset, and how the button reads. */
export const FOLLOWUP_PRESETS: readonly { label: string; minutes: number }[] = [
  { label: "In 30 minutes", minutes: 30 },
  { label: "In 2 hours", minutes: 120 },
  { label: "Tomorrow", minutes: 60 * 24 },
] as const;

export type FollowUpMap = Record<string, number>;

export function readFollowUps(): FollowUpMap {
  try {
    const raw = window.localStorage.getItem(FOLLOWUP_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    // Keep only entries that are a real future-or-past timestamp.
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(
        ([, value]) => typeof value === "number" && Number.isFinite(value)
      )
    ) as FollowUpMap;
  } catch {
    // Corrupt or unavailable storage must not break the page.
    return {};
  }
}

export function writeFollowUp(vehicleId: string, at: number | null): void {
  try {
    const map = readFollowUps();
    if (at === null) delete map[vehicleId];
    else map[vehicleId] = at;
    window.localStorage.setItem(FOLLOWUP_KEY, JSON.stringify(map));
  } catch {
    // A failed write only loses the reminder; it must not throw into the render.
  }
}

