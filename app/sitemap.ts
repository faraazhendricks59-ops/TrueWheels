import type { MetadataRoute } from "next";
import { LEGAL_DOC_SLUGS } from "@/lib/legal/legal-content";
import { SITE_URL } from "@/lib/seo/site";
import { VEHICLE_IDS } from "@/lib/vehicles/demo-vehicles";

/**
 * Only routes that actually exist are listed. Advertising a URL that 404s
 * wastes crawl budget and hurts trust, so this stays in sync with the app
 * directory rather than aspirational feature lists.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/marketplace`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/become-a-dealer`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const legalPages: MetadataRoute.Sitemap = LEGAL_DOC_SLUGS.map((slug) => ({
    url: `${SITE_URL}/legal/${slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  // Replace with a live listing query once the data layer lands.
  const listings: MetadataRoute.Sitemap = VEHICLE_IDS.map((id) => ({
    url: `${SITE_URL}/vehicles/${id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...listings, ...legalPages];
}
