/**
 * Messages, and why this is a drafts list rather than a chat app.
 *
 * The brief for this phase was a full realtime chat product: an inbox of
 * conversations with "Prestige Motors SA", "Marcus Drifts" and "Sarah J.", each with
 * a trust badge ("CIPC & FICA verified by TrueWheels Admin", "MIWA & workshop
 * registration verified"), a green "Active now" dot, a "Within 1 hour" response
 * time, read receipts, and — the part that matters most — a chat view that, two
 * seconds after the reader sends anything, produces a reply from the other person:
 *
 *     "Thanks for your message! I'll get back to you shortly."
 *
 * That last one is not a missing feature, it is a lie told in a human's voice. A
 * buyer would read it as the seller answering, and act on it — wait for a reply that
 * will never come, or worse, believe a dealer has acknowledged an offer. Nothing in
 * this project can send a message, so nothing can reply. The same applies to every
 * other signal in the brief: there is no account system (src/lib/profile.ts,
 * NO_FOLLOW_GRAPH), so there are no participants and no "online"; nothing records a
 * read event, so "delivered" and "read" are decoration; and no check against CIPC,
 * FICA or MIWA is performed anywhere, so those badges assert verification that never
 * happened (src/lib/profile.ts, NO_VERIFICATION). src/lib/contact.ts already says
 * there is no messaging service, and the "Message in app" button in
 * ContactActionBar.tsx is a toast admitting it.
 *
 * What is real, and already established by src/lib/contact.ts, is the useful half:
 * a well-written message is worth more than a button that pretends to deliver one.
 * So this module stores the messages a buyer writes to sellers — the enquiry, the
 * offer, the test-drive request — anchored to the real listing they came from, so the
 * reader can find the wording again, edit it, copy it, and send it through a channel
 * of their own choosing. There is no inbox of other people's messages because there
 * are no other people. The vehicle in each thread is a real listing from the
 * catalogue, and the link goes to its real page.
 */

import type { DemoVehicle } from "@/lib/demo/vehicles";

export const DRAFTS_KEY = "truewheels_message_drafts_v1";

export const MESSAGE_KINDS = ["enquiry", "offer", "test_drive"] as const;
export type MessageKind = (typeof MESSAGE_KINDS)[number];

export const KIND_LABELS: Record<MessageKind, string> = {
  enquiry: "Enquiry",
  offer: "Offer",
  test_drive: "Test drive",
};

export interface MessageDraft {
  id: string;
  /** The real listing this message is about. */
  vehicleId: string;
  vehicleTitle: string;
  vehiclePrice: number;
  vehicleLocation: string;
  kind: MessageKind;
  /** The message text, which the reader can edit before sending it themselves. */
  body: string;
  createdAt: string;
  updatedAt: string;
}

export const EMPTY_DRAFTS: MessageDraft[] = [];

function isKind(value: unknown): value is MessageKind {
  return typeof value === "string" && (MESSAGE_KINDS as readonly string[]).includes(value);
}

/** Reads a stored value defensively; anything malformed is dropped, not trusted. */
export function parseDrafts(raw: unknown): MessageDraft[] {
  if (!Array.isArray(raw)) return [];
  const out: MessageDraft[] = [];
  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) continue;
    const record = entry as Record<string, unknown>;
    const { id, vehicleId, vehicleTitle, vehiclePrice, vehicleLocation, kind, body, createdAt, updatedAt } =
      record;
    if (typeof id !== "string" || !id) continue;
    if (typeof vehicleId !== "string" || !vehicleId) continue;
    if (typeof vehicleTitle !== "string" || !vehicleTitle) continue;
    if (!isKind(kind)) continue;
    if (typeof body !== "string") continue;
    out.push({
      id,
      vehicleId,
      vehicleTitle,
      vehiclePrice: typeof vehiclePrice === "number" && Number.isFinite(vehiclePrice) ? vehiclePrice : 0,
      vehicleLocation: typeof vehicleLocation === "string" ? vehicleLocation : "",
      kind,
      body,
      createdAt: typeof createdAt === "string" ? createdAt : new Date(0).toISOString(),
      updatedAt: typeof updatedAt === "string" ? updatedAt : new Date(0).toISOString(),
    });
  }
  return out;
}

/** Builds a draft from a real listing and an opening body. */
export function draftFromVehicle(vehicle: DemoVehicle, kind: MessageKind, body: string): Omit<MessageDraft, "id" | "createdAt" | "updatedAt"> {
  return {
    vehicleId: vehicle.id,
    vehicleTitle: vehicle.title,
    vehiclePrice: vehicle.price,
    vehicleLocation: vehicle.location,
    kind,
    body,
  };
}

export const MESSAGES_DISCLOSURE =
  "TrueWheels has no messaging service, so it cannot send a message or receive one, and there is no inbox of other people's messages. These are the messages you have written to sellers, kept in this browser. Edit them, copy them, and send them through a channel you choose — WhatsApp, email or a phone call. The listing each one is about is real, and links to its page.";

export const NO_DRAFTS =
  "No messages yet. Open a listing and use \"Message in app\" or \"Prepare offer\", and the message you write is saved here so you can find the wording again. Nothing is sent from TrueWheels, because there is no service to send it.";

export const NO_REPLIES =
  "You will not receive a reply here. TrueWheels cannot deliver a message, so it cannot receive one either, and it does not know who the seller is. A reply would come to whichever channel you actually sent the message from.";

export const DRAFT_LOCAL_ONLY =
  "Saved in this browser only. Clearing site data removes it, and nothing is uploaded anywhere.";

export const NO_COUNTERPARTY =
  "There is no one on the other side of this thread. TrueWheels has no accounts, so it cannot show who is online, whether a message was delivered, or whether it was read — and it will not pretend to.";

/** Filesystem-safe id from a listing id and kind. */
export function draftId(vehicleId: string, kind: MessageKind): string {
  return `${vehicleId}--${kind}`;
}
