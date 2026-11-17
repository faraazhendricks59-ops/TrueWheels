"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";

export default function SwipeDemoPage() {
  const router = useRouter();
  const [log, setLog] = useState<string[]>([]);
  const add = (entry: string) => setLog((l) => [entry, ...l].slice(0, 5));

  const ref = useSwipeGesture({
    onSwipeLeft: () => add("swiped left"),
    onSwipeRight: () => add("swiped right"),
    threshold: 60,
  });

  return (
    <div className="py-10 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Swipe demo</h1>
      <div
        ref={ref}
        data-testid="swipe-zone"
        className="h-40 rounded-2xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-sm text-ink-500 select-none"
      >
        Swipe here
      </div>
      <ul className="mt-4 text-sm" data-testid="swipe-log">
        {log.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
      <button type="button" className="mt-6 underline text-sm" onClick={() => router.push("/marketplace")}>
        Go to marketplace
      </button>
    </div>
  );
}
