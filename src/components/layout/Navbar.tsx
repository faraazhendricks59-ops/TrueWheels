import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const LINKS = [
  { href: "#marketplace", label: "Marketplace" },
  { href: "#list", label: "Sell" },
  { href: "#auctions", label: "Auctions" },
];

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-ink-100 dark:border-ink-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Logo size="sm" />
        <div className="flex items-center gap-4">
          <ul className="hidden md:flex items-center gap-6">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-ink-600 dark:text-ink-300 hover:text-brand transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
