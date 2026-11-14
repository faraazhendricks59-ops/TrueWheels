import { FilterDrawer } from "@/components/marketplace/FilterDrawer";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { ListingGrid } from "@/components/vehicles/ListingGrid";
import { VehicleCard, VehicleCardProps } from "@/components/vehicles/VehicleCard";

const MOCK_RESULTS: VehicleCardProps[] = [
  { id: "1", title: "2021 Volkswagen Golf 8 GTI", price: 649000, mileage: 32000, fuelType: "Petrol", location: "Sandton, GP", imageUrl: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=80", isFeatured: true },
  { id: "2", title: "2019 Ford Ranger Raptor", price: 785000, mileage: 65000, fuelType: "Diesel", location: "Cape Town, WC", imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80" },
  { id: "3", title: "2022 BMW M3 Competition", price: 1450000, mileage: 12000, fuelType: "Petrol", location: "Umhlanga, KZN", imageUrl: "https://images.unsplash.com/photo-1555215695-3004980adade?auto=format&fit=crop&w=800&q=80", isFeatured: true },
  { id: "4", title: "2020 Toyota Hilux 2.8 GD-6", price: 599000, mileage: 89000, fuelType: "Diesel", location: "Pretoria, GP", imageUrl: "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?auto=format&fit=crop&w=800&q=80" },
  { id: "5", title: "2018 Mercedes-Benz C200", price: 420000, mileage: 75000, fuelType: "Petrol", location: "Stellenbosch, WC", imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80" },
  { id: "6", title: "2021 Audi RS3 Sportback", price: 1150000, mileage: 22000, fuelType: "Petrol", location: "Ballito, KZN", imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80" },
];

export default function MarketplacePage() {
  return <div className="mx-auto max-w-7xl px-4 py-8"><div className="mb-4 md:hidden"><FilterDrawer /></div><div className="flex flex-col md:flex-row"><FilterSidebar /><main className="min-w-0 flex-1"><MarketplaceHeader resultCount={MOCK_RESULTS.length} /><ListingGrid columns={3}>{MOCK_RESULTS.map((car) => <VehicleCard key={car.id} {...car} />)}</ListingGrid><div className="mt-12 flex justify-center gap-2"><button type="button" aria-label="Page 1" className="h-10 w-10 rounded-lg border border-brand-silver bg-surface-white font-medium text-brand-graphite hover:bg-surface-grey">1</button><button type="button" aria-label="Page 2" className="h-10 w-10 rounded-lg border border-brand-silver bg-surface-white font-medium text-gray-500 hover:bg-surface-grey">2</button><button type="button" aria-label="Page 3" className="h-10 w-10 rounded-lg border border-brand-silver bg-surface-white font-medium text-gray-500 hover:bg-surface-grey">3</button></div></main></div></div>;
}
