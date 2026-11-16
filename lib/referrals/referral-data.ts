/**
 * Referral programme rules and the signed-in user's referral summary.
 *
 * Single source of truth for the numbers: the dashboard stats, the tier ladder
 * and the credits total all derive from here, so they cannot drift apart the
 * way hand-written literals do.
 */

export interface RewardTier {
  name: string;
  /** Referrals required to unlock this tier. */
  min: number;
  /** Translation key for the reward copy. */
  rewardKey:
    | "referral.tier.bronze.reward"
    | "referral.tier.silver.reward"
    | "referral.tier.gold.reward"
    | "referral.tier.platinum.reward";
  /** Tailwind gradient stops for the tier badge. */
  gradient: string;
}

export const REWARD_TIERS: RewardTier[] = [
  { name: "Bronze", min: 0, rewardKey: "referral.tier.bronze.reward", gradient: "from-amber-700 to-amber-600" },
  { name: "Silver", min: 3, rewardKey: "referral.tier.silver.reward", gradient: "from-gray-400 to-gray-300" },
  { name: "Gold", min: 5, rewardKey: "referral.tier.gold.reward", gradient: "from-amber-500 to-yellow-400" },
  { name: "Platinum", min: 10, rewardKey: "referral.tier.platinum.reward", gradient: "from-purple-500 to-indigo-400" },
];

/** Listing credit awarded to each side of a successful referral, in rand. */
export const CREDIT_PER_REFERRAL = 100;

export interface ReferralSummary {
  /** The user's shareable referral code. */
  code: string;
  invitesSent: number;
  friendsJoined: number;
  /** Credits already paid out, in rand. */
  creditsPaidOut: number;
}

/**
 * Demo summary until the referrals API lands. creditsPaidOut is deliberately
 * lower than friendsJoined * CREDIT_PER_REFERRAL: a referral only pays out once
 * the friend lists their first vehicle, so joined != paid.
 */
export const DEMO_REFERRAL_SUMMARY: ReferralSummary = {
  code: "marcusdrifts",
  invitesSent: 14,
  friendsJoined: 6,
  creditsPaidOut: 450,
};

/** Credits still pending because those friends have not listed yet. */
export function pendingCredits(summary: ReferralSummary): number {
  const expected = summary.friendsJoined * CREDIT_PER_REFERRAL;
  return Math.max(expected - summary.creditsPaidOut, 0);
}

/** Referral codes are lower-case alphanumerics and dashes, 3-30 characters. */
export const REFERRAL_CODE_PATTERN = /^[a-z0-9-]{3,30}$/;

export function isValidReferralCode(code: string | undefined | null): boolean {
  return typeof code === "string" && REFERRAL_CODE_PATTERN.test(code);
}

export function referralLink(code: string, origin = "https://truewheels.co.za"): string {
  return `${origin}/r/${code}`;
}

export function nextTier(referrals: number): RewardTier | null {
  return REWARD_TIERS.find((tier) => referrals < tier.min) ?? null;
}

export function currentTier(referrals: number): RewardTier {
  let current = REWARD_TIERS[0];
  for (const tier of REWARD_TIERS) {
    if (referrals >= tier.min) current = tier;
  }
  return current;
}

/** Cookie holding the referring user's code until the visitor signs up. */
export const REFERRAL_COOKIE = "tw_ref";

/** 30 days, matching the usual referral attribution window. */
export const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
