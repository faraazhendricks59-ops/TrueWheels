import { MapPin, MessageSquare, Phone, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface SellerCardProps { name: string; isDealer: boolean; isVerified: boolean; location: string; responseTime: string; }

export function SellerCard({ name, isDealer, isVerified, location, responseTime }: SellerCardProps) {
  return <aside className="sticky top-24 rounded-xl border border-brand-silver bg-surface-white p-6 shadow-sm"><div className="mb-6 flex items-start gap-4"><div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-brand-silver bg-surface-grey text-xl font-bold text-brand-graphite" aria-hidden="true">{name.charAt(0).toUpperCase()}</div><div className="min-w-0 flex-1"><div className="mb-1 flex flex-wrap items-center gap-2"><h2 className="text-lg font-bold text-brand-graphite">{name}</h2>{isVerified && <Badge variant="verified"><ShieldCheck size={10} className="mr-1" /> Verified</Badge>}</div><p className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={10} /> {location}</p><p className="mt-1 text-xs text-gray-400">Usually responds in {responseTime}</p></div></div><div className="space-y-3"><Button type="button" className="h-11 w-full text-sm"><MessageSquare size={16} className="mr-2" /> Message Seller</Button><Button type="button" variant="outline" className="h-11 w-full text-sm"><Phone size={16} className="mr-2" /> Show Phone Number</Button></div>{isDealer && <div className="mt-6 border-t border-brand-silver pt-6 text-center"><p className="text-xs text-gray-400">View all vehicles from this dealer</p></div>}</aside>;
}
