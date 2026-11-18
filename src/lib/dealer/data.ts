import { localeTag } from "@/lib/i18n/locale";

/**
 * Demo data for the dealer command centre.
 *
 * No dealership back end is connected to this build, so every figure here is
 * sample data and is labelled as such wherever it is shown. The values are
 * deterministic (no Math.random) so the server and client render identically.
 *
 * Titles use makes that `vehicle-photos.ts` has a real photograph for, so the
 * thumbnail shows the right kind of car and carries its Commons attribution.
 */

export type ListingStatus = "active" | "pending" | "sold" | "paused";

export const STATUS_CONFIG: Record<
  ListingStatus,
  { label: string; tone: "green" | "amber" | "ink" | "red" }
> = {
  active: { label: "Live", tone: "green" },
  pending: { label: "Pending review", tone: "amber" },
  sold: { label: "Sold", tone: "ink" },
  paused: { label: "Paused", tone: "red" },
};

export interface InventoryItem {
  id: string;
  title: string;
  stockNumber: string;
  price: number;
  status: ListingStatus;
  views: number;
  inquiries: number;
  daysListed: number;
}

export const SAMPLE_INVENTORY: InventoryItem[] = [
  { id: "v1", title: "2021 Volkswagen Golf GTI", stockNumber: "PM-1042", price: 649000, status: "active", views: 1240, inquiries: 14, daysListed: 12 },
  { id: "v2", title: "2022 BMW M3 Competition", stockNumber: "PM-1043", price: 1450000, status: "active", views: 890, inquiries: 8, daysListed: 5 },
  { id: "v3", title: "2019 Ford Ranger Raptor", stockNumber: "PM-1039", price: 785000, status: "sold", views: 2100, inquiries: 22, daysListed: 28 },
  { id: "v4", title: "2020 Audi RS6 Avant", stockNumber: "PM-1044", price: 2150000, status: "pending", views: 0, inquiries: 0, daysListed: 0 },
  { id: "v5", title: "2023 Toyota Hilux Legend", stockNumber: "PM-1045", price: 899000, status: "active", views: 1620, inquiries: 19, daysListed: 9 },
  { id: "v6", title: "2021 Mercedes-Benz C-Class AMG", stockNumber: "PM-1046", price: 1180000, status: "active", views: 745, inquiries: 6, daysListed: 18 },
  { id: "v7", title: "2020 Hyundai Tucson", stockNumber: "PM-1040", price: 545000, status: "paused", views: 430, inquiries: 3, daysListed: 34 },
  { id: "v8", title: "2022 Kia Sportage", stockNumber: "PM-1047", price: 615000, status: "active", views: 980, inquiries: 11, daysListed: 7 },
  { id: "v9", title: "2019 Volkswagen Golf GTI", stockNumber: "PM-1038", price: 449000, status: "sold", views: 1890, inquiries: 25, daysListed: 41 },
  { id: "v10", title: "2023 BMW M3 Competition", stockNumber: "PM-1048", price: 1620000, status: "pending", views: 120, inquiries: 1, daysListed: 2 },
];

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export type LeadStage = "new" | "contacted" | "test_drive" | "negotiation" | "won" | "lost";

export const LEAD_STAGES: {
  id: LeadStage;
  label: string;
  /** Tailwind text colour class, used for the column dot. */
  color: string;
}[] = [
  { id: "new", label: "New", color: "text-aurora-blue" },
  { id: "contacted", label: "Contacted", color: "text-aurora-purple" },
  { id: "test_drive", label: "Test drive", color: "text-semantic-warning" },
  { id: "negotiation", label: "Negotiation", color: "text-brand" },
  { id: "won", label: "Won", color: "text-semantic-success" },
  { id: "lost", label: "Lost", color: "text-ink-400" },
];

