import type { DemoVehicle } from "./demo/vehicles";

/**
 * Disputes, and what this project actually has of them.
 *
 * The phase brief asked for a "Dispute Resolution Center" with an evidence vault, a
 * three-party mediation thread, an SLA-driven case timeline and an admin
 * adjudication panel whose own copy read "This action moves real funds and cannot be
 * reversed", under a badge reading "R649 000 secured in TrueWheels Escrow (Pty) Ltd."
 * Its sample data named a buyer, a seller and a mediator, and its footer claimed the
 * SHA-256 chain of custody "holds up in a real legal process".
 *
 * None of that is real, and this is the most consequential fabrication the briefs
 * have supplied, because it invents a court:
 *
 *  - There is no escrow, so there are no funds to move. Phase 53 established this
 *    (see `src/lib/secure-pay.ts`): TrueWheels holds no money. An adjudication panel
 *    that disburses "escrow" would move nothing while telling both parties their
 *    money had been dealt with.
 *  - There is no case, no mediator and no admin who reviews disputes. A "binding
 *    ruling" is a ruling by somebody with authority to bind. TrueWheels has none,
 *    and a page that issues one would tell a buyer their complaint had been decided
 *    when it had not, which is the surest way to make them miss a real deadline.
 *  - The SLA clock was invented. A countdown to a resolution the platform has
 *    promised but cannot deliver is pressure applied to a person who is already
 *    wronged.
 *  - The "AI flags" ("Metadata stripped", "Possible screenshot") were invented
 *    judgements about a reader's own evidence, presented as findings.
 *  - Client-side SHA-256 is real, but on its own it is not a chain of custody. A
 *    hash proves a file is unchanged since it was hashed; it does not prove when,
 *    by whom, or that it came from where it claims. The brief's copy overstated it.
 *
 * A dispute about a vehicle is a consumer matter with a real process and real
 * forums, and the repo already says so: `WriteReviewModal` points a buyer to the
 * National Consumer Commission and the Motor Industry Ombudsman. This module does
 * that properly — it names the forums, explains the steps that actually protect a
 * buyer, and warns about the scam patterns that a "resolution centre" would
 * otherwise be used to dress up. If a real case system is built later,
 * `DISPUTES_UNAVAILABLE` becomes false and the case UI can be shown.
 */

/** False while no case system, mediator, escrow or adjudication exists. */
export const DISPUTES_UNAVAILABLE = true;

export const DISPUTE_DISCLOSURE =
  "TrueWheels does not run a dispute resolution service. There is no case system, no mediator and no adjudicator, so TrueWheels cannot decide a dispute, cannot order a refund, and cannot hold or release any money. A dispute about a vehicle you have bought is a matter between you and the seller, and the forums below are where it can actually be decided.";

/**
 * The forums that can decide a vehicle dispute in South Africa. Each is real, and
 * each is free or low-cost to approach.
 */
export const DISPUTE_FORUMS: readonly {
  label: string;
  body: string;
  url: string;
}[] = [
  {
    label: "National Consumer Commission",
    body: "Handles complaints against suppliers, including motor dealers, under the Consumer Protection Act. You must first complain to the supplier in writing and give them a chance to put it right.",
    url: "https://www.thencc.gov.za/",
  },
  {
    label: "Motor Industry Ombudsman of South Africa",
    body: "Handles disputes with motor traders, including dealers and workshops. Free to a consumer, and a dealer who belongs to the scheme is bound by its findings.",
    url: "https://www.miosa.co.za/",
  },
  {
    label: "National Credit Regulator",
    body: "Handles complaints about credit providers and credit agreements, including vehicle finance.",
    url: "https://www.ncr.org.za/",
  },
  {
    label: "Small Claims Court",
    body: "For money claims within its limit, without a lawyer. A fast, low-cost route for a private sale where the seller will not put something right.",
    url: "https://www.justice.gov.za/scc/scc.htm",
  },
] as const;

