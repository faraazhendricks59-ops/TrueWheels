import type { Locale } from "./locale";

export type { Locale };
export { DEFAULT_LOCALE, LOCALES as SUPPORTED_LOCALE_CODES, localeTag } from "./locale";

export interface LocaleOption {
  code: Locale;
  label: string;
  /** Endonym plus English name, so speakers recognise their own language. */
  english: string;
}

export const SUPPORTED_LOCALES: LocaleOption[] = [
  { code: "en", label: "English", english: "English" },
  { code: "af", label: "Afrikaans", english: "Afrikaans" },
  { code: "zu", label: "isiZulu", english: "Zulu" },
];

/**
 * Flat, dot-namespaced keys. The en dictionary is the source of truth: every
 * other locale is typed as Record<TranslationKey, string>, so a missing or
 * misspelled key is a build error rather than a silent fallback to the key.
 */
export type TranslationKey =
  | "nav.marketplace"
  | "nav.auctions"
  | "nav.community"
  | "nav.parts"
  | "nav.list_vehicle"
  | "nav.home"
  | "nav.messages"
  | "nav.profile"
  | "nav.garage"
  | "action.search"
  | "action.save"
  | "action.share"
  | "action.cancel"
  | "action.confirm"
  | "action.close"
  | "marketplace.title"
  | "marketplace.results_found"
  | "marketplace.price"
  | "marketplace.mileage"
  | "marketplace.year"
  | "marketplace.bakkies"
  | "marketplace.near_me"
  | "marketplace.search_placeholder"
  | "marketplace.no_results"
  | "marketplace.no_results_body"
  | "marketplace.clear_filters"
  | "auth.welcome"
  | "auth.sign_in"
  | "auth.sign_out"
  | "onboarding.intent_title"
  | "a11y.skip_to_content"
  | "a11y.change_language"
  | "a11y.theme_toggle"
  | "theme.light"
  | "theme.dark"
  | "theme.system"
  | "vdp.sections_nav"
  | "vdp.section_gallery"
  | "vdp.section_overview"
  | "vdp.section_specs"
  | "vdp.section_finance"
  | "vdp.section_seller";

const en: Record<TranslationKey, string> = {
  "nav.marketplace": "Marketplace",
  "nav.auctions": "Auctions",
  "nav.community": "Community",
  "nav.parts": "Parts & Spares",
  "nav.list_vehicle": "List Vehicle",
  "nav.home": "Home",
  "nav.messages": "Messages",
  "nav.profile": "Profile",
  "nav.garage": "Garage",
  "action.search": "Search",
  "action.save": "Save",
  "action.share": "Share",
  "action.cancel": "Cancel",
  "action.confirm": "Confirm",
  "action.close": "Close",
  "marketplace.title": "Marketplace",
  "marketplace.results_found": "vehicles found",
  "marketplace.price": "Price",
  "marketplace.mileage": "Mileage",
  "marketplace.year": "Year",
  "marketplace.bakkies": "Bakkies",
  "marketplace.near_me": "Near me",
  "marketplace.search_placeholder": "Search listings",
  "marketplace.no_results": "No vehicles found",
  "marketplace.no_results_body":
    "Try adjusting your filters or search terms to find what you're looking for.",
  "marketplace.clear_filters": "Clear Filters",
  "auth.welcome": "Welcome to TrueWheels",
  "auth.sign_in": "Sign In",
  "auth.sign_out": "Sign Out",
  "onboarding.intent_title": "How will you use TrueWheels?",
  "a11y.skip_to_content": "Skip to main content",
  "a11y.change_language": "Change language",
  "a11y.theme_toggle": "Change theme",
  "theme.light": "Light",
  "theme.dark": "Dark",
  "theme.system": "System",
  "vdp.sections_nav": "Sections of this listing",
  "vdp.section_gallery": "Gallery",
  "vdp.section_overview": "Overview",
  "vdp.section_specs": "Specs & history",
  "vdp.section_finance": "Costs",
  "vdp.section_seller": "Seller",
};

