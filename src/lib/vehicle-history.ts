import type { DemoVehicle } from "@/lib/demo/vehicles";
import { specsFor } from "@/lib/comparison-data";
import { vehicleBodyType } from "@/lib/vehicle-facets";
import { DEFAULT_FINANCE } from "@/lib/finance";

export interface SpecRow {
  label: string;
  value: string;
  /** Derived for the model rather than measured on this vehicle. */
  estimated?: boolean;
}

export interface SpecGroup {
  title: string;
  rows: SpecRow[];
}

/**
 * The specifications, grouped. Only the year, mileage and location come with a
 * listing; the mechanical figures are typical for the model and year, so they
 * carry the estimate mark rather than being presented as measurements.
 */
export function specGroupsFor(vehicle: DemoVehicle): SpecGroup[] {
  const specs = specsFor(vehicle);
  const km = vehicle.mileage.toLocaleString("en-ZA");
  const perYear = Math.max(1, new Date().getFullYear() - vehicle.year);
  const annualKm = Math.round(vehicle.mileage / perYear);

  return [
    {
      title: "Listing",
      rows: [
        { label: "Year", value: String(vehicle.year) },
        { label: "Odometer reading", value: `${km} km` },
        { label: "Average per year", value: `${annualKm.toLocaleString("en-ZA")} km`, estimated: true },
        { label: "Location", value: vehicle.location },
        { label: "Body type", value: vehicleBodyType(vehicle) },
      ],
    },
    {
      title: "Engine and performance",
      rows: [
        { label: "Power", value: `${specs.performance.Power} kW`, estimated: true },
        { label: "Torque", value: `${specs.performance.Torque} Nm`, estimated: true },
        { label: "0-100 km/h", value: `${specs.performance["0-100 km/h"]} s`, estimated: true },
        { label: "Top speed", value: `${specs.performance["Top Speed"]} km/h`, estimated: true },
      ],
    },
    {
      title: "Running costs",
      rows: [
        {
          label: "Fuel use (combined)",
          value: `${specs.efficiency["Fuel Consumption"]} L/100km`,
          estimated: true,
        },
        { label: "Fuel tank", value: `${specs.efficiency["Tank Size"]} L`, estimated: true },
        { label: "CO2 emissions", value: `${specs.efficiency["CO2 Emissions"]} g/km`, estimated: true },
      ],
    },
    {
      title: "Dimensions",
      rows: [
        { label: "Length", value: `${specs.dimensions.Length} mm`, estimated: true },
        { label: "Width", value: `${specs.dimensions.Width} mm`, estimated: true },
        { label: "Boot space", value: `${specs.dimensions["Boot Space"]} L`, estimated: true },
        { label: "Kerb weight", value: `${specs.dimensions["Kerb Weight"]} kg`, estimated: true },
      ],
    },
  ];
}

export interface HistoryRecord {
  id: string;
  title: string;
  detail: string;
  /** The seller states this; TrueWheels has not confirmed it. */
  source: "seller" | "truewheels";
}

/**
 * What is known about the vehicle's history. No service records, no ownership
 * records and no history report have been supplied with this listing, so the
 * sections that would show them state that rather than inventing entries. An
 * invented service record with an "API verified" badge is exactly the kind of
 * claim a buyer would pay money on.
 */
export function historyGaps(vehicle: DemoVehicle): HistoryRecord[] {
  return [
    {
      id: "service",
      title: "No service records supplied",
      detail:
        "The seller has not provided a service book, invoices or a digital service record. Nothing about the maintenance history of this vehicle has been confirmed.",
      source: "truewheels",
    },
    {
      id: "ownership",
      title: "No ownership records supplied",
      detail:
        "The number of previous owners and how the vehicle was used have not been confirmed. It has not been checked against fleet, rental or taxi registers.",
      source: "truewheels",
    },
    {
      id: "mileage",
      title: "Odometer reading not verified",
      detail: `The reading of ${vehicle.mileage.toLocaleString("en-ZA")} km has not been cross-checked against service records, so an accurate mileage cannot be guaranteed.`,
      source: "truewheels",
    },
    {
      id: "features",
      title: "Features not confirmed",
      detail:
        "The list of fitted features has not been supplied. Confirm what is actually fitted with the seller, and check the vehicle in person.",
      source: "truewheels",
    },
  ];
}

/** What a buyer should ask for before paying. */
export function dueDiligence(): string[] {
  return [
    "The service book or digital service record, with each entry dated and stamped.",
    "The registration certificate, to confirm the seller is the registered owner.",
    "A roadworthy certificate, if the seller claims one is current.",
    "Written confirmation of any accident repairs, outstanding finance or warranty.",
    "An independent inspection, arranged by you rather than the seller.",
  ];
}

/** The instalment illustration basis, so the tab can state it consistently. */
export function financeBasis(): string {
  return `R ${Math.round(DEFAULT_FINANCE.depositRate * 100)}% deposit over ${DEFAULT_FINANCE.termMonths} months at ${(DEFAULT_FINANCE.annualRate * 100).toFixed(1)}%`;
}
