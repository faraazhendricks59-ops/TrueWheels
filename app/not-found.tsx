import Link from 'next/link';
import { Search, Home, Car } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Illustration */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-brand-red/10 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Car size={56} className="text-brand-red" />
          </div>
          {/* Flat tyre detail */}
          <div className="absolute bottom-1 right-1 w-8 h-8 bg-surface-white border-2 border-brand-red rounded-full flex items-center justify-center">
            <span className="text-brand-red font-bold text-xs">?</span>
          </div>
        </div>

        <p className="text-6xl font-extrabold text-brand-graphite tabular-nums mb-3 tracking-tight">404</p>
        <h1 className="text-xl font-bold text-brand-graphite mb-2">This road leads nowhere</h1>
        <p className="text-sm text-neutral-muted leading-relaxed mb-8">
          The listing you&apos;re looking for may have been sold, removed, or the link is broken.
          Let&apos;s get you back on track.
        </p>

        {/* Recovery Search */}
        <form action="/marketplace" method="get" className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-subtle" />
          <input
            type="search"
            name="q"
            aria-label="Search for a vehicle"
            placeholder="Search for a vehicle instead..."
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-brand-silver bg-surface-white text-sm text-brand-graphite focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
          />
        </form>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/marketplace">
              <Search size={16} /> Browse Marketplace
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/">
              <Home size={16} /> Back to Home
            </Link>
          </Button>
        </div>

        <BackButton />
      </div>
    </main>
  );
}
