export type Locale = "en" | "af" | "zu";

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "af", label: "Afrikaans", flag: "🇿🇦" },
  { code: "zu", label: "isiZulu", flag: "🇿🇦" },
];

// English is the source of truth: its keys define TranslationKey, and every
// other locale is typed against it so a missing/typo'd key fails the build
// rather than silently rendering the raw key at runtime.
const en = {
  // Navigation
  "nav.marketplace": "Marketplace",
  "nav.auctions": "Auctions",
  "nav.community": "Community",
  "nav.dealers": "Dealers",
  "nav.parts": "Parts",
  "nav.events": "Events",
  "nav.listVehicle": "List Vehicle",
  "nav.home": "Home",
  "nav.search": "Search",
  "nav.messages": "Messages",
  "nav.profile": "Profile",
  "nav.sell": "Sell",

  // Common actions
  "action.search": "Search",
  "action.save": "Save",
  "action.share": "Share",
  "action.viewAll": "View all",
  "action.loadMore": "Load more",
  "action.back": "Back",
  "action.next": "Next",
  "action.cancel": "Cancel",
  "action.submit": "Submit",

  // Marketplace
  "marketplace.title": "Marketplace",
  "marketplace.subtitle": "Browse trusted vehicles from verified sellers.",
  "marketplace.results": "vehicles found",
  "marketplace.price": "Price",
  "marketplace.mileage": "Mileage",
  "marketplace.year": "Year",
  "marketplace.emptyTitle": "No vehicles found",
  "marketplace.emptyDescription":
    "Try adjusting your filters or check back soon — new listings are added every day.",
  "marketplace.clearFilters": "Clear filters",

  // Home
  "home.eyebrow": "South Africa's digital garage",
  "home.title": "The Automotive Operating System.",
  "home.subtitle": "A modern, trusted ecosystem to discover, buy, sell, and own vehicles with confidence.",
  "home.explore": "Explore vehicles",
  "home.listVehicle": "List your vehicle",
  "home.pillar.discover": "Discover",
  "home.pillar.discoverText": "Find the right vehicle with structured, trusted data.",
  "home.pillar.buySell": "Buy & Sell",
  "home.pillar.buySellText": "Connect through safer listings and transparent tools.",
  "home.pillar.own": "Own",
  "home.pillar.ownText": "Build your digital garage and manage the full lifecycle.",

  // Onboarding
  "onboarding.title": "The Automotive Operating System",
  "onboarding.subtitle":
    "Discover, buy, sell, and bid on South Africa's most trusted vehicle ecosystem.",
  "onboarding.enter": "Enter TrueWheels",

  // Language switcher
  "language.change": "Change language",
} as const;

export type TranslationKey = keyof typeof en;

/** Every locale must define every key — enforced by the type. */
export type Dictionary = Record<TranslationKey, string>;

const af: Dictionary = {
  // Navigation
  "nav.marketplace": "Markplek",
  "nav.auctions": "Veilings",
  "nav.community": "Gemeenskap",
  "nav.dealers": "Handelaars",
  "nav.parts": "Onderdele",
  "nav.events": "Gebeurtenisse",
  "nav.listVehicle": "Lys Voertuig",
  "nav.home": "Tuis",
  "nav.search": "Soek",
  "nav.messages": "Boodskappe",
  "nav.profile": "Profiel",
  "nav.sell": "Verkoop",

  // Common actions
  "action.search": "Soek",
  "action.save": "Stoor",
  "action.share": "Deel",
  "action.viewAll": "Sien alles",
  "action.loadMore": "Laai meer",
  "action.back": "Terug",
  "action.next": "Volgende",
  "action.cancel": "Kanselleer",
  "action.submit": "Dien in",

  // Marketplace
  "marketplace.title": "Markplek",
  "marketplace.subtitle": "Blaai deur betroubare voertuie van geverifieerde verkopers.",
  "marketplace.results": "voertuie gevind",
  "marketplace.price": "Prys",
  "marketplace.mileage": "Kilometers",
  "marketplace.year": "Jaar",
  "marketplace.emptyTitle": "Geen voertuie gevind nie",
  "marketplace.emptyDescription":
    "Probeer jou filters aanpas of kyk binnekort weer — nuwe inskrywings word daagliks bygevoeg.",
  "marketplace.clearFilters": "Vee filters uit",

  // Home
  "home.eyebrow": "Suid-Afrika se digitale motorhuis",
  "home.title": "Die Motorbedryfstelsel.",
  "home.subtitle":
    "Ontdek, koop, verkoop en besit voertuie met vertroue in 'n moderne, betroubare ekosisteem.",
  "home.explore": "Verken voertuie",
  "home.listVehicle": "Lys jou voertuig",
  "home.pillar.discover": "Ontdek",
  "home.pillar.discoverText": "Vind die regte voertuig met gestruktureerde, betroubare data.",
  "home.pillar.buySell": "Koop & Verkoop",
  "home.pillar.buySellText": "Verbind deur veiliger inskrywings en deursigtige gereedskap.",
  "home.pillar.own": "Besit",
  "home.pillar.ownText": "Bou jou digitale motorhuis en bestuur die volle lewensiklus.",

  // Onboarding
  "onboarding.title": "Die Motorbedryfstelsel",
  "onboarding.subtitle":
    "Ontdek, koop, verkoop en bie op Suid-Afrika se mees betroubare voertuigekosisteem.",
  "onboarding.enter": "Betree TrueWheels",

  // Language switcher
  "language.change": "Verander taal",
};

