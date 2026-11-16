/**
 * Canonical site identity. Every absolute URL in metadata, JSON-LD, sitemap and
 * robots derives from here so the domain is changed in exactly one place.
 */
export const SITE_URL = "https://truewheels.co.za";

export const SITE_NAME = "TrueWheels";

export const SITE_DESCRIPTION =
  "Discover, buy, sell, and manage your vehicles on South Africa's most trusted automotive ecosystem.";

export const SITE_LOGO = `${SITE_URL}/icons/icon-192x192.png`;

export const SITE_SOCIALS = [
  "https://www.facebook.com/truewheels",
  "https://www.instagram.com/truewheels",
  "https://twitter.com/truewheels",
];

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
