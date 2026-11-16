'use client';

import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface OfflineFallbackProps {
  onRetry?: () => void;
}

export function OfflineFallback({ onRetry }: OfflineFallbackProps) {
  return (
    <div className="bg-surface-white border border-brand-silver border-dashed rounded-xl p-10 text-center">
      <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <WifiOff size={24} className="text-amber-500" />
      </div>
      <h3 className="text-lg font-bold text-brand-graphite mb-1">You&apos;re offline</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
        We can&apos;t load this right now. Your saved vehicles and digital garage are still available
        — reconnect to the internet to continue.
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw size={16} /> Retry
        </Button>
      )}
    </div>
  );
}
