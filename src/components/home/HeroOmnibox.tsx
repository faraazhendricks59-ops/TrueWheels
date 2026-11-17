"use client";

import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { SmartButton } from "@/components/ui/SmartButton";
import { AIOmnibox } from "@/components/search/AIOmnibox";

/** Chips are plain marketplace queries; the omnibox searches inline. */
const QUICK_CHIPS = [
  { label: "Under R200k", href: "/marketplace?max=200000" },
  { label: "Bakkies", href: "/marketplace?q=bakkie" },
  { label: "SUVs", href: "/marketplace?q=suv" },
  { label: "GTI", href: "/marketplace?q=gti" },
  { label: "Near me", href: "/marketplace?near=1", icon: MapPin },
];

export function HeroOmnibox() {
  const router = useRouter();

  return (
    <div className="w-full max-w-4xl mx-auto text-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-ink-900 dark:text-white mb-4 tracking-tight">
        The automotive <span className="aurora-text">operating system</span>
      </h1>
      <p className="text-base sm:text-lg text-ink-500 dark:text-ink-300 mb-8 max-w-2xl mx-auto">
        Search, buy, sell, bid and connect. South Africa&apos;s vehicle ecosystem, powered by AI.
      </p>

      <AIOmnibox />

      <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
        {QUICK_CHIPS.map((chip) => (
          <SmartButton
            key={chip.label}
            featureKey="home.quick_chip"
            variant="secondary"
            size="sm"
            className="!rounded-full !h-9 !px-4 !text-xs"
            onClick={() => router.push(chip.href)}
          >
            {chip.label}
          </SmartButton>
        ))}
      </div>
    </div>
  );
}
