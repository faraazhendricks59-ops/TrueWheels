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
    <div className="mx-auto w-full max-w-4xl text-center">
      {/* The hero had no <h1> at all — the first heading on the home page was an
          <h2> further down — and its only line was "powered by AI", which tells a
          visitor nothing about what the site is for. A marketplace leads with what
          you can do here, in the largest type on the page. */}
      <h1 className="mx-auto max-w-3xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-[42px] md:leading-[1.1]">
        Find your next car
      </h1>
      <p className="mx-auto mb-8 mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
        Search listings from dealers and private sellers across South Africa.
      </p>

      <AIOmnibox />

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {QUICK_CHIPS.map((chip) => (
          <SmartButton
            key={chip.label}
            featureKey="home.quick_chip"
            variant="secondary"
            size="sm"
            className="!h-8 !rounded-full !border-white/25 !bg-white/10 !px-3.5 !text-xs !text-white hover:!bg-white/20"
            onClick={() => router.push(chip.href)}
          >
            {chip.label}
          </SmartButton>
        ))}
      </div>
    </div>
  );
}
