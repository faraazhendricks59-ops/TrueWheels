import { Gavel, MessageSquare, Search, Calendar, ShieldCheck, Info, Sparkles, type LucideIcon } from "lucide-react";

export type NotificationType = "bid" | "message" | "saved_search" | "event" | "verification" | "system" | "ai";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  href: string;
  actionLabel?: string;
  /** Where the alert came from, shown so the user can judge how far to trust it. */
  provenance: string;
}

export interface NotificationTypeConfig {
  icon: LucideIcon;
  color: string;
  bg: string;
  label: string;
}

export const NOTIFICATION_CONFIG: Record<NotificationType, NotificationTypeConfig> = {
  bid: { icon: Gavel, color: "text-brand", bg: "bg-brand/10", label: "Auctions" },
  message: { icon: MessageSquare, color: "text-aurora-blue", bg: "bg-aurora-blue/10", label: "Messages" },
  saved_search: { icon: Search, color: "text-semantic-success", bg: "bg-semantic-success/10", label: "Saved Searches" },
  event: { icon: Calendar, color: "text-semantic-warning", bg: "bg-semantic-warning/10", label: "Events" },
  verification: { icon: ShieldCheck, color: "text-aurora-cyan", bg: "bg-aurora-cyan/10", label: "Verification" },
  system: { icon: Info, color: "text-ink-400", bg: "bg-ink-100 dark:bg-ink-800", label: "System" },
  ai: { icon: Sparkles, color: "text-aurora-purple", bg: "bg-aurora-purple/10", label: "AI Insights" },
};

export const NOTIFICATION_TYPES = Object.keys(NOTIFICATION_CONFIG) as NotificationType[];

/**
 * Targets point only at routes that exist in this build. The brief's hrefs
 * (/auctions/2, /messages/45, /vehicles/77, /events/kyalami, /dealer/profile)
 * are all unbuilt and would 404 from a notification, which is the worst place
 * to send someone.
 */
export const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "bid",
    title: "You were outbid",
    body: "BMW M3 Competition — new bid R 1,450,000",
    timestamp: Date.now() - 120_000,
    read: false,
    href: "/dashboard/bids",
    actionLabel: "Re-bid",
    provenance: "Auction Engine v2",
  },
  {
    id: "n2",
    type: "message",
    title: "Sarah J. replied",
    body: "\u201CCan we meet for a test drive on Saturday?\u201D",
    timestamp: Date.now() - 600_000,
    read: false,
    href: "/messages",
    actionLabel: "Reply",
    provenance: "Direct message",
  },
  {
    id: "n3",
    type: "saved_search",
    title: "New match found",
    body: "Golf 8 GTI under R 650 000 in Sandton",
    timestamp: Date.now() - 1_800_000,
    read: false,
    href: "/marketplace?q=Golf%208%20GTI",
    actionLabel: "View",
    provenance: "Saved search: GTI \u2264 R650k",
  },
  {
    id: "n4",
    type: "ai",
    title: "AI price alert",
    body: "Your listed Polo is 12% above market. Suggested price R 189 000.",
    timestamp: Date.now() - 3_600_000,
    read: true,
    href: "/dashboard/listings",
    actionLabel: "Adjust",
    provenance: "NVIDIA valuation model",
  },
  {
    id: "n5",
    type: "event",
    title: "Kyalami Track Day starts in 2h",
    body: "Your RSVP is at 07:00 — don't forget your helmet.",
    timestamp: Date.now() - 7_200_000,
    read: true,
    href: "/marketplace",
    provenance: "Event calendar",
  },
  {
    id: "n6",
    type: "verification",
    title: "Dealer application approved",
    body: "Prestige Motors SA is now a verified dealer.",
    timestamp: Date.now() - 86_400_000,
    read: true,
    href: "/dashboard/settings",
    provenance: "Admin verification queue",
  },
];

/** Categories a preference row exists for. Mirrors the notification types. */
export function isNotificationType(value: string): value is NotificationType {
  return (NOTIFICATION_TYPES as string[]).includes(value);
}
