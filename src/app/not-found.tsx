import Link from "next/link";
import { SearchX } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

/**
 * Served for any address that does not exist, so an unknown vehicle id or a
 * mistyped path gets a page that says so and offers a way back.
 */
export default function NotFound() {
  return (
    <div className="w-full max-w-[600px] mx-auto py-24 text-center">
      <span className="w-14 h-14 rounded-2xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center mx-auto mb-6 text-ink-400">
        <Icon icon={SearchX} size={24} />
      </span>
      <h1 className="text-2xl font-display font-bold text-ink-900 dark:text-white">
        We could not find that page
      </h1>
      <p className="text-sm text-ink-500 dark:text-ink-300 mt-2 mb-6">
        The listing may have been sold or removed, or the address may be mistyped.
      </p>
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-red-dark transition-colors"
      >
        Browse the marketplace
      </Link>
    </div>
  );
}
