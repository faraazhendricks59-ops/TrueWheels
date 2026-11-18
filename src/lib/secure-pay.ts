import type { DemoVehicle } from "./demo/vehicles";

/**
 * Secure Pay, and what this project actually has of it.
 *
 * The phase brief asked for a "milestone-based escrow system that holds funds",
 * with a milestone tracker, an action dashboard, a handover step requiring photo
 * proof and OTP verification, a fee breakdown, and a transaction route. Its own
 * sample code hard-coded:
 *
 *   Bank: First National Bank
 *   Account: TrueWheels Escrow (Pty) Ltd
 *   Account No: 62847291054
 *   Branch Code: 250655
 *
 * and a badge reading "Funds held in escrow by TrueWheels Secure Pay (Pty) Ltd.
 * FSCA regulated."
 *
 * None of that is real, and this is the most dangerous fabrication the briefs have
 * supplied, because every part of it is designed to make a person send money:
 *
 *  - There is no escrow account. The bank details in the brief are invented. An
 *    account number on a page is an instruction to pay into it; a reader who
 *    follows it sends their money to whoever owns that account, and nothing about
 *    this project would return it. A fabricated escrow account is a phishing page
 *    with a car theme.
 *  - There is no escrow company and no "TrueWheels Secure Pay (Pty) Ltd". A "(Pty)
 *    Ltd" after a name asserts a registered company, and there is none.
 *  - There is no FSCA licence. The Financial Sector Regulation Act requires a
 *    person who renders a financial service to be licensed, and holding money in
 *    escrow is one. Claiming a licence that does not exist is a false statement to
 *    a regulator and to the reader, and it is the specific thing that makes a scam
 *    believable.
 *  - There is no payment rail, no OTP service and no inspection network. "Funds
 *    Secured", "OTP verified" and "Independent Inspector #INSP-442" would all
 *    describe machinery that is not here. An OTP prompt in particular trains a
 *    person to read out a one-time code, which is the exact step a real fraud
 *    depends on.
 *
 * The repo already reached this conclusion once: `src/lib/seller.ts` records that a
 * "Verified Buyer" badge citing payment through "TrueWheels Secure Pay" was
 * fabricated and removed. This module holds that line.
 *
 * So rather than an escrow UI, this is the honest opposite: a plain statement that
 * TrueWheels holds no money and takes none, the safety rules that actually protect
 * a buyer in a private South African vehicle sale, and a checklist the two parties
 * can work through themselves. If a real escrow service is built later,
 * `SECURE_PAY_UNAVAILABLE` becomes false and the milestones can be shown as facts.
 */

/** False while no escrow, payment rail or licence exists in the project. */
export const SECURE_PAY_UNAVAILABLE = true;

export const SECURE_PAY_DISCLOSURE =
  "TrueWheels does not hold money and does not take payment. There is no escrow account, no Secure Pay service and no FSCA licence, so TrueWheels cannot hold a deposit, guarantee a refund, or release funds. Any payment is made directly between you and the seller, at your own risk, and the two of you settle any dispute between you.";

/**
 * The single most important sentence on the page. If a reader remembers one thing,
 * it should be that no legitimate escrow will ask for this.
 */
export const PAYMENT_SAFETY_WARNING =
  "Never pay a deposit into an account whose name does not match the seller's own name. A bank account in the name of a company you have not dealt with, or a name that is not the seller's, is the most common way vehicle buyers in South Africa lose their money. Do not send a deposit before you have seen the vehicle in person and met the seller.";