/**
 * The steps that actually protect a buyer, in order. The first three cost nothing
 * and resolve most disputes; the forums are the last resort, not the first.
 */
export const DISPUTE_STEPS: readonly { title: string; body: string }[] = [
  {
    title: "Put the problem in writing, to the seller, first",
    body: "State what was wrong, what the listing or the agreement said, and what you want done about it. Give a date by which you want an answer. Keep a copy. Almost every forum will ask whether you did this before they will take the complaint.",
  },
  {
    title: "Keep everything",
    body: "The listing as it appeared, your messages, the proof of payment, the sale agreement, the registration certificate, any inspection report, and your own photographs. A dispute is won or lost on the record, and the record is easiest to build while the events are fresh.",
  },
  {
    title: "Get the fault assessed by someone independent",
    body: "A mechanic's written report on a hidden fault is worth more than any argument. It names the fault, says whether it could have been hidden, and gives the forum something factual to work from.",
  },
  {
    title: "Ask the seller to put it right before you ask anyone else",
    body: "A dealer must give you a remedy if goods are not as described. Most sellers will repair or take the vehicle back rather than face a complaint, and an agreement reached directly is usually faster than any ruling.",
  },
  {
    title: "Take it to the forum that fits",
    body: "A dealer: the National Consumer Commission or the Motor Industry Ombudsman. A credit agreement: the National Credit Regulator. A private seller who will not cooperate: the Small Claims Court, if the amount is within its limit.",
  },
] as const;

/**
 * The patterns a buyer should recognise, because a "resolution centre" that
 * promises to hold money is exactly what a scam uses to look official.
 */
export const SCAM_RED_FLAGS: readonly string[] = [
  "Anyone asking you to pay a deposit, a fee or a 'release fee' into an account that is not in the seller's own name.",
  "Anyone asking for your one-time code (OTP), your PIN, or your bank password. A genuine platform, bank or courier never asks for these.",
  "A seller who will not let you see the vehicle in person, or who is 'out of the country' and will 'ship it after payment'.",
  "A price well below what the same vehicle is going for elsewhere, explained as urgency or a quick sale.",
  "Pressure to pay today, or a claim that other buyers are waiting, especially where you cannot verify it.",
  "A request to move the conversation to a channel where there is no record, and then to pay outside it.",
] as const;

/**
 * The reader's own case file, kept on their device.
 *
 * This is the honest part of the brief's evidence vault. The reader can gather and
 * fingerprint their own documents so they have a record, and it stays on their
 * machine. It is not submitted to anyone, and it is not a chain of custody.
 */
export const CASE_EVIDENCE_KEY = "truewheels_case_evidence_v1";

export interface SealedFile {
  id: string;
  name: string;
  sizeBytes: number;
  type: string;
  sha256: string;
  sealedAt: number;
}

export type SealedFileMap = Record<string, SealedFile[]>;

export function readSealedFiles(): SealedFileMap {
  try {
    const raw = window.localStorage.getItem(CASE_EVIDENCE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const out: SealedFileMap = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (Array.isArray(value)) {
        out[key] = value.filter(
          (v): v is SealedFile =>
            !!v && typeof v === "object" && typeof (v as SealedFile).sha256 === "string"
        );
      }
    }
    return out;
  } catch {
    // Corrupt or unavailable storage must not break the page.
    return {};
  }
}

export function writeSealedFiles(state: SealedFileMap): void {
  try {
    window.localStorage.setItem(CASE_EVIDENCE_KEY, JSON.stringify(state));
  } catch {
    // A failed write only loses the record; it must not throw into the render.
  }
}

/** A reference for a listing, in the form the rest of the app uses. */
export function caseRef(vehicle: DemoVehicle): string {
  const digits = vehicle.id.replace(/\D/g, "").padStart(4, "0");
  return `TW-${vehicle.year}-${digits}`;
}

export function formatRand(value: number): string {
  return `R ${Math.round(value).toLocaleString("en-ZA")}`;
}
