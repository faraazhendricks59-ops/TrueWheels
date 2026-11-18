"use client";

import { useState } from "react";
import { Camera, FileText, Key, ShieldAlert } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { PAYMENT_SAFETY_WARNING } from "@/lib/secure-pay";

/**
 * What to do at handover, and what never to do.
 *
 * The brief's version was an OTP flow: it sent a code to a masked number, asked the
 * reader to type it in, and only then released funds. There is no OTP service here,
 * so the code would be theatre — but the deeper problem is that the flow teaches the
 * wrong habit. It trains a person to enter a one-time code to "release" money, and
 * the single most common way a South African bank customer is defrauded is being
 * persuaded to read out or enter an OTP. A page that normalises that step makes the
 * next real request look ordinary.
 *
 * It also claimed the photo was "timestamped and geotagged" and that an "OTP
 * confirmed via SMS" — neither of which this project does.
 *
 * So this is not a verification flow. It is what to collect at handover so that the
 * buyer holds their own evidence, and a plain warning about the code that no honest
 * party will ask for.
 */
export function HandoverVerification() {
  const [open, setOpen] = useState<string | null>("evidence");

  const sections: { id: string; icon: typeof Camera; title: string; body: string }[] = [
    {
      id: "evidence",
      icon: Camera,
      title: "Take your own photographs",
      body: "Photograph the vehicle from every side, the odometer, the registration certificate, the seller's ID, and the signed sale agreement. Keep these yourself — they are worth more than anything a page records, because they are yours and no one can change them.",
    },
    {
      id: "documents",
      icon: FileText,
      title: "Collect the paperwork",
      body: "Get the registration certificate in the seller's name, a signed sale agreement with the price and date, the proof of payment, and the seller's contact details. If the vehicle is financed, the bank's settlement letter. Without the registration certificate you cannot transfer ownership.",
    },
    {
      id: "keys",
      icon: Key,
      title: "Take the keys and the transfer",
      body: "Take every key, including spares, and any alarm or immobiliser codes. Agree the date for the change of ownership at a registering authority, and make sure it happens. Until that is done, the vehicle is still registered to the seller.",
    },
  ];

  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
          <Icon icon={Key} size={18} />
        </div>
        <div>
          <h3 className="text-lg font-display font-bold text-ink-900 dark:text-white">
            At handover
          </h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            What to collect so the evidence is yours.
          </p>
        </div>
      </div>

      {/* The warning first, before anything that could be mistaken for a process. */}
      <div className="mb-6 p-4 rounded-xl bg-semantic-error/5 border border-semantic-error/25 flex items-start gap-3">
        <Icon icon={ShieldAlert} size={18} className="text-semantic-error mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-ink-900 dark:text-white">
            No one legitimate will ask you for a one-time code
          </p>
          <p className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed mt-1">
            {PAYMENT_SAFETY_WARNING}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((section) => {
          const isOpen = open === section.id;
          return (
            <div
              key={section.id}
              className="rounded-xl border border-ink-100 dark:border-ink-800 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : section.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-3 p-3.5 text-left min-h-[44px] hover:bg-ink-50 dark:hover:bg-ink-950 transition-colors"
              >
                <Icon icon={section.icon} size={16} className="text-ink-400 flex-shrink-0" />
                <span className="flex-1 text-sm font-bold text-ink-900 dark:text-white">
                  {section.title}
                </span>
              </button>
              {isOpen && (
                <p className="px-3.5 pb-3.5 text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
                  {section.body}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-[10px] text-ink-400 leading-relaxed">
        TrueWheels does not verify handover, does not hold funds, and cannot release
        anything. Nothing on this page changes what happens between you and the seller.
      </p>
    </div>
  );
}
