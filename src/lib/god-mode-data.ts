import { FEATURE_KEYS, type FeatureKey } from "./feature-flags";

/**
 * The God Mode Console, and what this project actually has of one.
 *
 * The phase brief asked for a control room that toggles every feature flag, runs
 * emergency kill switches with a 30-minute cooldown, schedules rollouts, targets by
 * role and geography, and inspects an "immutable, SHA-256-chained audit trail". Its
 * sample data carried a dozen flags, an audit log of changes attributed to named
 * people with their IP addresses and browsers, and a badge reading "Chain integrity
 * verified".
 *
 * The flags are real. Almost nothing else is, and the gap matters:
 *
 *  - The 256 flags in `src/lib/feature-flags.tsx` are compile-time constants in a
 *    `as const` object. There is no runtime store behind them and `FeatureProvider`
 *    reads the object directly — its own comment says a Firestore listener is a job
 *    for "a later phase". So a console that appeared to toggle a flag would change
 *    nothing: the switch would flip, the page would look like it worked, and the
 *    feature would carry on exactly as before. A control room whose controls do not
 *    control anything is worse than none, because an operator would rely on it
 *    during the incident it was supposed to fix.
 *  - There is no audit log. Nothing writes one, and nothing has ever been recorded.
 *    An "immutable" log that is displayed but not written is a screenshot of a
 *    security control, not the control. The brief's entries also named people —
 *    "Lerato Khumalo", "Thabo Molefe" — and gave IP addresses and user agents for
 *    actions they never took, which is the same fabricated-attribution problem the
 *    repo removed elsewhere.
 *  - The flags in the brief's sample data mostly do not exist. `marketplace.live_rail`
 *    and `social.activity_rail` name features the repo already deleted as fabricated
 *    (see `src/lib/listing-activity.ts`), and `transactions.pay_now` sits on an
 *    escrow that Phase 53 established is not real. A flag list is a description of
 *    what the platform can do, so a list with invented entries in it misleads the
 *    person reading it about the state of the system.
 *  - There is no environment separation. The app runs one build with one set of
 *    constants; "Production / Staging / Preview" toggles would switch a label while
 *    every environment stayed identical.
 *  - There is no targeting, rollout percentage or scheduling. Nothing evaluates a
 *    segment or a clock.
 *
 * One part of the brief is already done: `src/middleware.ts` hard-gates `/admin` to
 * the admin role, server-side, before any page renders.
 *
 * So this module describes the flags that exist, in the form they exist in, and
 * states what is missing. If a runtime flag store is built later,
 * `GOD_MODE_UNAVAILABLE` becomes false and the console can become an editor.
 */

/** False while flags are compile-time constants with no runtime store. */
export const GOD_MODE_UNAVAILABLE = true;

export const GOD_MODE_DISCLOSURE =
  "This is a read-only view of the platform's feature flags. The flags are set in the code, not in a database, so there is nothing here that can be changed at runtime. No toggle on this page would take effect, no kill switch would stop a feature, and no change would be recorded anywhere. The flags listed are exactly the ones the application was built with.";

/**
 * The flags that act as platform-wide switches. These are the closest thing the
 * codebase has to a kill switch: they are read by the app at build time and would
 * take effect on the next deployment.
 */
export const GLOBAL_FLAGS: readonly FeatureKey[] = [
  "global.maintenance",
  "global.disable_payments",
  "global.retry_action",
];

/** A flag and the group it belongs to, derived from the key's own prefix. */
export interface FlagRow {
  key: FeatureKey;
  group: string;
  enabled: boolean;
}

function groupOf(key: string): string {
  const prefix = key.split(".")[0];
  return prefix;
}

/**
 * Every flag the application was built with, grouped by prefix.
 *
 * Derived from `FEATURE_KEYS` rather than written out, so this view cannot drift
 * from the flags the app actually reads. Adding a flag to the code adds it here.
 */
export function realFlags(): FlagRow[] {
  return (Object.keys(FEATURE_KEYS) as FeatureKey[]).map((key) => ({
    key,
    group: groupOf(key),
    enabled: FEATURE_KEYS[key],
  }));
}

export function flagGroups(): { group: string; count: number; enabled: number }[] {
  const map = new Map<string, { count: number; enabled: number }>();
  for (const row of realFlags()) {
    const entry = map.get(row.group) ?? { count: 0, enabled: 0 };
    entry.count += 1;
    if (row.enabled) entry.enabled += 1;
    map.set(row.group, entry);
  }
  return Array.from(map.entries())
    .map(([group, value]) => ({ group, ...value }))
    .sort((a, b) => a.group.localeCompare(b.group));
}

/** The flags that are off in the build as shipped. */
export function disabledFlags(): FlagRow[] {
  return realFlags().filter((row) => !row.enabled);
}

/**
 * What a real control room needs, none of which is present. Stated as requirements
 * rather than features, because none of them exist.
 */
export const WHAT_IS_MISSING: readonly { title: string; body: string }[] = [
  {
    title: "A runtime store for the flags",
    body: "The flags are constants in the code today. Toggling one requires a code change and a deployment. A console needs somewhere to hold a value that the running application reads, and a way for a change to reach every server and browser.",
  },
  {
    title: "An audit log that is written by the system, not displayed by it",
    body: "A record of who changed what, when and why has to be produced by the thing making the change, and be beyond the reach of the person making it. A log the console renders is a view; the control is the write.",
  },
  {
    title: "Real kill switches, with a defined effect",
    body: "Disabling a feature has to stop the feature, on the server, for everyone, immediately. A switch that only changes a label is not a kill switch.",
  },
  {
    title: "Separate environments",
    body: "Staging and preview need to be different deployments with their own flag values, not a selector on one build that changes a heading.",
  },
  {
    title: "Targeting that is actually evaluated",
    body: "A rule about roles, geography or a percentage only means something if something reads it when a request arrives. Nothing in this project evaluates a segment or a rollout percentage.",
  },
];
