import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ListingGrid } from "@/components/vehicles/ListingGrid";
import { VehicleCard, VehicleCardProps } from "@/components/vehicles/VehicleCard";

const TRENDING_VEHICLES: VehicleCardProps[] = [
  { id: "1", title: "2021 Volkswagen Golf 8 GTI", price: 649000, mileage: 32000, fuelType: "Petrol", location: "Sandton, GP", imageUrl: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=80", isFeatured: true },
  { id: "2", title: "2019 Ford Ranger Raptor", price: 785000, mileage: 65000, fuelType: "Diesel", location: "Cape Town, WC", imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80" },
  { id: "3", title: "2022 BMW M3 Competition", price: 1450000, mileage: 12000, fuelType: "Petrol", location: "Umhlanga, KZN", imageUrl: "https://images.unsplash.com/photo-1555215695-3004980adade?auto=format&fit=crop&w=800&q=80", isFeatured: true, isLiveAuction: true },
  { id: "4", title: "2020 Toyota Hilux 2.8 GD-6", price: 599000, mileage: 89000, fuelType: "Diesel", location: "Pretoria, GP", imageUrl: "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?auto=format&fit=crop&w=800&q=80" },
];

export function TrendingSection() { return <section className="mx-auto max-w-7xl px-4 py-16"><div className="mb-8 flex items-end justify-between"><div><h2 className="text-2xl font-bold tracking-tight text-brand-graphite md:text-3xl">Trending Near You</h2><p className="mt-1 text-gray-500">Popular vehicles in Gauteng this week.</p></div><Link href="/marketplace" className="hidden items-center gap-2 text-sm font-semibold text-brand-red transition-colors hover:text-brand-red-dark md:flex">View all listings <ArrowRight size={16} /></Link></div><ListingGrid columns={4}>{TRENDING_VEHICLES.map((car) => <VehicleCard key={car.id} {...car} />)}</ListingGrid><div className="mt-8 text-center md:hidden"><Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red transition-colors hover:text-brand-red-dark">View all listings <ArrowRight size={16} /></Link></div></section>; }
