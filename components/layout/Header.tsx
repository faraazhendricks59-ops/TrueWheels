import Link from "next/link";
import { Bell, MessageSquare, Plus, Search, User } from "lucide-react";

const links = [
  ["Marketplace", "/marketplace"],
  ["Auctions", "/auctions"],
  ["Community", "/community"],
  ["Dealers", "/dealers"],
] as const;

export function Header() {
  return <header className="sticky top-0 z-40 hidden h-16 w-full items-center border-b border-brand-silver bg-surface-white/80 backdrop-blur-md md:flex"><div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6"><Link href="/" className="flex items-center gap-2" aria-label="TrueWheels home"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-red text-lg font-bold text-white">T</span><span className="text-xl font-bold tracking-tight text-brand-graphite">True<span className="text-brand-red">Wheels</span></span></Link><nav aria-label="Primary navigation" className="flex items-center gap-8 text-sm font-medium text-gray-600">{links.map(([label, href]) => <Link key={href} href={href} className="transition-colors hover:text-brand-graphite">{label}</Link>)}</nav><div className="flex items-center gap-2"><button type="button" aria-label="Search" className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-surface-grey hover:text-brand-graphite"><Search size={20} /></button><button type="button" aria-label="Notifications" className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-surface-grey hover:text-brand-graphite"><Bell size={20} /><span aria-label="Unread notifications" className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-red" /></button><Link href="/messages" aria-label="Messages" className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-surface-grey hover:text-brand-graphite"><MessageSquare size={20} /></Link><Link href="/sell" className="flex items-center gap-2 rounded-lg bg-brand-red px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-red-dark"><Plus size={16} />List Vehicle</Link><Link href="/profile" aria-label="Profile" className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gray-200 text-gray-500 shadow-sm"><User size={18} /></Link></div></div></header>;
}
