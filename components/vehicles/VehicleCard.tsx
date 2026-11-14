import Image from "next/image";
import Link from "next/link";
import { Fuel, Gauge, Heart, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface VehicleCardProps {
  id: string;
  title: string;
  price: number;
  mileage: number;
  fuelType: string;
  location: string;
  imageUrl: string;
  isFeatured?: boolean;
  isLiveAuction?: boolean;
}

export function VehicleCard({ id, title, price, mileage, fuelType, location, imageUrl, isFeatured = false, isLiveAuction = false }: VehicleCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(price);
  return <Link href={`/vehicles/${encodeURIComponent(id)}`} className="group block h-full" aria-label={`View ${title}`}><article className="flex h-full flex-col overflow-hidden rounded-xl border border-brand-silver bg-surface-white shadow-card transition-all duration-300 hover:shadow-card-hover"><div className="relative aspect-[16/10] overflow-hidden bg-gray-100"><Image src={imageUrl} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" /><div className="absolute left-3 top-3 flex gap-2">{isFeatured && <Badge variant="featured">⚡ Featured</Badge>}{isLiveAuction && <Badge variant="live">🔴 LIVE</Badge>}</div><button type="button" aria-label={`Save ${title}`} className="absolute right-3 top-3 rounded-full bg-surface-white/90 p-2 text-gray-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-surface-white hover:text-brand-red" onClick={(event) => event.preventDefault()}><Heart size={16} /></button></div><div className="flex flex-1 flex-col p-4"><h3 className="mb-1 truncate text-base font-bold text-brand-graphite transition-colors group-hover:text-brand-red">{title}</h3><p className="mb-3 text-xl font-extrabold tabular-nums text-brand-graphite">{formattedPrice}</p><div className="mt-auto flex items-center justify-between gap-2 border-t border-brand-silver pt-3 text-xs font-medium text-gray-500"><span className="flex min-w-0 items-center gap-1.5"><Gauge size={12} /><span className="truncate">{mileage.toLocaleString("en-ZA")} km</span></span><span className="flex min-w-0 items-center gap-1.5"><Fuel size={12} /><span className="truncate">{fuelType}</span></span><span className="flex min-w-0 items-center gap-1.5"><MapPin size={12} /><span className="max-w-[80px] truncate">{location}</span></span></div></div></article></Link>;
}
