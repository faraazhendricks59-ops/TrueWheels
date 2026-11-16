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

  // Cookie consent
  "cookie.title": "We value your privacy",
  "cookie.description":
    "We use cookies to make TrueWheels work, understand usage, and personalise your experience. Only essential cookies are required — you choose the rest.",
  "cookie.policyLink": "Read our Cookie Policy",
  "cookie.essential": "Essential",
  "cookie.essentialDesc": "Required for the platform to function",
  "cookie.analytics": "Analytics",
  "cookie.analyticsDesc": "Help us understand usage",
  "cookie.marketing": "Marketing",
  "cookie.marketingDesc": "Personalised advertising",
  "cookie.acceptAll": "Accept All",
  "cookie.rejectNonEssential": "Reject Non-Essential",
  "cookie.managePreferences": "Manage Preferences",
  "cookie.saveChoices": "Save My Choices",

  // Footer
  "footer.tagline": "South Africa's trusted marketplace for buying, selling, and owning vehicles.",
  "footer.explore": "Explore",
  "footer.legal": "Legal",
  "footer.contact": "Contact",
  "footer.terms": "Terms of Service",
  "footer.privacy": "Privacy Policy",
  "footer.cookies": "Cookie Policy",
  "footer.popia": "POPIA Statement",
  "footer.manageCookies": "Manage cookies",
  "footer.rights": "All rights reserved.",
  "footer.regulator": "Regulated in terms of POPIA and the CPA.",

  // Referrals
  "referral.heroTitle": "Refer & Earn",
  "referral.heroBody": "Invite your friends to TrueWheels. When they sign up and list their first car, you both earn {amount} in listing credits.",
  "referral.invitesSent": "Invites Sent",
  "referral.friendsJoined": "Friends Joined",
  "referral.creditsEarned": "Credits Earned",
  "referral.pendingCredits": "You have {amount} in pending credits — these pay out once your friends list their first vehicle.",
  "referral.howItWorks": "How it works",
  "referral.step1Title": "Share your link",
  "referral.step1Desc": "Send it via WhatsApp, SMS, or email.",
  "referral.step2Title": "They join & list",
  "referral.step2Desc": "Your friend signs up and lists their first car.",
  "referral.step3Title": "You both earn",
  "referral.step3Desc": "You each get R 100 in listing credits.",
  "referral.inviteFriends": "Invite Friends",
  "referral.rewardsTitle": "Rewards Progress",
  "referral.referralsCount": "{count} referrals",
  "referral.tierThreshold": "{count}+ referrals",
  "referral.unlocked": "Unlocked",
  "referral.moreNeeded": "{count} more needed",
  "referral.nextTierHint": "{count} more referrals to reach {tier}.",
  "referral.tier.bronze.reward": "Welcome bonus",
  "referral.tier.silver.reward": "R 150 credit",
  "referral.tier.gold.reward": "R 300 credit + 1 free boost",
  "referral.tier.platinum.reward": "R 750 credit + Pro trial",
  "referral.shareTitle": "Invite a Friend",
  "referral.shareOn": "Share on",
  "referral.whatsapp": "WhatsApp",
  "referral.sms": "SMS",
  "referral.email": "Email",
  "referral.emailSubject": "Join me on TrueWheels",
  "referral.copyLink": "Copy Link",
  "referral.linkCopied": "Link Copied",
  "referral.messagePreview": "Message preview",
  "referral.shareMessage": "Join me on TrueWheels — the best place to buy and sell cars in South Africa! Use my link to get started: {link}",
  "referral.close": "Close",
  "footer.referrals": "Refer & Earn",
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

  // Cookie consent
  "cookie.title": "Ons gee om vir jou privaatheid",
  "cookie.description":
    "Ons gebruik koekies om TrueWheels te laat werk, gebruik te verstaan en jou ervaring te personaliseer. Slegs noodsaaklike koekies is verpligtend — jy kies die res.",
  "cookie.policyLink": "Lees ons Koekiebeleid",
  "cookie.essential": "Noodsaaklik",
  "cookie.essentialDesc": "Vereis vir die platform om te werk",
  "cookie.analytics": "Analise",
  "cookie.analyticsDesc": "Help ons gebruik verstaan",
  "cookie.marketing": "Bemarking",
  "cookie.marketingDesc": "Gepersonaliseerde advertensies",
  "cookie.acceptAll": "Aanvaar Alles",
  "cookie.rejectNonEssential": "Weier Nie-Noodsaaklik",
  "cookie.managePreferences": "Bestuur Voorkeure",
  "cookie.saveChoices": "Stoor My Keuses",

  // Footer
  "footer.tagline": "Suid-Afrika se betroubare markplek om voertuie te koop, verkoop en besit.",
  "footer.explore": "Verken",
  "footer.legal": "Regtens",
  "footer.contact": "Kontak",
  "footer.terms": "Diensvoorwaardes",
  "footer.privacy": "Privaatheidsbeleid",
  "footer.cookies": "Koekiebeleid",
  "footer.popia": "POPIA-verklaring",
  "footer.manageCookies": "Bestuur koekies",
  "footer.rights": "Alle regte voorbehou.",
  "footer.regulator": "Gereguleer ingevolge POPIA en die CPA.",

  // Referrals
  "referral.heroTitle": "Verwys & Verdien",
  "referral.heroBody": "Nooi jou vriende na TrueWheels. Wanneer hulle registreer en hul eerste motor lys, verdien julle albei {amount} in lys-krediete.",
  "referral.invitesSent": "Uitnodigings Gestuur",
  "referral.friendsJoined": "Vriende Aangesluit",
  "referral.creditsEarned": "Krediete Verdien",
  "referral.pendingCredits": "Jy het {amount} in hangende krediete — dit betaal uit sodra jou vriende hul eerste voertuig lys.",
  "referral.howItWorks": "Hoe dit werk",
  "referral.step1Title": "Deel jou skakel",
  "referral.step1Desc": "Stuur dit per WhatsApp, SMS of e-pos.",
  "referral.step2Title": "Hulle sluit aan & lys",
  "referral.step2Desc": "Jou vriend registreer en lys hul eerste motor.",
  "referral.step3Title": "Julle verdien albei",
  "referral.step3Desc": "Julle kry elkeen R 100 in lys-krediete.",
  "referral.inviteFriends": "Nooi Vriende",
  "referral.rewardsTitle": "Beloningsvordering",
  "referral.referralsCount": "{count} verwysings",
  "referral.tierThreshold": "{count}+ verwysings",
  "referral.unlocked": "Ontsluit",
  "referral.moreNeeded": "Nog {count} nodig",
  "referral.nextTierHint": "Nog {count} verwysings om {tier} te bereik.",
  "referral.tier.bronze.reward": "Welkomebonus",
  "referral.tier.silver.reward": "R 150 krediet",
  "referral.tier.gold.reward": "R 300 krediet + 1 gratis hupstoot",
  "referral.tier.platinum.reward": "R 750 krediet + Pro-proeftydperk",
  "referral.shareTitle": "Nooi 'n Vriend",
  "referral.shareOn": "Deel op",
  "referral.whatsapp": "WhatsApp",
  "referral.sms": "SMS",
  "referral.email": "E-pos",
  "referral.emailSubject": "Sluit by my aan op TrueWheels",
  "referral.copyLink": "Kopieer Skakel",
  "referral.linkCopied": "Skakel Gekopieer",
  "referral.messagePreview": "Boodskapvoorskou",
  "referral.shareMessage": "Sluit by my aan op TrueWheels — die beste plek om motors in Suid-Afrika te koop en te verkoop! Gebruik my skakel om te begin: {link}",
  "referral.close": "Maak toe",
  "footer.referrals": "Verwys & Verdien",
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

  // Cookie consent
  "cookie.title": "Siyakubalulekisa ubumfihlo bakho",
  "cookie.description":
    "Sisebenzisa amakhukhi ukwenza i-TrueWheels isebenze, ukuqonda ukusetshenziswa, nokwenza ulwazi lwakho lube ngolwakho. Amakhukhi abalulekile kuphela ayadingeka — ezinye uzikhethela zona.",
  "cookie.policyLink": "Funda Inqubomgomo Yethu Yamakhukhi",
  "cookie.essential": "Abalulekile",
  "cookie.essentialDesc": "Iyadingeka ukuze inkundla isebenze",
  "cookie.analytics": "Ukuhlaziya",
  "cookie.analyticsDesc": "Sisiza ukuqonda ukusetshenziswa",
  "cookie.marketing": "Ukumaketha",
  "cookie.marketingDesc": "Izikhangiso ezenzelwe wena",
  "cookie.acceptAll": "Yamukela Konke",
  "cookie.rejectNonEssential": "Yenqaba Okungeyona Ebalulekile",
  "cookie.managePreferences": "Phatha Izintandokazi",
  "cookie.saveChoices": "Gcina Ukukhetha Kwami",

  // Footer
  "footer.tagline": "Imakethe ethembekile yaseNingizimu Afrika yokuthenga, ukudayisa nokuba ngumnikazi wezimoto.",
  "footer.explore": "Hlola",
  "footer.legal": "Okusemthethweni",
  "footer.contact": "Xhumana nathi",
  "footer.terms": "Imigomo Yesevisi",
  "footer.privacy": "Inqubomgomo Yobumfihlo",
  "footer.cookies": "Inqubomgomo Yamakhukhi",
  "footer.popia": "Isitatimende se-POPIA",
  "footer.manageCookies": "Phatha amakhukhi",
  "footer.rights": "Wonke amalungelo agodliwe.",
  "footer.regulator": "Kulawulwa ngokwe-POPIA ne-CPA.",

  // Referrals
  "referral.heroTitle": "Ncoma futhi Uzuze",
  "referral.heroBody": "Mema abangani bakho ku-TrueWheels. Uma bebhalisa futhi befaka imoto yabo yokuqala, nobabili nizuza {amount} kukhredithi yokufaka izindaba.",
  "referral.invitesSent": "Izimemo Ezithunyelwe",
  "referral.friendsJoined": "Abangani Abajoyinile",
  "referral.creditsEarned": "Amakhredithi Azuziwe",
  "referral.pendingCredits": "Unamakhredithi alindile angu-{amount} — akhokhwa uma abangani bakho befaka imoto yabo yokuqala.",
  "referral.howItWorks": "Kusebenza kanjani",
  "referral.step1Title": "Yabelana ngesixhumanisi sakho",
  "referral.step1Desc": "Sithumele nge-WhatsApp, i-SMS, noma i-imeyili.",
  "referral.step2Title": "Bajoyina futhi bafaka",
  "referral.step2Desc": "Umngane wakho ubhalisa futhi afake imoto yakhe yokuqala.",
  "referral.step3Title": "Nobabili nizuza",
  "referral.step3Desc": "Nina nobabili nithola u-R 100 kukhredithi yokufaka izindaba.",
  "referral.inviteFriends": "Mema Abangani",
  "referral.rewardsTitle": "Intuthuko Yemiklomelo",
  "referral.referralsCount": "iziphakamiso ezingu-{count}",
  "referral.tierThreshold": "iziphakamiso ezingu-{count}+",
  "referral.unlocked": "Kuvuliwe",
  "referral.moreNeeded": "kusadingeka okungu-{count}",
  "referral.nextTierHint": "Kusadingeka iziphakamiso ezingu-{count} ukufinyelela i-{tier}.",
  "referral.tier.bronze.reward": "Ibhonasi yokwamukela",
  "referral.tier.silver.reward": "Ikhredithi engu-R 150",
  "referral.tier.gold.reward": "Ikhredithi engu-R 300 + ukukhushulwa okukodwa kwamahhala",
  "referral.tier.platinum.reward": "Ikhredithi engu-R 750 + ukuzama i-Pro",
  "referral.shareTitle": "Mema Umngane",
  "referral.shareOn": "Yabelana ku",
  "referral.whatsapp": "WhatsApp",
  "referral.sms": "SMS",
  "referral.email": "I-imeyili",
  "referral.emailSubject": "Joyina nami ku-TrueWheels",
  "referral.copyLink": "Kopisha Isixhumanisi",
  "referral.linkCopied": "Isixhumanisi Sikopishiwe",
  "referral.messagePreview": "Ukubuka kuqala umyalezo",
  "referral.shareMessage": "Joyina nami ku-TrueWheels — indawo engcono kakhulu yokuthenga nokudayisa izimoto eNingizimu Afrika! Sebenzisa isixhumanisi sami ukuqala: {link}",
  "referral.close": "Vala",
  "footer.referrals": "Ncoma futhi Uzuze",
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
