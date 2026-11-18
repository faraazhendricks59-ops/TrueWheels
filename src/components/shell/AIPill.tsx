"use client";

import { Sparkles } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/motion/Magnetic";
import { SmartButton } from "@/components/ui/SmartButton";
import { useConcierge } from "@/components/providers/ConciergeProvider";

export function AIPill() {
  const { open } = useConcierge();

  return (
    <Magnetic strength={0.15}>
      <SmartButton
        featureKey="ai.concierge"
        data-tour="ai-concierge"
        size="sm"
        onClick={open}
        aria-label="Open the AI concierge"
        variant="outline"
        className="!border-ink-200 dark:!border-ink-700"
      >
        <span className="flex items-center gap-1.5 font-semibold">
          <Icon icon={Sparkles} size={14} />
          <span className="hidden sm:inline">Ask AI</span>
        </span>
      </SmartButton>
    </Magnetic>
  );
}
