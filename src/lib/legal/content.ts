export interface LegalSection {
  id: string;
  title: string;
  body: string[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  updated: string;
  summary: string;
  sections: LegalSection[];
}

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    slug: "terms",
    title: "Terms of Service",
    updated: "1 November 2026",
    summary: "The rules that govern your use of TrueWheels.",
    sections: [
      {
        id: "acceptance",
        title: "1. Acceptance of Terms",
        body: [
          "By accessing TrueWheels you agree to be bound by these Terms. If you do not agree with any part of them, please discontinue use immediately.",
        ],
      },
      {
        id: "listings",
        title: "2. Listings and Seller Obligations",
        body: [
          "Sellers warrant that they are the legal owner of any vehicle listed, or are authorised to sell it on the owner's behalf.",
          "All information supplied in a listing must be accurate and complete. TrueWheels reserves the right to remove any listing that appears fraudulent, misleading or unlawful.",
        ],
      },
      {
        id: "voetstoots",
        title: "3. Voetstoots and Consumer Protection",
        body: [
          "Private sales are governed by the voetstoots principle, meaning the vehicle is sold as it stands. Buyers are encouraged to arrange an independent inspection before purchase.",
          "Sales by registered dealers are subject to the implied warranties of the Consumer Protection Act 68 of 2008.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    updated: "1 November 2026",
    summary: "What personal information we collect and why.",
    sections: [
      {
        id: "collection",
        title: "1. Information We Collect",
        body: [
          "We collect the personal information needed to verify identity for FICA purposes, to process transactions, and to keep the platform secure.",
          "This includes your name, contact details, identity number where required by law, and records of your activity on the platform.",
        ],
      },
      {
        id: "popia",
        title: "2. Your Rights Under POPIA",
        body: [
          "Under the Protection of Personal Information Act 4 of 2013 you have the right to access the personal information we hold about you, to request that it be corrected, and to request its deletion.",
          "You may exercise these rights at any time from your account settings.",
        ],
      },
    ],
  },
  {
    slug: "popia",
    title: "POPIA Statement",
    updated: "1 November 2026",
    summary: "How TrueWheels complies with the Protection of Personal Information Act.",
    sections: [
      {
        id: "responsible-party",
        title: "1. Responsible Party",
        body: [
          "TrueWheels (Pty) Ltd is the responsible party for the personal information processed through this platform.",
          "Our information officer can be reached at privacy@truewheels.co.za.",
        ],
      },
      {
        id: "purpose",
        title: "2. Purpose of Processing",
        body: [
          "Personal information is processed only for the purposes for which it was collected, or for purposes that are compatible with them.",
          "We do not sell personal information to third parties.",
        ],
      },
      {
        id: "retention",
        title: "3. Retention and Security",
        body: [
          "Information is retained only as long as it is required for the purpose it was collected, or as required by law.",
          "We apply reasonable technical and organisational measures to protect the information we hold.",
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    updated: "1 November 2026",
    summary: "The cookies we set and how you control them.",
    sections: [
      {
        id: "categories",
        title: "1. Categories of Cookies",
        body: [
          "Essential cookies are required for the platform to function and cannot be switched off.",
          "Analytics cookies help us understand how the platform is used. Marketing cookies are used to personalise offers and advertising.",
        ],
      },
      {
        id: "control",
        title: "2. Controlling Cookies",
        body: [
          "You can accept all cookies, reject all non-essential cookies, or choose per category from the consent banner.",
          "Your choice is stored in your browser and can be changed at any time by clearing it and reloading the page.",
        ],
      },
    ],
  },
];

export function getLegalDocument(slug: string): LegalDocument | undefined {
  return LEGAL_DOCUMENTS.find((doc) => doc.slug === slug);
}
