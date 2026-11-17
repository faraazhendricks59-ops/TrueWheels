"use client";

import { useRouter } from "next/navigation";
import { Command, MapPin, Search, Sparkles } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/motion/Magnetic";
import { SmartButton } from "@/components/ui/SmartButton";
import { useCommandPalette } from "@/components/providers/CommandPaletteProvider";

/** Chips are plain marketplace queries; the omnibox itself opens the palette. */
const QUICK_CHIPS = [
  { label: "Under R200k", href: "/marketplace?max=200000" },
  { label: "Bakkies", href: "/marketplace?q=bakkie" },
  { label: "SUVs", href: "/marketplace?q=suv" },
  { label: "GTI", href: "/marketplace?q=gti" },
  { label: "Near me", href: "/marketplace?near=1", icon: MapPin },
];

export function HeroOmnibox() {
  const { open } = useCommandPalette();
  const router = useRouter();

  return (
    <div className="w-full max-w-4xl mx-auto text-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-ink-900 dark:text-white mb-4 tracking-tight">
        The automotive <span className="aurora-text">operating system</span>
      </h1>
      <p className="text-base sm:text-lg text-ink-500 dark:text-ink-300 mb-8 max-w-2xl mx-auto">
        Search, buy, sell, bid and connect. South Africa&apos;s vehicle ecosystem, powered by AI.
      </p>

      <Magnetic strength={0.05}>
        <button
          type="button"
          onClick={open}
          aria-label="Search the marketplace"
          className="group relative w-full h-16 flex items-center gap-3 sm:gap-4 px-4 sm:px-6 rounded-2xl bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 shadow-lift hover:shadow-glow hover:border-brand/30 transition-all ease-swift text-left"
        >
          <Icon icon={Search} size={20} className="text-ink-400 group-hover:text-brand transition-colors flex-shrink-0" />
          <span className="flex-1 text-base sm:text-lg text-ink-400 truncate">
            Search make, model or keyword
          </span>

          <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-50 dark:bg-ink-800 border border-ink-100 dark:border-ink-700 flex-shrink-0">
            <Icon icon={Sparkles} size={12} className="text-aurora-purple" />
            <span className="text-xs font-semibold text-ink-500">Ask AI</span>
          </span>

          <span className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-ink-50 dark:bg-ink-800 border border-ink-100 dark:border-ink-700 flex-shrink-0">
            <Icon icon={Command} size={10} className="text-ink-400" />
            <span className="text-[10px] font-mono font-semibold text-ink-400">K</span>
          </span>
        </button>
      </Magnetic>

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
