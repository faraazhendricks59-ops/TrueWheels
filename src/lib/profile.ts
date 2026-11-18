/**
 * What a profile can honestly show, and what it cannot.
 *
 * The brief asked for an "Instagram-meets-LinkedIn" profile carrying a banner, a
 * bold avatar, and "deep-decoded trust metrics". Most of the trust layer is the
 * Phase 41 problem for the third time, and it is the worst version of it yet:
 *
 *  - A "Verified Dealer" / "Certified Mechanic" / "Verified Driver" badge whose
 *    tooltip read "Identity and transaction history verified by TrueWheels
 *    Admin." There is no admin review queue, no transaction history, and no
 *    verification of anyone.
 *  - "Identity Verified — FICA documents and ID cross-referenced with Home
 *    Affairs API." FICA obliges accountable institutions to identify their
 *    clients, and Home Affairs holds the national identity register. This claims
 *    a live government integration we do not have. It is the strongest trust
 *    claim in the codebase and it is entirely invented.
 *  - "Phone Verified — OTP verified on +27 82 *** 4567" and "Email Verified —
 *    confirmed via magic link." There is no SMS provider and no mail provider.
 *  - "4.9/5.0 based on 14 verified transactions." The review section was emptied
 *    in Phase 37 precisely because no sale has happened here. This is the same
 *    invention, moved onto a profile.
 *  - "142 posts, 8 450 followers, 312 following." There is no follow graph and
 *    no post store, so all four numbers would be invented. A follower count is a
 *    claim about how many people chose this person.
 *  - A green "online" dot. Nothing tracks presence, so it would assert activity
 *    that is not observed.
 *  - An avatar from i.pravatar.cc, which responds and serves a real photograph of
 *    a real person, attached to an invented identity.
 *
 * So a profile here shows only what is real: the signed-in session's own name and
 * role, and the vehicles that person has actually saved on this device. The
 * banner is a generated gradient rather than a photograph we do not have, the
 * avatar is initials rather than a stranger's face, and every unavailable metric
 * is absent rather than zero, because a real zero is also a claim.
 */

import { DEMO_VEHICLES, type DemoVehicle } from "./demo/vehicles";

/** The three surfaces the header's actions can reach, all real routes. */
export const PROFILE_TABS = ["posts", "garage", "reviews", "about"] as const;
export type ProfileTab = (typeof PROFILE_TABS)[number];

export const DISPLAY_NAME_MAX = 40;

/** Seeded examples from Phase 41, shown here as examples and labelled so. */
export { DEMO_POSTS } from "./social";

/**
 * Saved vehicles, resolved from the real ids the personalization store keeps.
 *
 * An id with no matching vehicle is dropped rather than rendered as a gap: the
 * store can outlive a change to the demo catalogue.
 */
export function resolveSavedVehicles(ids: string[]): DemoVehicle[] {
  const byId = new Map(DEMO_VEHICLES.map((vehicle) => [vehicle.id, vehicle]));
  return ids.map((id) => byId.get(id)).filter((vehicle): vehicle is DemoVehicle => Boolean(vehicle));
}

export const NO_FOLLOW_GRAPH =
  "TrueWheels has no follow graph, so there are no follower or following counts to show.";

export const NO_VERIFICATION =
  "TrueWheels does not verify identity, qualifications or transactions. There is no admin review, no document check and no link to any government register, so no badge is shown here.";

export const NO_REVIEWS =
  "Reviews were taken off the vehicle pages because no sale has taken place through this platform and there is no way to confirm that a reviewer bought anything. The same applies here, so there is no rating and no review list.";

export const NO_POST_STORE =
  "There is no post store, so nobody can publish. The posts below are the seeded examples from the community feed, shown here to demonstrate the layout.";

export const EXAMPLE_PROFILE =
  "This profile is an example. The name is not a real member, and the page is not reachable from the navigation.";

export const GARAGE_EMPTY =
  "Nothing has been saved in this browser yet. Saving a vehicle from the marketplace adds it here, and it is stored on this device only.";

export const IDENTITY_ON_DEVICE =
  "Identity comes from the signed session cookie on this device. In demo mode any role can be issued, which is why this is described as a session rather than a verified account.";
