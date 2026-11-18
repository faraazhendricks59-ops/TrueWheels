/**
 * What this project knows about how a listing is performing.
 *
 * The brief for this phase supplied `viewsLast24h: 45`, `savesLast24h: 12` and a
 * price drop of R15 000 two days earlier, and asked for "genuine, trustworthy
 * urgency" built on "real, aggregated, anonymized platform data". None of that
 * data exists here:
 *
 *  - There is no analytics service and no server-side counter. `trackView` in
 *    PersonalizationProvider records only the current visitor's own history, in
 *    their own browser, and never leaves it. One person's history is not an
 *    audience, and it cannot be turned into a count of other buyers.
 *  - There is no price history of any kind. A price drop is a claim about the
 *    past that cannot be checked and cannot be computed, and it is one of the
 *    strongest reasons a buyer will pay more than they meant to.
 *  - There is no auction or deadline feature.
 *
 * Scarcity that is invented is not a harmless flourish. It pushes people into a
 * decision they would not otherwise make, and in South Africa section 5(2)(b) of
 * the Consumer Protection Act prohibits marketing that is misleading in any way,
 * whether by omission or by the manner in which it is conveyed.
 *
 * So rather than a component that invents numbers, this module states plainly
 * what is not measured, and the component that renders it is a disclosure rather
 * than a badge. If a real activity feed is built later, `ACTIVITY_UNAVAILABLE`
 * becomes false and the numbers can be shown with their source named.
 */

/** False while no aggregate activity is recorded anywhere in the project. */
export const ACTIVITY_UNAVAILABLE = true;

export const ACTIVITY_DISCLOSURE =
  "TrueWheels does not count views, saves or enquiries, so it cannot show how many people have looked at this vehicle. It also keeps no record of earlier asking prices, so it cannot say whether the price has changed. Any figure here would be invented.";

/** What a buyer can establish for themselves instead of trusting a counter. */
export const ACTIVITY_CHECKS: readonly string[] = [
  "Ask the seller how long the vehicle has been advertised, and whether the price has changed.",
  "Ask how many people have viewed or enquired about it. A seller who has had the car for months may be more open to an offer.",
  "Check the vehicle yourself rather than relying on how popular a listing appears.",
] as const;
