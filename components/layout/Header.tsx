import Link from "next/link";
import { Bell, CarFront, MessageSquare, Plus, Search } from "lucide-react";

const navItems = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/auctions", label: "Auctions" },
  { href: "/community", label: "Community" },
  { href: "/dealers", label: "Dealers" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-brand-silver bg-surface-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="TrueWheels home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-red text-lg font-bold text-white"><CarFront size={18} /></span>
          <span className="hidden text-xl font-bold tracking-tight text-brand-graphite sm:block">True<span className="text-brand-red">Wheels</span></span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => <Link key={item.href} href={item.href} className="transition-colors hover:text-brand-graphite">{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <button type="button" aria-label="Search" className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-surface-grey hover:text-brand-graphite"><Search size={20} /></button>
          <button type="button" aria-label="Notifications" className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-surface-grey hover:text-brand-graphite"><Bell size={20} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-red" /></button>
          <button type="button" aria-label="Messages" className="hidden rounded-lg p-2 text-gray-500 transition-colors hover:bg-surface-grey hover:text-brand-graphite sm:block"><MessageSquare size={20} /></button>
          <Link href="/sell" className="hidden items-center gap-2 rounded-lg bg-brand-red px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-red-dark sm:flex"><Plus size={16} />List Vehicle</Link>
          <Link href="/profile" aria-label="Profile" className="h-9 w-9 rounded-full border-2 border-white bg-gray-200 shadow-sm" />
        </div>
      </div>
    </header>
  );
}
