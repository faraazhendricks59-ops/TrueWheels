"use client";

import { Sparkles } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/motion/Magnetic";
import { SmartButton } from "@/components/ui/SmartButton";

export function AIPill() {
  return (
    <Magnetic strength={0.15}>
      <SmartButton
        featureKey="ai.concierge"
        size="sm"
        className="!bg-transparent !border-0 !shadow-none hover:!shadow-none relative overflow-hidden group"
      >
        <span className="absolute inset-0 aurora-bg opacity-90 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
        <span className="relative flex items-center gap-1.5 text-white font-semibold">
          <Icon icon={Sparkles} size={14} className="text-white" />
          <span className="hidden sm:inline">Ask AI</span>
        </span>
      </SmartButton>
    </Magnetic>
  );
}