export interface Lead {
  id: string;
  customerName: string;
  vehicleInterest: string;
  stage: LeadStage;
  /** Which part of the platform produced the enquiry. */
  source: string;
  /** Relative time the enquiry arrived, e.g. "10m ago". */
  received: string;
}

export const SAMPLE_LEADS: Lead[] = [
  { id: "l1", customerName: "John Doe", vehicleInterest: "2021 Volkswagen Golf GTI", stage: "new", source: "Marketplace enquiry", received: "10m ago" },
  { id: "l2", customerName: "Sarah J.", vehicleInterest: "2022 BMW M3 Competition", stage: "contacted", source: "WhatsApp deep link", received: "2h ago" },
  { id: "l3", customerName: "Marcus D.", vehicleInterest: "2020 Audi RS6 Avant", stage: "test_drive", source: "Test drive booking", received: "1d ago" },
  { id: "l4", customerName: "Thabo M.", vehicleInterest: "2019 Ford Ranger Raptor", stage: "won", source: "Secure checkout", received: "3d ago" },
  { id: "l5", customerName: "Naledi K.", vehicleInterest: "2023 Toyota Hilux Legend", stage: "new", source: "Marketplace enquiry", received: "35m ago" },
  { id: "l6", customerName: "Pieter B.", vehicleInterest: "2021 Mercedes-Benz C-Class AMG", stage: "negotiation", source: "Finance application", received: "6h ago" },
  { id: "l7", customerName: "Aisha P.", vehicleInterest: "2022 Kia Sportage", stage: "contacted", source: "Marketplace enquiry", received: "1d ago" },
  { id: "l8", customerName: "Deon V.", vehicleInterest: "2020 Hyundai Tucson", stage: "lost", source: "Marketplace enquiry", received: "5d ago" },
];

// ---------------------------------------------------------------------------
// Derived statistics
// ---------------------------------------------------------------------------

export interface DealerStats {
  activeCount: number;
  soldCount: number;
  totalViews: number;
  totalInquiries: number;
  /** Average days a sold vehicle spent listed. Null when nothing has sold. */
  averageDaysToSell: number | null;
  /** Sum of the asking price of every vehicle currently live. */
  activeStockValue: number;
  /** Sum of the asking price of every vehicle marked sold. */
  soldListedValue: number;
}

/**
 * The KPIs are derived from the inventory rather than stated independently, so
 * the numbers on the dashboard always agree with the rows in the table. Hand-set
 * figures drift from the data the moment anyone changes a listing status.
 *
 * A sold vehicle has no recorded sale price, so `soldListedValue` sums the asking
 * price and the UI calls it the listed value of sold stock.
 */
export function deriveDealerStats(inventory: InventoryItem[], leads: Lead[]): DealerStats {
  const active = inventory.filter((item) => item.status === "active");
  const sold = inventory.filter((item) => item.status === "sold");

  const averageDaysToSell =
    sold.length === 0
      ? null
      : Math.round(sold.reduce((sum, item) => sum + item.daysListed, 0) / sold.length);

  return {
    activeCount: active.length,
    soldCount: sold.length,
    totalViews: inventory.reduce((sum, item) => sum + item.views, 0),
    totalInquiries: inventory.reduce((sum, item) => sum + item.inquiries, 0),
    averageDaysToSell,
    activeStockValue: active.reduce((sum, item) => sum + item.price, 0),
    soldListedValue: sold.reduce((sum, item) => sum + item.price, 0),
  };
}

/** Counts leads by stage, for the pipeline column headers and the funnel. */
export function countLeadsByStage(leads: Lead[]): Record<LeadStage, number> {
  const counts = Object.fromEntries(LEAD_STAGES.map((stage) => [stage.id, 0])) as Record<LeadStage, number>;
  for (const lead of leads) counts[lead.stage] += 1;
  return counts;
}

/** Rands, with the ZA grouping convention (space separator) from Intl. */
export function formatZAR(value: number): string {
  return `R ${value.toLocaleString(localeTag("en"))}`;
}
