import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private and transactional areas must never be indexed.
      disallow: [
        "/dashboard",
        "/dealer/dashboard",
        "/admin",
        "/settings",
        "/messages",
        "/api/",
        "/saved-searches",
        "/referrals",
        "/r/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
