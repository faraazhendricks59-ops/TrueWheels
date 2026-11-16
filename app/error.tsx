'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your error tracking service (e.g. Sentry)
    console.error('TrueWheels route error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-semantic-warning-soft rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={36} className="text-semantic-warning" />
        </div>

        <h1 className="text-2xl font-bold text-brand-graphite mb-2">Something broke down</h1>
        <p className="text-sm text-neutral-muted leading-relaxed mb-2">
          We hit an unexpected error. Our team has been notified — you can try again, and it will
          usually resolve itself.
        </p>

        {error.digest && (
          <p className="text-xs text-neutral-subtle font-mono mb-6">Error ID: {error.digest}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="w-full sm:w-auto">
            <RefreshCw size={16} /> Try Again
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/">
              <Home size={16} /> Go Home
            </Link>
          </Button>
        </div>

        <Link
          href="/contact"
          className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-subtle transition-colors hover:text-brand-red"
        >
          <LifeBuoy size={12} /> Still stuck? Contact support
        </Link>
      </div>
    </div>
  );
}
