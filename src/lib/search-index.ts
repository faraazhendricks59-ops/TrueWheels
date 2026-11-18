import {
  Bell,
  Car,
  Scale,
  Wrench,
  Store,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  User,
  type LucideIcon,
} from "lucide-react";
import { DEMO_VEHICLES } from "@/lib/demo/vehicles";
import { localeTag } from "@/lib/i18n/locale";

export type EntityType = "page" | "vehicle" | "part" | "dealer" | "person" | "event";

export interface SearchItem {
  id: string;
  type: EntityType;
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  /** Right-aligned value, e.g. price or date. */
  meta?: string;
}

/**
 * The only search surface that exists today is the marketplace, so every
 * entity resolves to it with a query. Dedicated detail routes (/vehicles/[id],
 * /dealers/[slug], ...) arrive in later phases; pointing at them now would make
 * every result a 404.
 */
const marketplaceQuery = (q: string) => `/marketplace?q=${encodeURIComponent(q)}`;

const PAGES: SearchItem[] = [
  { id: "page-marketplace", type: "page", title: "Marketplace", subtitle: "Browse all listings", href: "/marketplace", icon: Car },
  { id: "page-sell", type: "page", title: "List a vehicle", subtitle: "Sell your car", href: "/#list", icon: FileText },
  { id: "page-messages", type: "page", title: "Messages", subtitle: "Your conversations", href: "/messages", icon: MessageSquare },
  { id: "page-garage", type: "page", title: "Digital garage", subtitle: "Your vehicles, journals and service logs", href: "/garage", icon: Car },
  { id: "page-profile", type: "page", title: "Profile", subtitle: "Account and verification", href: "/profile", icon: User },
  { id: "page-saved-searches", type: "page", title: "Saved searches", subtitle: "Your alerts and matches", href: "/saved-searches", icon: Bell },
  { id: "page-compare", type: "page", title: "Compare vehicles", subtitle: "Side-by-side specs", href: "/compare", icon: Scale },
];

const vehicleItems = (): SearchItem[] =>
  DEMO_VEHICLES.slice(0, 40).map((vehicle) => ({
    id: `vehicle-${vehicle.id}`,
    type: "vehicle",
    title: vehicle.title,
    subtitle: `${vehicle.location} · ${vehicle.mileage.toLocaleString(localeTag("en"))} km`,
    href: marketplaceQuery(vehicle.title),
    icon: Car,
    meta: `R ${vehicle.price.toLocaleString(localeTag("en"))}`,
  }));

const PARTS: SearchItem[] = [
  { id: "part-is20", type: "part", title: "Golf 7 GTI Turbocharger (IS20)", subtitle: "Pretoria VW Spares", href: marketplaceQuery("Golf 7 GTI turbocharger"), icon: Wrench, meta: "R 8 500" },
  { id: "part-brembo", type: "part", title: "Brembo Brake Set — Hilux 2.8", subtitle: "BrakeTech SA", href: marketplaceQuery("Brembo Hilux brakes"), icon: Wrench, meta: "R 3 250" },
];

// "Prestige Motors SA — Verified dealer · Sandton" was here. No such dealer
// exists and no dealership has been verified, so searching for one returned a
// fabricated company presented as a vetted trading partner.
const DEALERS: SearchItem[] = [];

const PEOPLE: SearchItem[] = [
  { id: "person-marcus", type: "person", title: "Marcus Drifts", subtitle: "@marcusdrifts · Cape Town", href: marketplaceQuery("Marcus Drifts"), icon: Users },
];

const EVENTS: SearchItem[] = [
  { id: "event-kyalami", type: "event", title: "Kyalami Track Day — November", subtitle: "21 Nov · Midrand", href: marketplaceQuery("Kyalami track day"), icon: Calendar, meta: "R 1 250" },
];

export const SEARCH_INDEX: SearchItem[] = [
  ...PAGES,
  ...vehicleItems(),
  ...PARTS,
  ...DEALERS,
  ...PEOPLE,
  ...EVENTS,
];

/** Render order of the result groups; also the order the keyboard walks them. */
export const ENTITY_GROUPS: { type: EntityType; label: string }[] = [
  { type: "page", label: "Pages" },
  { type: "vehicle", label: "Vehicles" },
  { type: "part", label: "Parts" },
  { type: "dealer", label: "Dealers" },
  { type: "person", label: "People" },
  { type: "event", label: "Events" },
];

export function searchItems(query: string, limit = 6): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return PAGES.slice(0, 4);

  const matched = SEARCH_INDEX.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      (item.meta?.toLowerCase().includes(q) ?? false)
  );

  // Cap each group so one large category cannot crowd out the others.
  const perType = new Map<EntityType, number>();
  return matched.filter((item) => {
    const count = perType.get(item.type) ?? 0;
    if (count >= limit) return false;
    perType.set(item.type, count + 1);
    return true;
  });
}

/**
 * Conversational filler that carries no matching signal. Stripping it lets an
 * AI-mode question like "how much is a golf gti" still reach the index, which
 * matches on substrings and would otherwise return nothing for the full phrase.
 */
const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "am", "do", "does", "did",
  "how", "much", "what", "which", "who", "when", "where", "why", "best", "good",
  "of", "for", "to", "in", "on", "at", "near", "me", "my", "i", "we", "you",
  "want", "need", "looking", "show", "find", "give", "tell", "about", "please",
  "cost", "costs", "worth", "value", "price", "prices", "car", "cars",
  "vehicle", "vehicles", "buy", "buying", "sell", "selling", "and", "or",
]);

/** Drops filler words, keeping the terms that actually name something. */
export function extractKeywords(query: string): string {
  const words = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const kept = words.filter((word) => !STOPWORDS.has(word));
  return (kept.length > 0 ? kept : words).join(" ");
}

export function groupItems(items: SearchItem[]): { type: EntityType; label: string; items: SearchItem[] }[] {
  return ENTITY_GROUPS.map((group) => ({
    ...group,
    items: items.filter((item) => item.type === group.type),
  })).filter((group) => group.items.length > 0);
}
