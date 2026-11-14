import Image from "next/image";
import { Calendar, Star, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface GarageCarCardProps { title: string; imageUrl: string; status: "current" | "past" | "dream"; ownershipPeriod?: string; modifications?: string[]; }

export function GarageCarCard({ title, imageUrl, status, ownershipPeriod, modifications = [] }: GarageCarCardProps) {
  const statusConfig = { current: { label: "Current Ride", variant: "verified" as const, icon: <Star size={10} className="mr-1" /> }, past: { label: "Past Ownership", variant: "default" as const, icon: <Calendar size={10} className="mr-1" /> }, dream: { label: "Dream Car", variant: "featured" as const, icon: <Star size={10} className="mr-1 fill-amber-500 text-amber-500" /> } };
  const config = statusConfig[status];
  return <article className="group relative overflow-hidden rounded-xl border border-gray-800 bg-brand-graphite shadow-card transition-all duration-300 hover:shadow-card-hover"><div className="relative aspect-[16/10] overflow-hidden bg-gray-900"><Image src={imageUrl} alt={title} fill className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" /><div className="absolute left-3 top-3"><Badge variant={config.variant} className="border-white/10 bg-black/60 text-white backdrop-blur-md">{config.icon}{config.label}</Badge></div></div><div className="p-4"><h3 className="mb-2 truncate text-base font-bold text-white">{title}</h3>{ownershipPeriod && <p className="mb-3 flex items-center gap-1.5 text-xs text-gray-400"><Calendar size={10} />{ownershipPeriod}</p>}{modifications.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5 border-t border-gray-800 pt-3">{modifications.map((mod) => <span key={mod} className="flex items-center gap-1 rounded-md bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-300"><Wrench size={8} />{mod}</span>)}</div>}</div></article>;
}
