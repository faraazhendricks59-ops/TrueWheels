/**
 * How a buyer can actually reach a seller, given that this app holds no seller
 * contact details.
 *
 * There is no seller phone number, no messaging service and no CRM. The brief
 * for this phase supplied a hardcoded number ("27821234567") and would have
 * opened a WhatsApp chat with it, which means a real person would have received
 * a stranger's message about a car they have never heard of. It also invented
 * offer references ("#OFF-88291") and test-drive bookings ("#TD-11920") and
 * asserted a signed liability waiver with a logged IP address.
 *
 * What this module does instead is help the buyer compose a clear enquiry and
 * send it through a channel of their own choosing. Nothing is sent by the app.
 */

import type { DemoVehicle } from "@/lib/demo/vehicles";
import { listingRef } from "@/lib/seller";

/**
 * A share link that opens WhatsApp with the message pre-filled and no recipient
 * set, so the person using it chooses who receives it. This is the only honest
 * form of the link while no seller number is known: putting a number in the path
 * would message whoever owns that number.
 */
export function whatsAppShareLink(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

/** The enquiry text a buyer would send. Plain, specific, and quotes the listing. */
export function enquiryMessage(vehicle: DemoVehicle): string {
  const price = `R ${vehicle.price.toLocaleString("en-ZA")}`;
  return [
    `Hi, I saw your ${vehicle.title} on TrueWheels.`,
    ``,
    `Listing reference: ${listingRef(vehicle)}`,
    `Asking price: ${price}`,
    `Location: ${vehicle.location}`,
    ``,
    `Is it still available, and may I arrange a viewing?`,
  ].join("\n");
}

export interface OfferDraft {
  amount: number;
  position: "cash" | "finance" | "unsure";
  note: string;
}

/** The offer text a buyer would send, so they can put it in writing themselves. */
export function offerMessage(vehicle: DemoVehicle, draft: OfferDraft): string {
  const zar = (value: number) => `R ${value.toLocaleString("en-ZA")}`;
  const position =
    draft.position === "cash"
      ? "I can pay cash, with no finance required."
      : draft.position === "finance"
        ? "I have pre-approved vehicle finance in place."
        : "I am still arranging how I would pay.";

  return [
    `Hi, I would like to make an offer on your ${vehicle.title}.`,
    ``,
    `Listing reference: ${listingRef(vehicle)}`,
    `Asking price: ${zar(vehicle.price)}`,
    `My offer: ${zar(draft.amount)}`,
    `Payment: ${position}`,
    draft.note.trim() ? `Note: ${draft.note.trim()}` : null,
    ``,
    `This is subject to viewing the vehicle and confirming its condition.`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

/** The test-drive request a buyer would send. */
export function testDriveMessage(
  vehicle: DemoVehicle,
  when: { date: string; time: string },
): string {
  return [
    `Hi, I would like to arrange a test drive of your ${vehicle.title}.`,
    ``,
    `Listing reference: ${listingRef(vehicle)}`,
    `Location: ${vehicle.location}`,
    `Preferred date: ${when.date || "to be agreed"}`,
    `Preferred time: ${when.time || "to be agreed"}`,
    ``,
    `Please confirm whether the vehicle is available and insured for a test drive.`,
  ].join("\n");
}

/**
 * What a real offer has to say to be worth sending, and what it must not imply.
 *
 * An offer that is accepted forms a binding contract, so it is not a message to
 * fire off casually. Saying so is more useful to a buyer than a button that
 * pretends to deliver one.
 */
export const OFFER_GUIDANCE: readonly string[] = [
  "Put the amount and any conditions in writing, and keep a copy. An offer that is accepted becomes a binding agreement.",
  "Say how you would pay and whether it depends on finance approval, because a sale subject to finance is not the same as a cash offer.",
  "State that the offer is subject to viewing the vehicle and being satisfied with its condition.",
  "Ask what is included in the price, such as licensing, a roadworthy certificate or a warranty.",
  "An offer far below the asking price is usually declined without a reply, so it helps to explain the basis for your figure.",
] as const;

/**
 * The law on liability waivers for a test drive, stated accurately.
 *
 * The brief described a waiver that made the buyer drive "at your own risk" and
 * indemnified the dealer against "any traffic fines or damages". A term like that
 * is not the blanket protection it appears to be, and telling a buyer they have
 * signed one when they have not would be worse than saying nothing.
 */
export const WAIVER_FACTS: readonly string[] = [
  "A supplier cannot make you accept the risk of its own gross negligence. Section 51(1)(c)(ii) of the Consumer Protection Act voids a consumer's assumption of risk for loss caused by gross negligence, and section 51(1)(c)(i) voids a term exempting the supplier from it.",
  "A term that limits risk must be drawn to your attention in plain language, in a conspicuous way, before you agree, under section 49 of the Consumer Protection Act. A clause buried in a form does not achieve that.",
  "A court may set aside a term it finds unfair, unreasonable or unjust under sections 48 and 52, and the regulations list terms presumed to be unfair.",
  "You remain responsible for your own driving. Traffic fines incurred while you are driving are ordinarily yours, and the vehicle must be licensed and insured for the drive.",
] as const;

/** What to settle before driving someone else's car. */
export const TEST_DRIVE_CHECKS: readonly string[] = [
  "Is the vehicle covered by insurance for a test drive, and by whose policy?",
  "Who pays for any damage during the drive, and what excess applies?",
  "Is the vehicle licensed and does it have a valid roadworthy certificate?",
  "Will the seller or a representative be in the car, and for how long may you drive it?",
  "May you take the car to an independent mechanic for an inspection before deciding?",
] as const;
