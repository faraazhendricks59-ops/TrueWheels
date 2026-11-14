import Link from "next/link";
import { Home, MessageCircle, Plus, Search, UserRound } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/marketplace", label: "Search", icon: Search },
  { href: "/sell", label: "Sell", icon: Plus, featured: true },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-brand-silver bg-surface-white md:hidden" aria-label="Mobile navigation">
      <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-center px-2">
        {items.map(({ href, label, icon: Icon, featured }) => (
          <Link key={href} href={href} className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${featured ? "text-brand-red" : "text-gray-500"}`}>
            <span className={featured ? "-mt-5 flex h-12 w-12 items-center justify-center rounded-full border-4 border-surface-grey bg-brand-red text-white shadow-lg" : ""}>
              <Icon size={featured ? 22 : 19} />
            </span>
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
