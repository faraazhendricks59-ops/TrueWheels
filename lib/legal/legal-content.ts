export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

const LAST_UPDATED = "16 November 2026";

export const LEGAL_DOCS: Record<string, LegalDocument> = {
  terms: {
    slug: "terms",
    title: "Terms of Service",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        heading: "1. Acceptance of Terms",
        body: [
          "By accessing or using TrueWheels, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use the platform.",
          "These terms are governed by the laws of the Republic of South Africa, including the Consumer Protection Act 68 of 2008 (CPA) and the Electronic Communications and Transactions Act 25 of 2002 (ECTA).",
        ],
      },
      {
        heading: "2. Listings & Seller Obligations",
        body: [
          "Sellers warrant that they are the legal owner or authorised agent of any vehicle listed. All listing information must be accurate and not misleading.",
          "TrueWheels reserves the right to remove listings that violate these terms, are fraudulent, or breach our acceptable use policy.",
        ],
      },
      {
        heading: "3. Payments & Fees",
        body: [
          "Listing fees, boosts, and dealer subscriptions are billed as described at the point of purchase. All prices are in South African Rand (ZAR) and include VAT where applicable.",
          "Payments are processed securely via our third-party payment provider. TrueWheels does not store your full card details.",
        ],
      },
      {
        heading: "4. Limitation of Liability",
        body: [
          "TrueWheels is a platform connecting buyers and sellers. We are not a party to any vehicle transaction and make no warranty regarding the condition of listed vehicles.",
          "To the maximum extent permitted by law, our liability is limited to the amount you paid us in the preceding 12 months.",
        ],
      },
    ],
  },

  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        heading: "1. Information We Collect",
        body: [
          "We collect information you provide (name, email, phone, identity documents for FICA verification) and information collected automatically (device data, usage analytics, cookies).",
        ],
      },
      {
        heading: "2. How We Use Your Information",
        body: [
          "We use your data to provide and improve our services, process transactions, verify identities as required by FICA, and communicate with you about your account.",
        ],
      },
      {
        heading: "3. Your POPIA Rights",
        body: [
          "Under the Protection of Personal Information Act 4 of 2013 (POPIA), you have the right to access, correct, and delete your personal information.",
          "You may request a full export of your data or permanent deletion of your account at any time via Settings → Privacy & POPIA.",
        ],
      },
      {
        heading: "4. Data Retention",
        body: [
          "We retain personal information only as long as necessary for the purposes described, or as required by law (e.g. FICA record-keeping obligations).",
        ],
      },
    ],
  },

  cookies: {
    slug: "cookies",
    title: "Cookie Policy",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        heading: "1. What Are Cookies",
        body: [
          "Cookies are small text files stored on your device that help the platform function, remember your preferences, and understand usage.",
        ],
      },
      {
        heading: "2. Types of Cookies We Use",
        body: [
          "Essential cookies are required for the platform to work (login, security). Analytics cookies help us understand usage. Marketing cookies personalise advertising.",
          "Only Essential cookies are placed by default. Analytics and Marketing cookies require your consent.",
        ],
      },
      {
        heading: "3. Managing Your Consent",
        body: [
          "You can change your cookie preferences at any time via the cookie banner or Settings. Withdrawing consent does not affect the lawfulness of prior processing.",
        ],
      },
    ],
  },

  popia: {
    slug: "popia",
    title: "POPIA Statement",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        heading: "1. Our Commitment",
        body: [
          "TrueWheels is committed to protecting your personal information in accordance with the Protection of Personal Information Act 4 of 2013.",
        ],
      },
      {
        heading: "2. Information Officer",
        body: [
          "Our Information Officer can be contacted at privacy@truewheels.co.za for any POPIA-related queries or complaints.",
        ],
      },
    ],
  },
};

/** Slugs in document order — used for static generation and link building. */
export const LEGAL_DOC_SLUGS = Object.keys(LEGAL_DOCS);

export function getLegalDoc(slug: string): LegalDocument | undefined {
  return LEGAL_DOCS[slug];
}
