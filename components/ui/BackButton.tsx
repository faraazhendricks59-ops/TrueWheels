'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function BackButton({ label = 'Go back to previous page' }: { label?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 transition-colors hover:text-brand-red"
    >
      <ArrowLeft size={12} /> {label}
    </button>
  );
}
