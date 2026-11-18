import { SITE_URL } from "@/lib/site";
import { JsonLd } from "./JsonLd";
import { listingRef } from "@/lib/seller";
import { photoForVehicle } from "@/lib/vehicle-photos";
import { vehicleBodyType } from "@/lib/vehicle-facets";
import type { DemoVehicle } from "@/lib/demo/vehicles";

/**
 * Structured data for a vehicle listing.
 *
 * The brief asked for this schema to carry "Dealer Rating" and a review count so
 * Google would show stars, and supplied a rating of 4.8 from 142 reviews. Three
 * problems, in order of severity:
 *
 *  1. Those reviews do not exist. There is no purchase, order or review
 *     infrastructure in this project, and the review section was emptied in
 *     Phase 37 for the same reason.
 *  2. Google's own structured data policy forbids it. Reviews that are not
 *     genuine "may result in a manual action", and markup must describe content
 *     that is visible on the page. Rating a business that controls the reviews
 *     about itself is also treated as self-serving and stripped from rich
 *     results. So the markup would not have produced stars and could have cost
 *     the whole page its rich results.
 *  3. It would have claimed a specific, checkable reputation for an unnamed
 *     business. A dealer reading search results would see a rating they never
 *     earned, attributed to them by us.
 *
 * So no `aggregateRating` is emitted anywhere, and the seller is left as an
 * unverified party. What remains is what is actually known: the model, the year,
 * the mileage, the asking price, the location and the listing address.
 *
 * The brief's `"@type": "Car"` is deliberately not used. A Car without an
 * `offers` object is not eligible for the vehicle listing rich result, and the
 * offer belongs on a Product; `Product` with `additionalType` is the shape
 * Google documents for a vehicle listing.
 *
 * The data is read from the same `DemoVehicle` the page renders, so the markup
 * cannot drift from what the page says.
 */
export function VDPJsonLd({ vehicle }: { vehicle: DemoVehicle }) {
  const url = `${SITE_URL}/vehicles/${vehicle.id}`;
  const photo = photoForVehicle(vehicle);
  const make = vehicle.title.replace(/^\d{4}\s/, "").split(" ")[0];

  return (
    <JsonLd
      type="Product"
      data={{
        additionalType: "https://schema.org/Car",
        name: vehicle.title,
        sku: listingRef(vehicle),
        url,
        brand: { "@type": "Brand", name: make },
        vehicleModelDate: String(vehicle.year),
        bodyType: vehicleBodyType(vehicle),
        // The photograph names the make and model in its filename, and carries
        // its own author and licence, so it is the only image that can honestly
        // be attached to this listing. There is no photograph of this specific
        // vehicle.
        ...(photo ? { image: [photo.url] } : {}),
        offers: {
          "@type": "Offer",
          price: vehicle.price,
          priceCurrency: "ZAR",
          availability: "https://schema.org/InStock",
          url,
          seller: {
            "@type": "Organization",
            name: "TrueWheels",
            url: SITE_URL,
          },
        },
        // Stated explicitly so the absence of a rating is a decision on the page
        // rather than an oversight in the markup.
        disambiguatingDescription:
          "Listing published by TrueWheels. The seller is not verified, and no rating or review count is claimed because none has been collected.",
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Mileage",
            value: vehicle.mileage,
            unitCode: "KMT",
          },
          {
            "@type": "PropertyValue",
            name: "Location",
            value: vehicle.location,
          },
        ],
      }}
    />
  );
}
