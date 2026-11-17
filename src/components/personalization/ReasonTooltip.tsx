"use client";

import { useEffect, useRef, useState } from "react";
import { Info, Sparkles } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

/**
 * Explains why a vehicle was recommended. Closes on outside click and Escape,
 * and the button reports its own expanded state.
 */
export function ReasonTooltip({ reason, label = "Why this car?" }: { reason: string; label?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <span ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 text-[10px] font-medium text-aurora-purple bg-aurora-purple/5 px-2 py-1 rounded-lg border border-aurora-purple/10 hover:bg-aurora-purple/10 transition-colors"
      >
        <Icon icon={Info} size={10} />
        {label}
      </button>

      {isOpen && (
        <span className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-ink-900 text-white text-xs rounded-xl shadow-lift z-50 block border border-ink-700">
          <span className="flex items-center gap-1.5 mb-1.5 text-aurora-purple font-bold uppercase tracking-wider text-[9px]">
            <Icon icon={Sparkles} size={10} /> Why you are seeing this
          </span>
          <span className="leading-relaxed text-ink-200 block">{reason}</span>
        </span>
      )}
    </span>
  );
}