const zu: Dictionary = {
  // Navigation
  "nav.marketplace": "Imakethe",
  "nav.auctions": "Ama-Auction",
  "nav.community": "Umphakathi",
  "nav.dealers": "Abadayisi",
  "nav.parts": "Izingxenye",
  "nav.events": "Imicimbi",
  "nav.listVehicle": "Faka Imoto",
  "nav.home": "Ikhaya",
  "nav.search": "Sesha",
  "nav.messages": "Imilayezo",
  "nav.profile": "Iphrofayela",
  "nav.sell": "Dayisa",

  // Common actions
  "action.search": "Sesha",
  "action.save": "Gcina",
  "action.share": "Yabelana",
  "action.viewAll": "Buka konke",
  "action.loadMore": "Layisha okuningi",
  "action.back": "Emuva",
  "action.next": "Okulandelayo",
  "action.cancel": "Khansela",
  "action.submit": "Thumela",

  // Marketplace
  "marketplace.title": "Imakethe",
  "marketplace.subtitle": "Phequlula izimoto ezithenjwayo ezivela kubathengisi abaqinisekisiwe.",
  "marketplace.results": "izimoto ezitholiwe",
  "marketplace.price": "Intengo",
  "marketplace.mileage": "Amakhilomitha",
  "marketplace.year": "Unyaka",
  "marketplace.emptyTitle": "Azikho izimoto ezitholakele",
  "marketplace.emptyDescription":
    "Zama ukulungisa izihlungi zakho noma uphinde uhlole maduze — ukufakwa okusha kungezwa nsuku zonke.",
  "marketplace.clearFilters": "Susa izihlungi",

  // Home
  "home.eyebrow": "Igalaji ledijithali laseNingizimu Afrika",
  "home.title": "Uhlelo Lokusebenza Lwezimoto.",
  "home.subtitle":
    "Thola, thenga, dayisa futhi ube ngumnikazi wezimoto ngokuzethemba ku-ecosystem yesimanje ethembekile.",
  "home.explore": "Hlola izimoto",
  "home.listVehicle": "Faka imoto yakho",
  "home.pillar.discover": "Thola",
  "home.pillar.discoverText": "Thola imoto efanele ngedatha ehlelekile, ethembekile.",
  "home.pillar.buySell": "Thenga & Dayisa",
  "home.pillar.buySellText": "Xhumana ngezikhangiso eziphephile namathuluzi asobala.",
  "home.pillar.own": "Ube ngumnikazi",
  "home.pillar.ownText": "Akha igalaji lakho ledijithali futhi uphathe umjikelezo ogcwele.",

  // Onboarding
  "onboarding.title": "Uhlelo Lokusebenza Lwezimoto",
  "onboarding.subtitle":
    "Thola, thenga, dayisa, futhi ubeke ama-bid ku-ecosystem yezimoto ethembekile yaseNingizimu Afrika.",
  "onboarding.enter": "Ngena ku-TrueWheels",

  // Language switcher
  "language.change": "Shintsha ulimi",
};

export const dictionaries: Record<Locale, Dictionary> = { en, af, zu };

export const LOCALE_CODES = LOCALES.map((l) => l.code);

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALE_CODES as string[]).includes(value);
}

/**
 * Match a BCP-47 tag (e.g. "af-ZA", "zu") to a supported locale.
 * Pure and framework-free so it can be unit-tested and reused server-side.
 */
export function matchLocale(tag: string | undefined | null): Locale {
  if (!tag) return DEFAULT_LOCALE;
  const base = tag.toLowerCase().split("-")[0];
  return isLocale(base) ? base : DEFAULT_LOCALE;
}
