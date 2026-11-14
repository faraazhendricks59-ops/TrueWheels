import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { DealerHeader } from "@/components/dealers/DealerHeader";
import { DealerStats } from "@/components/dealers/DealerStats";
import { DealerInventorySection } from "@/components/dealers/DealerInventorySection";
import { VehicleCardProps } from "@/components/vehicles/VehicleCard";

const dealer = { slug: "prestige-motors-sa", name: "Prestige Motors SA", logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=400&q=80", coverUrl: "https://images.unsplash.com/photo-1562519819-016930ada31b?auto=format&fit=crop&w=1600&q=85", location: "Sandton, Gauteng", description: "A trusted Gauteng dealership specialising in carefully selected performance, luxury, and family vehicles. Every vehicle is inspected, transparently presented, and backed by a customer-first buying experience." };

const vehicles: VehicleCardProps[] = [
  { id: "1", title: "2021 Volkswagen Golf 8 GTI", price: 649000, mileage: 32000, fuelType: "Petrol", location: "Sandton, GP", imageUrl: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=900&q=80", isFeatured: true },
  { id: "2", title: "2022 BMW M340i xDrive", price: 1195000, mileage: 18500, fuelType: "Petrol", location: "Sandton, GP", imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80", isFeatured: true },
  { id: "3", title: "2020 Toyota Land Cruiser Prado", price: 899000, mileage: 74000, fuelType: "Diesel", location: "Sandton, GP", imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80" },
  { id: "4", title: "2023 Mercedes-Benz C200", price: 1050000, mileage: 12000, fuelType: "Petrol", location: "Sandton, GP", imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80" },
  { id: "5", title: "2021 Audi RS3 Sedan", price: 1099000, mileage: 29000, fuelType: "Petrol", location: "Sandton, GP", imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80" },
  { id: "6", title: "2022 Ford Ranger Wildtrak", price: 739000, mileage: 41000, fuelType: "Diesel", location: "Sandton, GP", imageUrl: "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=900&q=80" },
];

export default function DealerPage({ params }: { params: { slug: string } }) {
  if (params.slug !== dealer.slug) notFound();
  return <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10"><nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-gray-500"><a href="/" className="hover:text-brand-red">Home</a><span>/</span><a href="/marketplace" className="hover:text-brand-red">Marketplace</a><span>/</span><span className="font-medium text-brand-graphite">{dealer.name}</span></nav><div className="space-y-8"><DealerHeader {...dealer} /><DealerStats vehicleCount={vehicles.length} yearsInBusiness={12} responseTime="2 hours" rating={4.8} /><section className="rounded-2xl border border-brand-silver bg-surface-white p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-bold text-brand-graphite">About this dealership</h2><p className="mt-2 flex items-center gap-2 text-sm text-gray-500"><MapPin size={15} className="text-brand-red" /> Open Monday–Saturday · Sandton, Gauteng</p></div><a href="#inventory" className="text-sm font-bold text-brand-red hover:text-brand-red-dark">Explore vehicles →</a></div></section><DealerInventorySection vehicles={vehicles} /></div></main>;
}
