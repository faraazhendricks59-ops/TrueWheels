/**
 * The community feed's content, and what it honestly is.
 *
 * This phase asked for a "Twitter/Instagram layer" with a Verified Driver badge
 * for anyone who has "Completed 5+ transactions", trending hashtags with post
 * counts, RSVP counts for meets, and accounts to follow. None of the machinery
 * behind any of that exists:
 *
 *  - There is no community service, no post store and no way to publish. So no
 *    post here was written by a member, and the feed shows seeded examples that
 *    say so on every card rather than only in a footnote.
 *  - There is no transaction history, so "5+ transactions" cannot be checked and
 *    a verified badge would assert a record this project has never seen. The
 *    review section was emptied in Phase 37 for the same reason, and a badge is
 *    a stronger claim than a review because it looks like a check we performed.
 *  - There is no engagement tracking, so a reply, boost or rev count would be
 *    invented. The counts are absent rather than zero, because a real zero is
 *    also a claim.
 *  - The trending list was produced with Math.random(), which is not a trend. It
 *    also re-randomises on every render, so two visitors would see different
 *    numbers for the same topic.
 *  - There is no events diary, so RSVP counts are invented, and the two meets in
 *    the brief were invented too.
 *  - Suggested accounts would be fabricated people presented as real members.
 *    Under POPIA, following someone is consent-based, so a list of accounts
 *    assembled without their knowledge is the wrong shape as well as fake.
 *
 * The seeded posts reference real listings from DEMO_VEHICLES, so the vehicle
 * embed is real even though the post around it is an example.
 */

import { DEMO_VEHICLES, type DemoVehicle } from "./demo/vehicles";

export interface CommunityPost {
  id: string;
  authorName: string;
  authorHandle: string;
  content: string;
  /** ISO date, so the card renders the same on the server and the client. */
  postedAt: string;
  /** A real listing id from DEMO_VEHICLES, or absent. */
  vehicleId?: string;
}

export const DEMO_POSTS: CommunityPost[] = [
  {
    id: "p-1",
    authorName: "Demo member",
    authorHandle: "demo_gti",
    content:
      "Example post. Collected a hatchback this week and took it up to the passes. The gearbox is quick, but the ride is firmer than I expected on our roads. Anyone running 18s on a daily? #GolfGTI #TrueWheels",
    postedAt: "2026-11-14T07:20:00.000Z",
    vehicleId: "v-1",
  },
  {
    id: "p-2",
    authorName: "Demo member",
    authorHandle: "demo_kzn",
    content:
      "Example post. Looking for an independent workshop in Durban that actually knows these engines. The last quote I got was more than the service plan. Who do you use?",
    postedAt: "2026-11-14T05:05:00.000Z",
  },
  {
    id: "p-3",
    authorName: "Demo member",
    authorHandle: "demo_bakkie",
    content:
      "Example post. Bakkie prices have gone strange this year. Same model, same year, R60k apart depending on the province. Worth widening the search before you commit. #BakkieLife",
    postedAt: "2026-11-13T16:40:00.000Z",
    vehicleId: "v-2",
  },
];

export function vehicleForPost(post: CommunityPost): DemoVehicle | undefined {
  if (!post.vehicleId) return undefined;
  return DEMO_VEHICLES.find((vehicle) => vehicle.id === post.vehicleId);
}

/** The two characters used where an avatar would go. No photograph is used. */
export function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export const DRAFT_STORAGE_KEY = "truewheels_community_draft";

export interface CommunityDraft {
  text: string;
  vehicleId: string | null;
}

export function readDraft(): CommunityDraft {
  if (typeof window === "undefined") return { text: "", vehicleId: null };
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return { text: "", vehicleId: null };
    const parsed = JSON.parse(raw) as Partial<CommunityDraft>;
    return {
      text: typeof parsed.text === "string" ? parsed.text : "",
      vehicleId: typeof parsed.vehicleId === "string" ? parsed.vehicleId : null,
    };
  } catch {
    return { text: "", vehicleId: null };
  }
}

export function writeDraft(draft: CommunityDraft): void {
  try {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Storage being unavailable must not break the composer.
  }
}

export function clearDraft(): void {
  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // As above.
  }
}

/** The feed's standing disclosure, shown above the posts. */
export const FEED_DISCLOSURE =
  "TrueWheels has no community service yet, so nobody can publish a post and no post below was written by a member. The three posts shown are examples, written to demonstrate the layout, and each is labelled. Engagement counts, verified badges, trends and events are not shown because nothing records them.";

export const COMPOSER_DISCLOSURE =
  "Your text is saved as a draft in this browser. It cannot be published, because TrueWheels has no community service to publish it to, and no one else can see it.";

export const SIDEBAR_DISCLOSURE = [
  "TrueWheels does not track which topics are popular, so there is no trending list to show. A list of tags with post counts would be invented.",
  "There is no events diary. Meets and track days are announced by the organisers on their own channels, and it is worth checking with the venue directly before travelling.",
  "There are no accounts to suggest. TrueWheels has no member accounts here, and suggesting people who have not agreed to be listed would be both fabricated and, under POPIA, the wrong basis for contact.",
] as const;
