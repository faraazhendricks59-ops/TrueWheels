"use client";

import { useState } from "react";
import { Car, Tag, Gavel, Wrench, Users, Building2, Check, Sparkles } from "lucide-react";
import { SmartButton } from "@/components/ui/SmartButton";

const INTENTS = [
  { id: "buy", label: "Buy Cars", icon: Car },
  { id: "sell", label: "Sell Cars", icon: Tag },
  { id: "auction", label: "Bid & Auction", icon: Gavel },
  { id: "parts", label: "Parts & Spares", icon: Wrench },
  { id: "community", label: "Community", icon: Users },
  { id: "dealer", label: "Dealer Tools", icon: Building2 },
];

interface IntentGateProps {
  onComplete: (intents: string[]) => void;
}

export function IntentGate({ onComplete }: IntentGateProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const selectAll = () => {
    setSelected(selected.length === INTENTS.length ? [] : INTENTS.map((i) => i.id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-xl noise">
      <div className="w-full max-w-3xl glass rounded-3xl p-8 md:p-12 shadow-lift animate-rise">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aurora-purple/10 border border-aurora-purple/30 text-aurora-purple text-[10px] font-bold uppercase tracking-widest mb-4">
            <Sparkles size={10} /> Personalize Your Experience
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-ink-900 dark:text-white mb-3">
            How will you use TrueWheels?
          </h2>
          <p className="text-ink-500 dark:text-ink-300 text-sm">
            Select all that apply. We&apos;ll tailor the cockpit for you.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {INTENTS.map((intent) => {
            const Icon = intent.icon;
            const isSelected = selected.includes(intent.id);
            return (
              <button
                key={intent.id}
                type="button"
                onClick={() => toggle(intent.id)}
                aria-pressed={isSelected}
                className={`relative p-5 rounded-2xl border-2 text-left transition-all ease-swift ${
                  isSelected
                    ? "border-brand bg-brand/5 shadow-glow"
                    : "border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-ink-300 dark:hover:border-ink-600"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                    isSelected
                      ? "bg-brand text-white"
                      : "bg-ink-50 dark:bg-ink-800 text-ink-600 dark:text-ink-300"
                  }`}
                >
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <h3 className="font-semibold text-ink-900 dark:text-white text-sm">{intent.label}</h3>
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-brand rounded-full flex items-center justify-center text-white">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={selectAll}
            className="text-xs font-semibold text-ink-400 hover:text-brand transition-colors"
          >
            {selected.length === INTENTS.length ? "Clear Selection" : "✨ Unlock Full Access: All of the Above"}
          </button>

          {/* onboarding.intent_gate gates the whole gate, so it must default ON.
              Using a kill-switch flag here would make onboarding unreachable. */}
          <SmartButton
            featureKey="onboarding.intent_gate"
            onClick={() => onComplete(selected)}
            disabled={selected.length === 0}
            className="w-full max-w-xs h-12 text-base"
          >
            Continue to Platform
          </SmartButton>
        </div>
      </div>
    </div>
  );
}
