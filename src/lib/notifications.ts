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
/**
 * The notification centre used to open with six invented events, each carrying a
 * provenance line naming the system that produced it: "Auction Engine v2" for an
 * outbid notice, "NVIDIA valuation model" for a price alert, "Event calendar" for
 * a track day, and a "Direct message" from a person who had not written. One told
 * the reader their Polo was 12% above market at a suggested R 189 000.
 *
 * None of those systems exist in this project, so the provenance lines were the
 * most misleading part: they asserted a source, which is what makes a claim look
 * checkable. With no source of real notifications, the list starts empty and the
 * centre says so.
 */
export const SEED_NOTIFICATIONS: Notification[] = [];

/** Categories a preference row exists for. Mirrors the notification types. */
export function isNotificationType(value: string): value is NotificationType {
  return (NOTIFICATION_TYPES as string[]).includes(value);
}
