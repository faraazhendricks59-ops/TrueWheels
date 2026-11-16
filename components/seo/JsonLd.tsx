import type { Vehicle } from "@/lib/vehicles/demo-vehicles";
import { vehicleTitle } from "@/lib/vehicles/demo-vehicles";
import { SITE_DESCRIPTION, SITE_LOGO, SITE_NAME, SITE_SOCIALS, SITE_URL, absoluteUrl } from "@/lib/seo/site";

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Serialises structured data safely for injection into a <script> tag.
 * JSON.stringify alone is not enough: a value containing "</script>" would
 * close the tag early, and raw U+2028/U+2029 are valid JSON but break the JS
 * parser. Both are reachable through listing text, which is user-supplied.
 */
function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/** Generic JSON-LD script injector. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

/** Vehicle listing — enables rich car results in Google. */
export function VehicleJsonLd({ vehicle }: { vehicle: Vehicle }) {
  const url = absoluteUrl(`/vehicles/${vehicle.id}`);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: vehicleTitle(vehicle),
    url,
    image: vehicle.images,
    description: vehicle.description,
    brand: { "@type": "Brand", name: vehicle.make },
    model: vehicle.model,
    vehicleModelDate: vehicle.year,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileage,
      unitCode: "KMT",
    },
    fuelType: vehicle.fuelType,
    vehicleTransmission: vehicle.transmission,
    vehicleConfiguration: vehicle.variant,
    color: vehicle.colour,
    bodyType: vehicle.bodyType,
    itemCondition:
      vehicle.condition === "New"
        ? "https://schema.org/NewCondition"
        : "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: "ZAR",
      availability: "https://schema.org/InStock",
      url,
      // Price is only meaningful with a validity window for rich results.
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      seller: { "@type": "Organization", name: vehicle.dealer.name },
      areaServed: { "@type": "City", name: vehicle.city },
    },
  };

  return <JsonLd data={data} />;
}

/** Organisation — establishes the TrueWheels entity. */
export function OrganisationJsonLd() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: SITE_LOGO,
    description: SITE_DESCRIPTION,
    sameAs: SITE_SOCIALS,
  };
  return <JsonLd data={data} />;
}

/** WebSite with SearchAction — enables the Google sitelinks search box. */
export function WebSiteJsonLd() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/marketplace?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
  return <JsonLd data={data} />;
}

/** Breadcrumb — shows the navigation path in results. */
export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <JsonLd data={data} />;
}
