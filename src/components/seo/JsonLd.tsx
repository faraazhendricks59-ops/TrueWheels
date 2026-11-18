import { SITE_URL } from "@/lib/site";

type JsonLdValue = Record<string, unknown>;

interface JsonLdProps {
  type: "Organization" | "WebSite" | "BreadcrumbList" | "Vehicle" | "Product";
  data: JsonLdValue;
}

/**
 * Structured data for search engines. Rendered on the server so the script is
 * present in the initial HTML, which is what crawlers that do not execute
 * JavaScript will see.
 */
export function JsonLd({ type, data }: JsonLdProps) {
  const schema = { "@context": "https://schema.org", "@type": type, ...data };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped below; this is the documented pattern.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  );
}

export function OrganizationSchema() {
  return (
    <JsonLd
      type="Organization"
      data={{
        name: "TrueWheels",
        url: SITE_URL,
        logo: `${SITE_URL}/icons/icon-512x512.png`,
        sameAs: ["https://www.facebook.com/truewheels", "https://www.instagram.com/truewheels"],
      }}
    />
  );
}

export function WebSiteSchema() {
  return (
    <JsonLd
      type="WebSite"
      data={{
        name: "TrueWheels",
        url: SITE_URL,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/marketplace?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}
