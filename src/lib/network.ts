/**
 * The social graph, and what this project actually has of one.
 *
 * The phase brief asked for three things, and none of the machinery behind them
 * exists here:
 *
 *  - A follow/follower list with "mutual" counts and deep-decoded trust badges
 *    ("Verified Driver — identity & 5+ transactions verified", "Verified Dealer —
 *    CIPC & FICA verified by TrueWheels Admin", "Certified Mechanic — MIWA &
 *    workshop registration verified"). There is no follow graph, no account
 *    store and no admin review, so a mutual count would be invented and each
 *    badge would assert a check against a government or industry register that
 *    this project has never performed. src/lib/profile.ts already records this
 *    as NO_FOLLOW_GRAPH and NO_VERIFICATION.
 *  - An AI suggestion engine that "analyzes user garages and follow-graphs",
 *    returning people with a confidence score and a reasoning string. There are
 *    no other members to analyse. Suggesting people who do not exist, and
 *    attaching a percentage to the suggestion, manufactures both the people and
 *    the certainty.
 *  - A realtime activity rail broadcasting what "your network" is buying and
 *    selling. Nothing records another person's actions, so every event and its
 *    timestamp would be fabricated, and a pulsing live dot beside a made-up
 *    purchase is the strongest form of manufactured demand there is. This is the
 *    same class of claim removed from the marketplace in Phase 45
 *    (LiveActivityRail, the "Live" card badge, SEED_NOTIFICATIONS).
 *
 * What is real is the reader's own activity on this device: the vehicles they
 * viewed, saved, added to their garage and the searches they kept. That is
 * genuinely recorded, genuinely theirs, and can be shown with its source named.
 * So this module builds the network page out of that, and states plainly what is
 * missing. `NETWORK_DISCLOSURE` is that statement.
 *
 * Following someone is consent-based under POPIA, which is a second, independent
 * reason not to assemble a list of accounts without their knowledge — the same
 * point src/lib/social.ts makes in SIDEBAR_DISCLOSURE.
 */

import { DEMO_VEHICLES, type DemoVehicle } from "@/lib/demo/vehicles";
import {
  recommendForYou,
  viewedVehicles,
  type Recommendation,
} from "@/lib/personalization";

export const NETWORK_DISCLOSURE =
  "TrueWheels has no accounts and no follow graph, so there is nobody here to follow, no follower or mutual counts, and no activity from other members to show. Nothing on this page is another person's action. What it does show is your own activity on this device, which is stored only in this browser.";

export const NO_MEMBERS =
  "There are no member accounts in this project, so there is no list of people to display. The suggestions below are vehicles, not people, because a vehicle can be recommended from your own history without inventing anyone.";

export const NO_SUGGESTED_PEOPLE =
  "TrueWheels does not suggest people. It has no accounts to analyse, and following is consent-based, so a list of accounts assembled without their knowledge would be the wrong basis for contact as well as fabricated.";

export const ACTIVITY_LOCAL_ONLY =
  "These are your own actions in this browser. No other member's activity is recorded, and nothing here is sent to a server.";

/** The honest empty state for the member list. */
export const FOLLOW_LIST_EMPTY =
  "Nobody is here yet. TrueWheels has no accounts, so there is no one to follow and no follower list to show.";

export type ActivityKind = "viewed" | "saved" | "garaged" | "searched";

export interface NetworkActivity {
  id: string;
  kind: ActivityKind;
  /** What the reader did, in the reader's own words. */
  summary: string;
  /** Where the reader can go to see it again. */
  href: string;
  /** A short provenance line naming the on-device store the entry came from. */
  source: string;
}

export interface NetworkSignals {
  viewedIds: string[];
  savedIds: string[];
  searchQueries: string[];
  /** Titles of vehicles in the reader's garage, with their id for linking. */
  garaged: { id: string; title: string }[];
  /** Saved search names, paired with their query for the link. */
  savedSearches: { id: string; name: string; query: string }[];
}

function titleFor(id: string): string | undefined {
  return DEMO_VEHICLES.find((vehicle) => vehicle.id === id)?.title;
}

/**
 * The reader's own activity, newest signal first.
 *
 * Ordering is deliberate rather than chronological, because the stores record
 * different things and only the garage carries a real timestamp. A fabricated
 * "2h ago" would be a claim about when something happened, so no relative time is
 * shown at all: each entry says which store it came from instead.
 */
export function buildActivity(signals: NetworkSignals): NetworkActivity[] {
  const out: NetworkActivity[] = [];

  for (const { id, title } of signals.garaged.slice(0, 3)) {
    out.push({
      id: `garaged-${id}`,
      kind: "garaged",
      summary: `You added the ${title} to your garage`,
      href: "/garage",
      source: "Your digital garage, on this device",
    });
  }

  for (const id of signals.savedIds.slice(0, 3)) {
    const title = titleFor(id);
    if (!title) continue;
    out.push({
      id: `saved-${id}`,
      kind: "saved",
      summary: `You saved the ${title}`,
      href: `/vehicles/${id}`,
      source: "Your saved vehicles, on this device",
    });
  }

  for (const { id, name, query } of signals.savedSearches.slice(0, 2)) {
    out.push({
      id: `search-${id}`,
      kind: "searched",
      summary: `You kept a search called "${name}"`,
      href: `/marketplace?${query}`,
      source: "Your saved searches, on this device",
    });
  }

  for (const id of signals.viewedIds.slice(0, 3)) {
    const title = titleFor(id);
    if (!title) continue;
    out.push({
      id: `viewed-${id}`,
      kind: "viewed",
      summary: `You viewed the ${title}`,
      href: `/vehicles/${id}`,
      source: "Your viewing history, on this device",
    });
  }

  return out;
}

/**
 * Vehicles to suggest, from the signals the project actually holds.
 *
 * This is the existing `recommendForYou` engine, unchanged, so the reasons it
 * returns ("Matches a search you saved", "Similar to the X you viewed") are the
 * same ones already shown elsewhere and are each traceable to a stored signal.
 * The brief's confidence percentages are not added: the score comes from a fixed
 * weighting of price band, body type and mileage, and presenting that as a
 * percentage of certainty about a person would overstate it.
 */
export function suggestVehicles(signals: NetworkSignals, limit = 4): Recommendation[] {
  return recommendForYou(
    {
      viewedIds: signals.viewedIds,
      savedIds: signals.savedIds,
      searchQueries: signals.searchQueries,
    },
    limit,
  );
}

/** Recently viewed, for the small "picking up where you left off" strip. */
export function recentlyViewed(viewedIds: string[], limit = 3): DemoVehicle[] {
  return viewedVehicles(viewedIds).slice(0, limit);
}
