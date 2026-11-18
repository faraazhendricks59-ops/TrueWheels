import type { DemoVehicle } from "@/lib/demo/vehicles";
import { listingReference } from "@/lib/vehicle-trust";

export interface MileageReading {
  /** ISO date the reading was taken. */
  date: string;
  mileage: number;
  /** Where the reading came from, so it can be judged. */
  source: string;
}

export type AnomalyKind = "rollback" | "implausible-jump" | "conflicting-reading";

export interface MileageAnomaly {
  kind: AnomalyKind;
  /** Index into the readings array of the reading that looks wrong. */
  atIndex: number;
  detail: string;
}

/** An increase beyond this in a single year is treated as needing explanation. */
export const IMPLAUSIBLE_KM_PER_YEAR = 60000;

const daysBetween = (a: string, b: string) =>
  Math.abs(new Date(b).getTime() - new Date(a).getTime()) / 86400000;

/**
 * Odometer checks over a series of readings, oldest first.
 *
 * A reading lower than one taken earlier is the signature of a rollback, but it
 * is also what a mistyped figure looks like, so the finding says the readings
 * disagree and must be explained rather than asserting fraud. With fewer than
 * two readings nothing can be concluded, and the function says so by returning
 * nothing.
 */
export function detectMileageAnomalies(readings: MileageReading[]): MileageAnomaly[] {
  const ordered = [...readings].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const anomalies: MileageAnomaly[] = [];

  for (let index = 1; index < ordered.length; index++) {
    const previous = ordered[index - 1];
    const current = ordered[index];

    if (current.mileage < previous.mileage) {
      anomalies.push({
        kind: "rollback",
        atIndex: index,
        detail: `The reading of ${current.mileage.toLocaleString("en-ZA")} km on ${current.date} is lower than the ${previous.mileage.toLocaleString("en-ZA")} km recorded on ${previous.date}. Either the odometer was turned back or one of the two figures is wrong.`,
      });
      continue;
    }

    const years = daysBetween(previous.date, current.date) / 365;
    if (years > 0 && (current.mileage - previous.mileage) / years > IMPLAUSIBLE_KM_PER_YEAR) {
      anomalies.push({
        kind: "implausible-jump",
        atIndex: index,
        detail: `The distance between ${previous.date} and ${current.date} works out to more than ${IMPLAUSIBLE_KM_PER_YEAR.toLocaleString("en-ZA")} km a year, which is unusual enough to ask about.`,
      });
    }
  }

  // Two readings on the same day that disagree cannot both be right.
  for (let index = 1; index < ordered.length; index++) {
    const previous = ordered[index - 1];
    const current = ordered[index];
    if (previous.date === current.date && previous.mileage !== current.mileage) {
      anomalies.push({
        kind: "conflicting-reading",
        atIndex: index,
        detail: `Two readings for ${current.date} disagree: ${previous.mileage.toLocaleString("en-ZA")} km and ${current.mileage.toLocaleString("en-ZA")} km.`,
      });
    }
  }

  return anomalies;
}

export interface HistoryCheck {
  id: string;
  label: string;
  /** What the check establishes. */
  purpose: string;
  /** Who holds the record in South Africa. */
  holder: string;
  state: "not-obtained";
}

/**
 * The checks a buyer would want. All are reported as not obtained, because none
 * have been run: there is no SAPS, eNaTIS, NAAMSA or insurer integration in this
 * project. A "not reported stolen" badge with nothing behind it is the most
 * dangerous thing this page could show, because the buyer's money is gone the
 * moment the vehicle is seized.
 */
export function historyChecks(): HistoryCheck[] {
  return [
    {
      id: "stolen",
      label: "Stolen vehicle check",
      purpose: "Confirms the vehicle has not been reported stolen or sought by the police.",
      holder: "SAPS",
      state: "not-obtained",
    },
    {
      id: "write-off",
      label: "Write-off and code check",
      purpose: "Confirms whether the vehicle was written off, rebuilt or deregistered.",
      holder: "eNaTIS",
      state: "not-obtained",
    },
    {
      id: "finance",
      label: "Outstanding finance check",
      purpose: "Confirms whether money is still owed on the vehicle and who owns it.",
      holder: "The bank or lender on the Natis record",
      state: "not-obtained",
    },
    {
      id: "accident",
      label: "Accident and claim history",
      purpose: "Lists reported collisions and insurance claims.",
      holder: "The insurer who paid each claim",
      state: "not-obtained",
    },
    {
      id: "mileage",
      label: "Odometer verification",
      purpose: "Compares the reading against service and licensing records over time.",
      holder: "Service providers and the licensing authority",
      state: "not-obtained",
    },
  ];
}

export interface HistoryReport {
  reference: string;
  readings: MileageReading[];
  anomalies: MileageAnomaly[];
  /** False when there are too few readings to reach any conclusion. */
  canAssessMileage: boolean;
}

/**
 * The report for a listing. The only odometer reading available is the one on
 * the listing itself, so the mileage section cannot conclude anything yet, and
 * says so rather than showing a graph that implies a history it does not have.
 */
export function historyReportFor(vehicle: DemoVehicle): HistoryReport {
  const readings: MileageReading[] = [
    {
      date: new Date().toISOString().slice(0, 10),
      mileage: vehicle.mileage,
      source: "Odometer reading on the listing",
    },
  ];

  return {
    reference: listingReference(vehicle),
    readings,
    anomalies: detectMileageAnomalies(readings),
    canAssessMileage: readings.length >= 2,
  };
}
