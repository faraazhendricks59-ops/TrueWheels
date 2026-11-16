import Link from "next/link";
import { Bell, MessageSquare, Plus, Search, User } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const links = [
  ["Marketplace", "/marketplace"],
  ["Auctions", "/auctions"],
  ["Community", "/community"],
  ["Dealers", "/dealers"],
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 hidden h-16 w-full items-center border-b border-brand-silver bg-surface-white/80 backdrop-blur-md md:flex">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="TrueWheels home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-red text-lg font-bold text-white">T</span>
          <span className="text-xl font-bold tracking-tight text-brand-graphite">True<span className="text-brand-red">Wheels</span></span>
        </Link>
        <nav aria-label="Primary navigation" className="flex items-center gap-6 text-sm font-medium text-neutral-muted">
          {links.map(([label, href]) => <Link key={href} href={href} className="transition-colors hover:text-brand-graphite">{label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Search" className="rounded-lg p-2 text-neutral-muted hover:bg-neutral-hover"><Search size={20} /></button>
          <button type="button" aria-label="Notifications" className="rounded-lg p-2 text-neutral-muted hover:bg-neutral-hover"><Bell size={20} /></button>
          <Link href="/messages" aria-label="Messages" className="rounded-lg p-2 text-neutral-muted hover:bg-neutral-hover"><MessageSquare size={20} /></Link>
          <ThemeToggle />
          <Link href="/sell" className="flex items-center gap-2 rounded-lg bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark"><Plus size={16} />List Vehicle</Link>
          <Link href="/profile" aria-label="Profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-strong text-neutral-muted"><User size={18} /></Link>
        </div>
      </div>
    </header>
  );
}
