import type { LucideIcon } from "lucide-react";
import { Car, Wrench, Store, Users, Calendar, FileText, Gift } from "lucide-react";

export interface CommandResult {
  id: string;
  group: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  href: string;
  /** Extra terms that should match this result but aren't displayed. */
  keywords?: string;
}

/** Mock unified search index across every entity type on the platform. */
export const SEARCH_INDEX: CommandResult[] = [
  { id: "v1", group: "Vehicles", title: "2021 Volkswagen Golf 8 GTI", subtitle: "R 649,000 • Sandton", icon: Car, href: "/vehicles/1", keywords: "vw gti hatch" },
  { id: "v2", group: "Vehicles", title: "2022 BMW M3 Competition", subtitle: "R 1,450,000 • Umhlanga", icon: Car, href: "/vehicles/2", keywords: "bimmer sedan" },
  { id: "v3", group: "Vehicles", title: "2019 Ford Ranger Raptor", subtitle: "R 785,000 • Cape Town", icon: Car, href: "/vehicles/3", keywords: "bakkie 4x4" },
  { id: "p1", group: "Parts", title: "Golf 7 GTI Turbocharger (IS20)", subtitle: "R 8,500 • Pretoria VW Spares", icon: Wrench, href: "/parts/p1", keywords: "turbo is20" },
  { id: "p2", group: "Parts", title: "Brembo Brake Set — Hilux 2.8", subtitle: "R 3,250 • BrakeTech SA", icon: Wrench, href: "/parts/p2", keywords: "brakes pads discs" },
  { id: "d1", group: "Dealers", title: "Prestige Motors SA", subtitle: "Verified Dealer • Sandton", icon: Store, href: "/dealers/prestige-motors-sa", keywords: "dealer showroom" },
  { id: "u1", group: "People", title: "Marcus Drifts", subtitle: "@marcusdrifts • Cape Town", icon: Users, href: "/user/marcusdrifts", keywords: "profile member" },
  { id: "e1", group: "Events", title: "Kyalami Track Day — November", subtitle: "21 Nov • Midrand", icon: Calendar, href: "/events", keywords: "trackday motorsport" },
  { id: "pg1", group: "Pages", title: "My Dashboard", subtitle: "Manage your listings", icon: FileText, href: "/dashboard", keywords: "account listings" },
  { id: "pg2", group: "Pages", title: "Saved Searches", subtitle: "Your alerts", icon: FileText, href: "/saved-searches", keywords: "alerts notifications" },
  { id: "pg3", group: "Pages", title: "Refer & Earn", subtitle: "Invite friends, earn credits", icon: Gift, href: "/referrals", keywords: "referral invite rewards credits share" },
];

/** Results shown when the query is empty. */
export const DEFAULT_RESULTS = SEARCH_INDEX.slice(0, 6);

export function searchCommands(query: string): CommandResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return DEFAULT_RESULTS;

  return SEARCH_INDEX.filter((r) =>
    [r.title, r.subtitle, r.group, r.keywords]
      .filter((field): field is string => Boolean(field))
      .some((field) => field.toLowerCase().includes(q)),
  );
}