const af: Record<TranslationKey, string> = {
  "nav.marketplace": "Markplek",
  "nav.auctions": "Veilings",
  "nav.community": "Gemeenskap",
  "nav.parts": "Onderdele",
  "nav.list_vehicle": "Lys Voertuig",
  "nav.home": "Tuis",
  "nav.messages": "Boodskappe",
  "nav.profile": "Profiel",
  "nav.garage": "Motorhuis",
  "action.search": "Soek",
  "action.save": "Stoor",
  "action.share": "Deel",
  "action.cancel": "Kanselleer",
  "action.confirm": "Bevestig",
  "action.close": "Sluit",
  "marketplace.title": "Markplek",
  "marketplace.results_found": "voertuie gevind",
  "marketplace.price": "Prys",
  "marketplace.mileage": "Kilometers",
  "marketplace.year": "Jaar",
  "marketplace.bakkies": "Bakkies",
  "marketplace.near_me": "Naby my",
  "marketplace.search_placeholder": "Soek lyste",
  "marketplace.no_results": "Geen voertuie gevind nie",
  "marketplace.no_results_body":
    "Probeer jou filters of soekterme aanpas om te vind waarna jy soek.",
  "marketplace.clear_filters": "Vee Filters Uit",
  "auth.welcome": "Welkom by TrueWheels",
  "auth.sign_in": "Teken In",
  "auth.sign_out": "Teken Uit",
  "onboarding.intent_title": "Hoe sal jy TrueWheels gebruik?",
  "a11y.skip_to_content": "Slaan oor na hoofinhoud",
  "a11y.change_language": "Verander taal",
  "a11y.theme_toggle": "Verander tema",
  "theme.light": "Lig",
  "theme.dark": "Donker",
  "theme.system": "Stelsel",
  "vdp.sections_nav": "Afdelings van hierdie advertensie",
  "vdp.section_gallery": "Galery",
  "vdp.section_overview": "Oorsig",
  "vdp.section_specs": "Spesifikasies en geskiedenis",
  "vdp.section_finance": "Koste",
  "vdp.section_seller": "Verkoper",
};

const zu: Record<TranslationKey, string> = {
  "nav.marketplace": "Imakethe",
  "nav.auctions": "Imishini",
  "nav.community": "Umphakathi",
  "nav.parts": "Izingxenye",
  "nav.list_vehicle": "Faka Imoto",
  "nav.home": "Ikhaya",
  "nav.messages": "Imilayezo",
  "nav.profile": "Iphrofayela",
  "nav.garage": "Igalaji",
  "action.search": "Sesha",
  "action.save": "Gcina",
  "action.share": "Yabelana",
  "action.cancel": "Khansela",
  "action.confirm": "Qinisekisa",
  "action.close": "Vala",
  "marketplace.title": "Imakethe",
  "marketplace.results_found": "izimoto ezitholiwe",
  "marketplace.price": "Intengo",
  "marketplace.mileage": "Amakhilomitha",
  "marketplace.year": "Unyaka",
  "marketplace.bakkies": "Amabakkie",
  "marketplace.near_me": "Kuseduze nami",
  "marketplace.search_placeholder": "Sesha izintengo",
  "marketplace.no_results": "Azikho izimoto ezitholakele",
  "marketplace.no_results_body":
    "Zama ukushintsha izihlungi noma amagama okusesha ukuze uthole lokho okufunayo.",
  "marketplace.clear_filters": "Susa Izihlungi",
  "auth.welcome": "Siyakwamukela ku-TrueWheels",
  "auth.sign_in": "Ngena ngemvume",
  "auth.sign_out": "Phuma",
  "onboarding.intent_title": "Uzoyisebenzisa kanjani i-TrueWheels?",
  "a11y.skip_to_content": "Yeqa uye kokuqukethwe okuyinhloko",
  "a11y.change_language": "Shintsha ulimi",
  "a11y.theme_toggle": "Shintsha itimu",
  "theme.light": "Ukukhanya",
  "theme.dark": "Ubumnyama",
  "theme.system": "Uhlelo",
  "vdp.sections_nav": "Izigaba zalesi saziso",
  "vdp.section_gallery": "Igalari",
  "vdp.section_overview": "Uhlolojikelele",
  "vdp.section_specs": "Izicaciso nomlando",
  "vdp.section_finance": "Izindleko",
  "vdp.section_seller": "Umdayisi",
};

export const dictionaries: Record<Locale, Record<TranslationKey, string>> = { en, af, zu };
