/**
 * Demo billing data for the dealer subscription hub.
 *
 * Static for now — swap for a real billing provider (Stripe/Paystack) later.
 * Kept in one module so the overview, invoice table and plan comparison cannot
 * drift out of sync with each other.
 */

import { localeTag, type Locale, type TranslationKey } from "@/lib/i18n/dictionaries";

export const VAT_RATE = 0.15;

export interface UsageMeter {
  labelKey: TranslationKey;
  used: number;
  limit: number;
}

export interface Invoice {
  id: string;
  /** ISO date — formatted per locale at render time. */
  date: string;
  /** Ex-VAT amount in ZAR. */
  amount: number;
  status: "paid" | "due" | "failed";
}

export interface SubscriptionPlan {
  id: "basic" | "professional" | "enterprise";
  nameKey: TranslationKey;
  /** Monthly price in ZAR, ex-VAT. */
  price: number;
  featureKeys: TranslationKey[];
}

export const CURRENT_PLAN_ID = "professional" as const;

export const PLAN_PRICE = 1499;
/** ISO date of the next renewal. */
export const RENEWS_ON = "2026-12-14";
export const PAYMENT_METHOD = "Visa •••• 4242";

export const USAGE: UsageMeter[] = [
  { labelKey: "billing.usage.listings", used: 24, limit: 50 },
  { labelKey: "billing.usage.seats", used: 3, limit: 5 },
  { labelKey: "billing.usage.boosts", used: 7, limit: 20 },
];

export const PLANS: SubscriptionPlan[] = [
  {
    id: "basic",
    nameKey: "billing.plan.basic",
    price: 0,
    featureKeys: ["billing.feature.listings5", "billing.feature.analyticsStandard", "billing.feature.emailSupport"],
  },
  {
    id: "professional",
    nameKey: "billing.plan.professional",
    price: 1499,
    featureKeys: [
      "billing.feature.listings50",
      "billing.feature.crm",
      "billing.feature.analyticsAdvanced",
      "billing.feature.boosts20",
      "billing.feature.seats5",
    ],
  },
  {
    id: "enterprise",
    nameKey: "billing.plan.enterprise",
    price: 4999,
    featureKeys: [
      "billing.feature.listingsUnlimited",
      "billing.feature.dmsSync",
      "billing.feature.wholesale",
      "billing.feature.boostsUnlimited",
      "billing.feature.accountManager",
    ],
  },
];

export const INVOICES: Invoice[] = [
  { id: "INV-2026-011", date: "2026-11-14", amount: 1499, status: "paid" },
  { id: "INV-2026-010", date: "2026-10-14", amount: 1499, status: "paid" },
  { id: "INV-2026-009", date: "2026-09-14", amount: 1499, status: "paid" },
  { id: "INV-2026-008", date: "2026-08-14", amount: 1499, status: "paid" },
  { id: "INV-2026-007", date: "2026-07-14", amount: 1499, status: "paid" },
  { id: "INV-2026-006", date: "2026-06-14", amount: 1499, status: "failed" },
];

/** "R 1 499" — whole rand, ZA thin-space grouping. */
export function formatZar(amount: number): string {
  return `R ${amount.toLocaleString("en-ZA", { maximumFractionDigits: 0 })}`;
}

/** "R 1 723,85" — VAT-inclusive, 2 decimals. */
export function formatZarWithVat(amount: number): string {
  return `R ${(amount * (1 + VAT_RATE)).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Locale-aware long date, e.g. "14 December 2026" / "14 Desember 2026". */
export function formatLongDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00`));
}
