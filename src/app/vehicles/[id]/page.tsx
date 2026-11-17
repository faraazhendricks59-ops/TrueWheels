import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_VEHICLES } from "@/lib/demo/vehicles";
import { VehicleDetail } from "@/components/vehicles/VehicleDetail";

/**
 * Detail routes were absent until now, which left every link to a vehicle
 * broken. This is the minimal page: Arc 4 builds the full detail experience on
 * top of it.
 */
export function generateStaticParams() {
  return DEMO_VEHICLES.map((vehicle) => ({ id: vehicle.id }));
}

/**
 * Only the ids above are real. Without this, an unknown id still matched the
 * route, ran the page and rendered the not-found page with a 200 status, so a
 * missing vehicle looked like a working page to crawlers and monitoring.
 */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const vehicle = DEMO_VEHICLES.find((row) => row.id === params.id);
  if (!vehicle) return { title: "Vehicle not found | TrueWheels" };
  return {
    title: `${vehicle.title} | TrueWheels`,
    description: `${vehicle.title} for sale in ${vehicle.location} at R ${vehicle.price.toLocaleString("en-ZA")}.`,
  };
}

export default function VehiclePage({ params }: { params: { id: string } }) {
  const vehicle = DEMO_VEHICLES.find((row) => row.id === params.id);
  if (!vehicle) notFound();
  return <VehicleDetail vehicle={vehicle} />;
}
