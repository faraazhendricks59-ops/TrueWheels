import type { DemoVehicle } from "@/lib/demo/vehicles";
import { ALL_MAKES, vehicleBodyType } from "@/lib/vehicle-facets";
import { specsFor } from "@/lib/comparison-data";

export type CheckState = "passed" | "unverified";

export interface ListingCheck {
  id: string;
  label: string;
  detail: string;
  state: CheckState;
}

/** A stable internal reference for a listing, derived from its id. */
export function listingReference(vehicle: DemoVehicle): string {
  const digits = vehicle.id.replace(/\D/g, "").padStart(4, "0");
  return `TW-${vehicle.year}-${digits}`;
}

/**
 * The checks that can actually be run against the data on hand. Everything
 * else is reported as unverified rather than implied to have passed: an
 * assurance about a mileage or accident check that never ran is worse than no
 * assurance, because a buyer would rely on it.
 */
export function listingChecks(vehicle: DemoVehicle): ListingCheck[] {
  const titleYear = vehicle.title.match(/\b(19|20)\d{2}\b/)?.[0];
  const yearMatches = titleYear === String(vehicle.year);
  const makeInTitle = ALL_MAKES.some((make) => vehicle.title.includes(make));

  return [
    {
      id: "year",
      label: "Year matches the listing",
      detail: yearMatches
        ? `The title says ${titleYear} and the record says ${vehicle.year}.`
        : `The title and the record disagree on the year.`,
      state: yearMatches ? "passed" : "unverified",
    },
    {
      id: "make",
      label: "Make recognised",
      detail: makeInTitle
        ? "The make in the title is one we list."
        : "The make in the title is not one we list.",
      state: makeInTitle ? "passed" : "unverified",
    },
    {
      id: "mileage",
      label: "Mileage history",
      detail: "Not checked. We have not seen service records or a mileage audit.",
      state: "unverified",
    },
    {
      id: "accident",
      label: "Accident and write-off history",
      detail: "Not checked. No accident or write-off report has been obtained.",
      state: "unverified",
    },
    {
      id: "seller",
      label: "Seller identity",
      detail: "Not verified. We have not confirmed the seller's identity or that they own the vehicle.",
      state: "unverified",
    },
    {
      id: "inspection",
      label: "Independent inspection",
      detail: "Not done. Arrange your own inspection before you pay anything.",
      state: "unverified",
    },
  ];
}

export interface VehicleSpec {
  label: string;
  value: string;
  /** True when the figure is estimated for the model rather than supplied. */
  estimated?: boolean;
}

/**
 * The specification list. Only the year, mileage and location are supplied with
 * the listing; the mechanical figures are estimated for the model, which the
 * grid states plainly.
 */
export function vehicleSpecs(vehicle: DemoVehicle): VehicleSpec[] {
  const specs = specsFor(vehicle);
  return [
    { label: "Year", value: String(vehicle.year) },
    { label: "Mileage", value: `${vehicle.mileage.toLocaleString("en-ZA")} km` },
    { label: "Location", value: vehicle.location },
    { label: "Power", value: `${specs.performance.Power} kW`, estimated: true },
    { label: "Torque", value: `${specs.performance.Torque} Nm`, estimated: true },
    { label: "0-100 km/h", value: `${specs.performance["0-100 km/h"]} s`, estimated: true },
    { label: "Top speed", value: `${specs.performance["Top Speed"]} km/h`, estimated: true },
    { label: "Fuel use", value: `${specs.efficiency["Fuel Consumption"]} L/100km`, estimated: true },
    { label: "Body type", value: vehicleBodyType(vehicle) },
  ];
}
