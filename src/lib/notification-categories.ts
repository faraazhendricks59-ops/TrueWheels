import {
  AtSign,
  BellRing,
  Calendar,
  Gauge,
  Mail,
  Megaphone,
  MessageSquare,
  Shield,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { NotificationType } from "./notifications";

/**
 * The notification taxonomy.
 *
 * This is the single source of truth for what the platform can notify about, how
 * urgent each thing is, and how it is delivered by default. The preference store
 * (notification-preferences.ts) is built from it, and the delivery gate in
 * NotificationProvider consults it, so a category added here appears in Settings
 * and is honoured at send time without any further wiring.
 */

export type NotificationPriority = "critical" | "high" | "medium" | "low";

/** How a category is batched. `instant` delivers as it happens; the others queue. */
export type DigestMode = "instant" | "daily" | "weekly" | "off";

export type NotificationChannel = "push" | "email" | "sms";

export const NOTIFICATION_CHANNELS: NotificationChannel[] = ["push", "email", "sms"];

export interface NotificationSubcategory {
  id: string;
  label: string;
  description: string;
  /** Whether the subcategory starts switched on for a new account. */
  defaultEnabled: boolean;
  /** Which channels start on. SMS defaults off everywhere: it costs money per send. */
  channels: Record<NotificationChannel, boolean>;
  /**
   * The in-app notification type this maps to, when one exists. Used by the
   * delivery gate to decide whether a queued in-app notification belongs to this
   * subcategory. Subcategories without a mapping have no in-app source yet.
   */
  type?: NotificationType;
}

export interface NotificationCategory {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  priority: NotificationPriority;
  defaultDigest: DigestMode;
  subcategories: NotificationSubcategory[];
}

export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  {
    id: "marketplace",
    label: "Marketplace Activity",
    description: "Messages, price changes, and auctions on listings",
    icon: ShoppingBag,
    priority: "high",
    defaultDigest: "instant",
    subcategories: [
      {
        id: "new_messages",
        label: "New Messages",
        description: "When a buyer or seller writes to you about a listing",
        defaultEnabled: true,
        channels: { push: true, email: false, sms: false },
        type: "message",
      },
      {
        id: "price_drops",
        label: "Price Drops",
        description: "When the price falls on a vehicle you saved",
        defaultEnabled: true,
        channels: { push: true, email: true, sms: false },
        type: "saved_search",
      },
      {
        id: "new_listings",
        label: "New Listings",
        description: "When a new vehicle matches one of your saved searches",
        defaultEnabled: true,
        channels: { push: false, email: true, sms: false },
        type: "saved_search",
      },
      {
        id: "bid_updates",
        label: "Bid Updates",
        description: "When you are outbid, or when you win an auction",
        defaultEnabled: true,
        channels: { push: true, email: true, sms: false },
        type: "bid",
      },
    ],
  },
  {
    id: "social",
    label: "Social & Community",
    description: "Posts, replies, and followers",
    icon: Users,
    priority: "medium",
    defaultDigest: "daily",
    subcategories: [
      {
        id: "mentions",
        label: "Mentions",
        description: "When someone @mentions you in a post or comment",
        defaultEnabled: true,
        channels: { push: true, email: false, sms: false },
      },
      {
        id: "replies",
        label: "Replies to Your Posts",
        description: "When someone replies to something you posted",
        defaultEnabled: true,
        channels: { push: true, email: false, sms: false },
      },
      {
        id: "new_followers",
        label: "New Followers",
        description: "When another member follows you",
        defaultEnabled: true,
        channels: { push: false, email: true, sms: false },
      },
      {
        id: "group_activity",
        label: "Group Activity",
        description: "New posts in the groups you have joined",
        defaultEnabled: false,
        channels: { push: false, email: true, sms: false },
      },
    ],
  },
  {
    id: "events",
    label: "Events & Meets",
    description: "Track days, meets, and community events",
    icon: Calendar,
    priority: "medium",
    defaultDigest: "daily",
    subcategories: [
      {
        id: "event_reminders",
        label: "Event Reminders",
        description: "A day and an hour before events you are attending",
        defaultEnabled: true,
        channels: { push: true, email: true, sms: false },
        type: "event",
      },
      {
        id: "new_events",
        label: "New Events Nearby",
        description: "When an event is posted in your area",
        defaultEnabled: true,
        channels: { push: false, email: true, sms: false },
        type: "event",
      },
      {
        id: "rsvp_updates",
        label: "RSVP Updates",
        description: "When attendees change their RSVP for your event",
        defaultEnabled: false,
        channels: { push: false, email: false, sms: false },
      },
    ],
  },
  {
    id: "account",
    label: "Account & Security",
    description: "Sign-in alerts, verification, and security notices",
    icon: Shield,
    priority: "critical",
    defaultDigest: "instant",
    subcategories: [
      {
        id: "login_alerts",
        label: "New Sign-in Alerts",
        description: "When your account is accessed from a device we have not seen",
        defaultEnabled: true,
        channels: { push: true, email: true, sms: false },
      },
      {
        id: "verification",
        label: "Verification Updates",
        description: "When your identity or dealer status is reviewed",
        defaultEnabled: true,
        channels: { push: true, email: true, sms: false },
        type: "verification",
      },
      {
        id: "security",
        label: "Security Alerts",
        description: "Password changes, two-factor updates, and unusual activity",
        defaultEnabled: true,
        channels: { push: true, email: true, sms: false },
      },
    ],
  },
  {
    id: "ai",
    label: "AI Insights & Recommendations",
    description: "Market insights and suggestions from TrueWheels AI",
    icon: Sparkles,
    priority: "low",
    defaultDigest: "weekly",
    subcategories: [
      {
        id: "market_insights",
        label: "Market Insights",
        description: "Weekly market trends and valuation notes",
        defaultEnabled: true,
        channels: { push: false, email: true, sms: false },
        type: "ai",
      },
      {
        id: "recommendations",
        label: "Vehicle Recommendations",
        description: "Vehicles suggested from what you have browsed and saved",
        defaultEnabled: true,
        channels: { push: false, email: true, sms: false },
        type: "ai",
      },
      {
        id: "maintenance_reminders",
        label: "Maintenance Reminders",
        description: "Service and maintenance notes for vehicles in your garage",
        defaultEnabled: true,
        channels: { push: true, email: true, sms: false },
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing & Promotions",
    description: "Offers, the newsletter, and platform news",
    icon: Megaphone,
    priority: "low",
    defaultDigest: "weekly",
    subcategories: [
      {
        id: "promotions",
        label: "Special Offers",
        description: "Limited-time deals and promotions",
        // Off by default. An account should not have to switch marketing off.
        defaultEnabled: false,
        channels: { push: false, email: true, sms: false },
      },
      {
        id: "newsletter",
        label: "Weekly Newsletter",
        description: "Curated content and platform highlights",
        defaultEnabled: true,
        channels: { push: false, email: true, sms: false },
      },
      {
        id: "product_updates",
        label: "Product Updates",
        description: "New features and improvements to the platform",
        defaultEnabled: true,
        channels: { push: false, email: true, sms: false },
      },
    ],
  },
];

export const PRIORITY_CONFIG: Record<
  NotificationPriority,
  { label: string; description: string; color: string; bg: string; border: string }
> = {
  critical: {
    label: "Critical",
    description: "Security and account notices. Never batched, never silenced by default.",
    color: "text-semantic-error",
    bg: "bg-semantic-error/10",
    border: "border-semantic-error/30",
  },
  high: {
    label: "High",
    description: "Time-sensitive: messages and auctions that expire.",
    color: "text-brand",
    bg: "bg-brand/10",
    border: "border-brand/30",
  },
  medium: {
    label: "Medium",
    description: "Worth knowing soon, but not urgent. Good candidates for a digest.",
    color: "text-aurora-blue",
    bg: "bg-aurora-blue/10",
    border: "border-aurora-blue/30",
  },
  low: {
    label: "Low",
    description: "Informational. Batched by default so it never interrupts.",
    color: "text-ink-500 dark:text-ink-300",
    bg: "bg-ink-100 dark:bg-ink-800",
    border: "border-ink-200 dark:border-ink-700",
  },
};

export const DIGEST_CONFIG: Record<DigestMode, { label: string; description: string; icon: LucideIcon }> = {
  instant: {
    label: "Instant",
    description: "Sent as it happens",
    icon: BellRing,
  },
  daily: {
    label: "Daily",
    description: "One summary a day",
    icon: Gauge,
  },
  weekly: {
    label: "Weekly",
    description: "One summary a week",
    icon: Calendar,
  },
  off: {
    label: "Off",
    description: "Nothing sent",
    icon: BellRing,
  },
};

/** Channel metadata for the toggles and for decoding what a channel means. */
export const CHANNEL_CONFIG: Record<
  NotificationChannel,
  { label: string; description: string; icon: LucideIcon }
> = {
  push: {
    label: "Push",
    description: "An alert on your phone or desktop, as it happens",
    icon: Smartphone,
  },
  email: {
    label: "Email",
    description: "Sent to the email address on your account",
    icon: Mail,
  },
  sms: {
    label: "SMS",
    description: "A text message. Standard rates apply.",
    icon: MessageSquare,
  },
};

/**
 * Smart-exception kinds for Do Not Disturb. Each names a category that may pass
 * through the quiet window.
 *
 * The brief listed "favourites" as a third exception. There is no favourites feed
 * in this build and no per-notification favourite flag, so such a toggle could not
 * be evaluated — it would be a switch that does nothing. Auction and bid alerts
 * are evaluable (they are the `bid` notification type), so they take that slot.
 */
export const DND_EXCEPTIONS: {
  id: string;
  /** The notification category this exception lets through. */
  categoryId: string;
  label: string;
  description: string;
  icon: LucideIcon;
  priority: NotificationPriority;
}[] = [
  {
    id: "critical",
    categoryId: "account",
    label: "Critical security alerts",
    description: "Sign-in attempts, password changes, and unusual account activity",
    icon: Shield,
    priority: "critical",
  },
  {
    id: "mentions",
    categoryId: "social",
    label: "Mentions and replies",
    description: "When someone @mentions you or replies to something you posted",
    icon: AtSign,
    priority: "high",
  },
  {
    id: "bids",
    categoryId: "marketplace",
    label: "Auction and bid alerts",
    description: "When you are outbid, or when an auction you are watching ends",
    icon: Star,
    priority: "high",
  },
];

/** A few more icons referenced by the components, kept here so imports stay tidy. */
export const NOTIFICATION_ICONS = { Wrench, BellRing };
