"use client";

import { useState } from "react";
import { MessageCircle, Copy, Check } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { whatsAppShareLink, enquiryMessage } from "@/lib/contact";
import type { DemoVehicle } from "@/lib/demo/vehicles";

/**
 * Opens WhatsApp with the enquiry written out, ready to send to whoever the
 * buyer chooses.
 *
 * The brief for this component took a seller phone number and opened a chat
 * with it. No seller phone number exists in this project, so the number in the
 * brief was an invention, and opening a chat with an invented number would send
 * a stranger a message about a car they have never listed. The link here
 * therefore leaves the recipient unset, which is what WhatsApp supports for a
 * shareable message, and the buyer picks who receives it.
 *
 * The message is also offered as copyable text, because WhatsApp links behave
 * differently across desktop, mobile and the web client, and a buyer who cannot
 * get the link to open should still be able to use the wording.
 */
export function WhatsAppDeepLink({ vehicle }: { vehicle: DemoVehicle }) {
  const [copied, setCopied] = useState(false);
  const message = enquiryMessage(vehicle);

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
    <div className="space-y-2">
      <SmartButton
        featureKey="contact.whatsapp"
        variant="secondary"
        className="w-full min-h-[44px]"
        leftIcon={MessageCircle}
        onClick={() => window.open(whatsAppShareLink(message), "_blank", "noopener")}
      >
        Share on WhatsApp
      </SmartButton>
      <button
        type="button"
        onClick={copy}
        className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg border border-ink-200 dark:border-ink-700 text-xs font-semibold text-ink-600 dark:text-ink-300 hover:border-brand/40 hover:text-brand transition-colors"
      >
        <Icon icon={copied ? Check : Copy} size={13} />
        {copied ? "Enquiry copied" : "Copy the enquiry text"}
      </button>
      <p className="text-[10px] text-ink-400 leading-relaxed text-center">
        Opens WhatsApp with the message written and no recipient set, so you choose
        who receives it. TrueWheels does not hold the seller&apos;s number.
      </p>
    </div>
  );
}