/** What a buyer can do to protect themselves. Each one is checkable. */
export const SAFE_PAYMENT_RULES: readonly { title: string; body: string }[] = [
  {
    title: "Pay the seller, not a company",
    body: "The account you pay into must be in the seller's own name as it appears on their ID. Ask for their ID, check the name matches the bank account, and keep a copy of both. If the account is in another name, stop.",
  },
  {
    title: "See the vehicle before you pay anything",
    body: "Never pay a holding deposit for a vehicle you have not seen. Photographs and video calls can be taken from another listing. Meet in person, in daylight, at an address you can find again.",
  },
  {
    title: "Confirm the seller owns the vehicle",
    body: "Ask to see the registration certificate (the 'NaTIS' or 'log book') in the seller's name. If the vehicle is financed, the bank holds the certificate and the settlement must be paid before it can be transferred.",
  },
  {
    title: "Check the vehicle's history yourself",
    body: "A vehicle can be written off, stolen or have money owing on it. Pay for a history check, or ask the seller for one, before you pay. Do not rely on a screenshot the seller sends you.",
  },
  {
    title: "Never share a one-time code (OTP)",
    body: "A one-time code proves that you are you. Anyone who asks you to read out an OTP is trying to take money from your account, whether they say they are a bank, a courier, or TrueWheels. TrueWheels will never ask you for one, because TrueWheels has no payment system.",
  },
  {
    title: "Pay in a way you can reverse or prove",
    body: "An EFT can be proven, and a bank can sometimes recall a payment made minutes ago. Cash leaves no record, and a payment to a wallet is difficult to recover. Pay during banking hours so a problem can be reported the same day.",
  },
  {
    title: "Get the sale in writing",
    body: "Record the price, what is included, the odometer reading, and the date and time of handover. Both parties sign it. The Consumer Protection Act gives you rights against a dealer, and a written record is what you rely on if the vehicle is not as described.",
  },
] as const;

/**
 * The stages of a private vehicle sale, as a checklist the parties tick themselves.
 *
 * The brief's five stages were driven by an escrow system that changed their state.
 * With no escrow, the stages are still useful as a shared plan: they are the steps
 * a private sale actually goes through. The difference is that nothing here
 * advances a stage except the two people doing it, and the page says so.
 */
export const SALE_STAGES: readonly { id: string; label: string; detail: string }[] = [
  {
    id: "agree",
    label: "Agree the price",
    detail:
      "Agree the price and what it includes in writing, and write down the date and time you agreed it.",
  },
  {
    id: "see",
    label: "See the vehicle",
    detail:
      "View the vehicle in person, check it against the listing, and confirm the seller's ID matches the registration certificate.",
  },
  {
    id: "check",
    label: "Check its history",
    detail:
      "Get a history check for write-offs, theft and outstanding finance, and an independent mechanical inspection if you can.",
  },
  {
    id: "pay",
    label: "Pay the seller",
    detail:
      "Pay into an account in the seller's own name, during banking hours, and keep the proof of payment.",
  },
  {
    id: "transfer",
    label: "Transfer ownership",
    detail:
      "Complete the change of ownership at a registering authority. The vehicle is not yours until this is done.",
  },
] as const;

/** Where the reader can check the things this page cannot verify. */
export const PAYMENT_CHECKS: readonly { label: string; body: string; url: string }[] = [
  {
    label: "FSCA",
    body: "Check whether a person or company claiming to offer financial services is licensed.",
    url: "https://www.fsca.co.za/",
  },
  {
    label: "SAFPS",
    body: "The vehicle history service used by South African banks, insurers and the police.",
    url: "https://www.safps.org.za/",
  },
  {
    label: "NaTIS",
    body: "Where a change of ownership is registered, and where the registration certificate is issued.",
    url: "https://www.natis.gov.za/",
  },
] as const;

/**
 * The reader's own progress through the sale checklist, kept on their device.
 *
 * This is the only honest form of the brief's milestone tracker. Nothing here
 * advances on its own, and nothing is verified by anyone: it is a list the two
 * parties tick as they go. It is not an escrow state.
 */
export const CHECKLIST_KEY = "truewheels_sale_checklist_v1";

export type ChecklistState = Record<string, string[]>;

export function readChecklist(): ChecklistState {
  try {
    const raw = window.localStorage.getItem(CHECKLIST_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const out: ChecklistState = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (Array.isArray(value)) out[key] = value.filter((v): v is string => typeof v === "string");
    }
    return out;
  } catch {
    // Corrupt or unavailable storage must not break the page.
    return {};
  }
}

export function writeChecklist(state: ChecklistState): void {
  try {
    window.localStorage.setItem(CHECKLIST_KEY, JSON.stringify(state));
  } catch {
    // A failed write only loses a tick; it must not throw into the render.
  }
}

/** A reference for a listing, in the form the rest of the app uses. */
export function saleRef(vehicle: DemoVehicle): string {
  const digits = vehicle.id.replace(/\D/g, "").padStart(4, "0");
  return `TW-${vehicle.year}-${digits}`;
}

export function formatRand(value: number): string {
  return `R ${Math.round(value).toLocaleString("en-ZA")}`;
}
