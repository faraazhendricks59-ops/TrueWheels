import Image from "next/image";
import { Gauge, Heart, MapPin } from "lucide-react";

interface VehicleCardProps {
  title: string;
  price: number;
  mileage: number;
  location: string;
  imageUrl: string;
  isBoosted?: boolean;
  isLiveAuction?: boolean;
}

const formatRand = (value: number) => `R ${value.toLocaleString("en-ZA")}`;

export function VehicleCard({ title, price, mileage, location, imageUrl, isBoosted, isLiveAuction }: VehicleCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-brand-silver/50 bg-surface-white shadow-card transition-all duration-200 hover:shadow-card-hover">
      <div className="relative aspect-[16/10] bg-gray-100">
        <Image src={imageUrl} alt={title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex gap-2">
          {isBoosted && <span className="rounded-md border border-amber-100 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">⚡ Featured</span>}
          {isLiveAuction && <span className="animate-pulse rounded-md bg-brand-red/90 px-2 py-1 text-xs font-semibold text-white">🔴 LIVE</span>}
        </div>
        <button type="button" aria-label={`Save ${title}`} className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-gray-500 shadow-sm backdrop-blur-sm transition-colors hover:text-brand-red"><Heart size={16} /></button>
      </div>
      <div className="p-4">
        <h3 className="mb-1 truncate text-base font-bold text-brand-graphite">{title}</h3>
        <p className="mb-3 text-xl font-extrabold tabular-nums text-brand-graphite">{formatRand(price)}</p>
        <div className="flex items-center justify-between gap-3 text-xs font-medium text-gray-500">
          <span className="flex items-center gap-1"><Gauge size={12} />{mileage.toLocaleString("en-ZA")} km</span>
          <span className="flex min-w-0 items-center gap-1"><MapPin size={12} /><span className="truncate">{location}</span></span>
        </div>
      </div>
    </article>
  );
}
