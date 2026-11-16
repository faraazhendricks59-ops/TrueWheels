import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gauge, Fuel, Cog, MapPin, BadgeCheck, Calendar } from "lucide-react";
import { BreadcrumbJsonLd, VehicleJsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, absoluteUrl } from "@/lib/seo/site";
import {
  VEHICLE_IDS,
  formatPrice,
  getVehicle,
  vehicleTitle,
} from "@/lib/vehicles/demo-vehicles";

interface VehiclePageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return VEHICLE_IDS.map((id) => ({ id }));
}

export function generateMetadata({ params }: VehiclePageProps): Metadata {
  const vehicle = getVehicle(params.id);
  if (!vehicle) return { title: "Vehicle not found" };

  const title = vehicleTitle(vehicle);
  const price = formatPrice(vehicle.price);
  const url = absoluteUrl(`/vehicles/${vehicle.id}`);
  const description = `${title} for sale in ${vehicle.city} — ${price}, ${vehicle.mileage.toLocaleString("en-ZA")}km, ${vehicle.transmission}. ${vehicle.description}`;

  return {
    title: `${title} — ${price} | ${SITE_NAME}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — ${price}`,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_ZA",
      images: [{ url: vehicle.images[0], width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [vehicle.images[0]],
    },
  };
}

export default function VehiclePage({ params }: VehiclePageProps) {
  const vehicle = getVehicle(params.id);
  if (!vehicle) notFound();

  const title = vehicleTitle(vehicle);
  const url = absoluteUrl(`/vehicles/${vehicle.id}`);

  const specs = [
    { icon: Gauge, label: "Mileage", value: `${vehicle.mileage.toLocaleString("en-ZA")} km` },
    { icon: Fuel, label: "Fuel", value: vehicle.fuelType },
    { icon: Cog, label: "Transmission", value: vehicle.transmission },
    { icon: Calendar, label: "Year", value: String(vehicle.year) },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <VehicleJsonLd vehicle={vehicle} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "Marketplace", url: absoluteUrl("/marketplace") },
          { name: title, url },
        ]}
      />

      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-xs text-neutral-muted">
        <Link href="/" className="hover:text-brand-red">Home</Link>
        <span aria-hidden>/</span>
        <Link href="/marketplace" className="hover:text-brand-red">Marketplace</Link>
        <span aria-hidden>/</span>
        <span className="text-brand-graphite">{title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-brand-silver bg-surface-white">
            <div className="relative aspect-[16/10]">
              <Image
                src={vehicle.images[0]}
                alt={title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </div>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-brand-graphite">{title}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-muted">
            <MapPin size={14} />
            {vehicle.city}, {vehicle.province}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {specs.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-lg border border-brand-silver bg-surface-white p-3">
                <Icon size={16} className="mb-1.5 text-brand-red" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-subtle">{label}</p>
                <p className="text-sm font-semibold text-brand-graphite">{value}</p>
              </div>
            ))}
          </div>

          <section className="mt-6">
            <h2 className="mb-2 text-lg font-bold text-brand-graphite">Description</h2>
            <p className="text-sm leading-relaxed text-neutral-muted">{vehicle.description}</p>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-brand-silver bg-surface-white p-5">
            <p className="text-3xl font-extrabold text-brand-graphite">{formatPrice(vehicle.price)}</p>
            <p className="mt-1 text-xs text-neutral-subtle">{vehicle.condition} • {vehicle.colour}</p>

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-brand-silver bg-surface-grey p-3">
              {vehicle.dealer.verified && <BadgeCheck size={16} className="text-brand-red" />}
              <div>
                <p className="text-sm font-semibold text-brand-graphite">{vehicle.dealer.name}</p>
                <p className="text-xs text-neutral-muted">
                  {vehicle.dealer.verified ? "Verified dealer" : "Private / unverified"}
                </p>
              </div>
            </div>

            <button className="mt-4 w-full rounded-lg bg-brand-red px-6 py-3 font-semibold text-white shadow-card transition hover:bg-brand-red-dark">
              Contact seller
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
