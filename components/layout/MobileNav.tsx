import Link from "next/link";
import { Home, MessageSquare, Plus, Search, User } from "lucide-react";

const items = [["Home", "/", Home], ["Search", "/marketplace", Search], ["Messages", "/messages", MessageSquare], ["Profile", "/profile", User]] as const;

export function MobileNav() {
  return <nav aria-label="Mobile navigation" className="fixed bottom-0 left-0 right-0 z-40 border-t border-brand-silver bg-white md:hidden"><div className="flex h-16 items-center justify-around px-2">{items.slice(0, 2).map(([label, href, Icon]) => <Link key={href} href={href} className="flex h-full w-16 flex-col items-center justify-center text-gray-500"><Icon size={22} /><span className="mt-1 text-[10px] font-medium">{label}</span></Link>)}<Link href="/sell" aria-label="Sell vehicle" className="-mt-6 flex flex-col items-center justify-center"><span className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-gray-100 bg-brand-red shadow-lg"><Plus size={28} className="text-white" /></span><span className="mt-1 text-[10px] font-medium text-brand-graphite">Sell</span></Link>{items.slice(2).map(([label, href, Icon]) => <Link key={href} href={href} className="flex h-full w-16 flex-col items-center justify-center text-gray-500"><Icon size={22} /><span className="mt-1 text-[10px] font-medium">{label}</span></Link>)}</div></nav>;
}
