"use client";

import { useState } from "react";
import { Check, HelpCircle, X } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { useToast } from "@/components/ui/Toast";
import { useEvents } from "@/components/providers/EventsProvider";
import { RSVP_LABELS, type RsvpStatus } from "@/lib/events";

const OPTIONS: { status: Exclude<RsvpStatus, "none">; icon: typeof Check }[] = [
  { status: "going", icon: Check },
  { status: "interested", icon: HelpCircle },
  { status: "not_going", icon: X },
];

const TRIGGER_VARIANT: Record<RsvpStatus, "primary" | "secondary" | "outline"> = {
  going: "primary",
  interested: "secondary",
  not_going: "outline",
  none: "primary",
};

/**
 * The reader's own RSVP.
 *
 * The brief's version ran a 500ms timer and then answered with a `variant: "trust"`
 * toast — which renders a shield beside "Verified Action" — reading "Event ID:
 * #EVT-…. RSVP logged" and "We'll remind you before the event". There is no event id
 * to log against, nothing logs it, and no notification service exists to send a
 * reminder, so both lines were false and the second made a promise the product cannot
 * keep.
 *
 * The real version writes the reader's own answer to this device, through the events
 * provider. The menu closes immediately and the choice survives a reload. The note
 * underneath says plainly that the answer is local and that no reminder will come.
 */
export function RSVPButton({ eventId }: { eventId: string }) {
  const { rsvpFor, setRsvp } = useEvents();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const status = rsvpFor(eventId);
  const label = status === "none" ? "RSVP" : RSVP_LABELS[status];
  const StatusIcon = status === "none" ? Check : OPTIONS.find((o) => o.status === status)?.icon ?? Check;

  const handleSelect = (next: Exclude<RsvpStatus, "none">) => {
    setRsvp(eventId, next);
    setIsOpen(false);
    toast({
      variant: "success",
      title: `Saved: ${RSVP_LABELS[next].toLowerCase()}`,
      description: "Your answer is stored in this browser only. No one else can see it, and no reminder will be sent.",
    });
  };

  return (
    <div className="relative">
      <SmartButton
        featureKey="events.rsvp_toggle"
        variant={TRIGGER_VARIANT[status]}
        className="w-full !h-11"
        onClick={() => setIsOpen((open) => !open)}
        leftIcon={StatusIcon}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {label}
      </SmartButton>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div
            role="menu"
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl shadow-lift overflow-hidden z-50"
          >
            <div className="p-1">
              {OPTIONS.map((option) => {
                const OptionIcon = option.icon;
                const isSelected = status === option.status;
                return (
                  <button
                    key={option.status}
                    type="button"
                    role="menuitemradio"
                    aria-checked={isSelected}
                    onClick={() => handleSelect(option.status)}
                    className={clsx(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors text-left",
                      isSelected
                        ? "bg-brand/10 text-brand font-semibold"
                        : "text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800",
                    )}
                  >
                    <Icon icon={OptionIcon} size={14} />
                    {RSVP_LABELS[option.status]}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
