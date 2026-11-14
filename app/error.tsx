"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("TrueWheels application error", error); }, [error]);
  return <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center"><div className="mb-4 rounded-full bg-amber-50 p-4"><AlertTriangle className="h-8 w-8 text-amber-600" /></div><h2 className="text-2xl font-bold text-brand-graphite">Something went wrong</h2><p className="mb-6 mt-2 max-w-md text-gray-500">We encountered an unexpected error. Please try refreshing the page.</p><button type="button" onClick={reset} className="flex items-center gap-2 rounded-lg bg-brand-red px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-red-dark"><RefreshCw size={18} />Try Again</button></div>;
}
