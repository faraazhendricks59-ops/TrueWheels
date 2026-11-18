"use client";

import { useMemo, useState } from "react";
import { Tag, Copy, Check, Info } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Sheet } from "@/components/ui/Sheet";
import { CurrencyInput } from "@/components/forms/SpecializedFields";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Toggles";
import { OFFER_GUIDANCE, offerMessage, type OfferDraft } from "@/lib/contact";
import type { DemoVehicle } from "@/lib/demo/vehicles";

interface MakeOfferSheetProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: DemoVehicle;
}

const zar = (value: number) => `R ${value.toLocaleString("en-ZA")}`;

/**
 * Writes an offer out so the buyer can send it themselves.
 *
 * The brief for this sheet submitted to a backend, then reported "Offer
 * Submitted Successfully", "has been sent to the seller" and "Offer ID:
 * #OFF-88291. Seller has 48h to respond." There is no offer service and no
 * seller, so every part of that was untrue, and the reference number was
 * invented.
 *
 * It also described the offer as a "Formal Offer" with agreement to
 * "Negotiation Terms" that do not exist. That matters beyond the missing
 * service: an offer that is accepted is a binding contract, so a buyer should
 * know they are making one, and should send it in a way that leaves them a copy.
 *
 * This sheet therefore produces the offer as text, states the conditions a
 * sensible offer carries, and says plainly that nothing has been sent.
 */
export function MakeOfferSheet({ isOpen, onClose, vehicle }: MakeOfferSheetProps) {
  const [amount, setAmount] = useState(Math.round(vehicle.price * 0.9));
  const [note, setNote] = useState("");
  const [position, setPosition] = useState<OfferDraft["position"]>("unsure");
  const [copied, setCopied] = useState(false);

  const message = useMemo(
    () => offerMessage(vehicle, { amount, position, note } satisfies OfferDraft),
    [vehicle, amount, position, note],
  );

  const lowOffer = amount > 0 && amount < vehicle.price * 0.8;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Prepare an offer" side="bottom">
      <div className="space-y-6 pb-8">
        <div className="p-4 bg-ink-50 dark:bg-ink-950 rounded-xl border border-ink-100 dark:border-ink-800">
          <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1">
            Vehicle
          </p>
          <p className="text-sm font-bold text-ink-900 dark:text-white">{vehicle.title}</p>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">
            Asking price:{" "}
            <span className="font-mono font-bold text-ink-700 dark:text-ink-200">
              {zar(vehicle.price)}
            </span>
          </p>
        </div>

        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-aurora-blue/5 border border-aurora-blue/20">
          <Icon icon={Info} size={14} className="text-aurora-blue flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed">
            This writes the offer out for you to send. Nothing is submitted from this
            page and no seller receives it, because TrueWheels has no offer service
            and holds no seller contact details.
          </p>
        </div>

        <div>
          <label
            htmlFor="offer-amount"
            className="text-xs font-semibold text-ink-600 dark:text-ink-300 uppercase tracking-wide block mb-2"
          >
            Your offer
          </label>
          <CurrencyInput value={amount} onChange={setAmount} id="offer-amount" />
          {lowOffer && (
            <p className="text-[10px] text-semantic-warning mt-1.5 flex items-center gap-1">
              <Icon icon={Tag} size={10} />
              Below 80% of the asking price. Sellers often decline these without a
              reply, so it is worth saying why your figure is what it is.
            </p>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-ink-400 uppercase tracking-wider">
            How you would pay
          </p>
          <div className="space-y-2.5">
            <Switch
              label="I can pay cash, with no finance"
              checked={position === "cash"}
              onChange={(value) => setPosition(value ? "cash" : "unsure")}
            />
            <Switch
              label="I have pre-approved vehicle finance"
              checked={position === "finance"}
              onChange={(value) => setPosition(value ? "finance" : "unsure")}
            />
          </div>
        </div>

        <Input
          label="Anything else to include (optional)"
          placeholder="e.g. I can collect this weekend"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="pt-2">
          <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">
            Before you send it
          </p>
          <ul className="space-y-1.5">
            {OFFER_GUIDANCE.map((line) => (
              <li
                key={line}
                className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1 before:h-1 before:rounded-full before:bg-ink-300 dark:before:bg-ink-600"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-ink-100 dark:border-ink-800">
          <div className="p-3 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800 mb-3">
            <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1.5">
              Your offer, ready to send
            </p>
            <pre className="text-[11px] text-ink-600 dark:text-ink-300 whitespace-pre-wrap font-sans leading-relaxed">
              {message}
            </pre>
          </div>
          <button
            type="button"
            onClick={copy}
            className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors"
          >
            <Icon icon={copied ? Check : Copy} size={14} />
            {copied ? "Offer copied" : "Copy the offer"}
          </button>
          <p className="text-[10px] text-center text-ink-400 mt-2">
            Send it to the seller through a channel you trust, and keep your copy.
          </p>
        </div>
      </div>
    </Sheet>
  );
}
