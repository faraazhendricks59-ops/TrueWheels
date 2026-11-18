import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Car,
  CheckCircle2,
  Clock,
  Eye,
  FileSearch,
  Gauge,
  Gavel,
  Heart,
  MapPin,
  MessageSquare,
  Scale,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";

/**
 * Size scale for icons, so call sites stop passing magic numbers.
 *
 *   xs (12) — inline beside caption text, inside a badge
 *   sm (14) — a button label, a dense table row
 *   md (16) — the default: most buttons and inline controls
 *   lg (18) — the header action row, a prominent control
 *   xl (20) — a card heading, a standalone affordance
 *   hero (24) — an empty state, a feature panel
 */
export const ICON_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  hero: 24,
} as const;

export type IconSizeToken = keyof typeof ICON_SIZE;

/**
 * Semantic registry: the glyph for a domain concept, named once.
 *
 * Call sites keep importing the glyph they want from lucide-react for one-off
 * decoration — that is fine and there is no need to route every icon through
 * here. This exists so the concepts that repeat across the app (a "verified"
 * tick, a "saved" heart, a mileage gauge) resolve to one glyph, and swapping a
 * glyph for the whole product is a one-line change instead of a hunt.
 */
export const ICONS: Record<
  | "bid"
  | "clock"
  | "community"
  | "history"
  | "inspection"
  | "message"
  | "mileage"
  | "price"
  | "saved"
  | "savedEmpty"
  | "search"
  | "service"
  | "trend"
  | "vehicle"
  | "verified"
  | "viewed"
  | "watch"
  | "ai",
  LucideIcon
> = {
  ai: Sparkles,
  bid: Gavel,
  clock: Clock,
  community: Users,
  history: FileSearch,
  inspection: Wrench,
  message: MessageSquare,
  mileage: Gauge,
  price: Tag,
  saved: Heart,
  savedEmpty: Heart,
  search: FileSearch,
  service: Wrench,
  trend: TrendingUp,
  vehicle: Car,
  verified: ShieldCheck,
  viewed: Eye,
  watch: Bell,
};

/** Concepts that have a "positive" counterpart, for the confirm tick. */
export const ICON_CONFIRM = CheckCircle2;
export const ICON_LOCATION = MapPin;
export const ICON_COMPARE = Scale;
