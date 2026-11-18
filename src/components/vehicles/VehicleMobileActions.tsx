"use client";

import { useState } from "react";
import { Tag, Calendar, Share2 } from "lucide-react";
import { SmartButton } from "@/components/ui/SmartButton";
import { DigitalGarageButton } from "./DigitalGarageButton";
import { MakeOfferSheet } from "./MakeOfferSheet";
import { TestDriveSheet } from "./TestDriveSheet";
import { ShareSheet } from "./ShareSheet";
import type { DemoVehicle } from "@/lib/demo/vehicles";

/**
 * The actions in the fixed bar at the bottom of a vehicle page on a phone.
 *
 * The brief's StickyMobileCTA offered Message and Call. There is no messaging
 * service and no seller phone number, so both would have done nothing. These are
 * the four actions that do something: save the vehicle, share the listing, write
 * an offer and request a test drive.
 *
 * It is a single row because the bar is fixed. A bar that stacks four rows
 * covers a quarter of the screen it exists to help someone read, and the price
 * is already shown above it. Icon buttons carry accessible names, and every
 * control meets the 44px touch target.
 */
export function VehicleMobileActions({ vehicle }: { vehicle: DemoVehicle }) {
  const [offerOpen, setOfferOpen] = useState(false);
  const [testDriveOpen, setTestDriveOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <DigitalGarageButton vehicleId={vehicle.id} variant="icon" />

        <button
          type="button"
          onClick={() => setShareOpen(true)}
          aria-label="Share this vehicle"
          className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 text-ink-500 dark:text-ink-400 hover:border-brand/40 hover:text-brand transition-colors flex-shrink-0"
        >
          <Share2 size={17} strokeWidth={1.75} aria-hidden="true" />
        </button>

        <SmartButton
          featureKey="contact.make_offer"
          variant="secondary"
          className="flex-1 min-h-[44px] !text-xs !px-2"
          leftIcon={Tag}
          onClick={() => setOfferOpen(true)}
        >
          Offer
        </SmartButton>

        <SmartButton
          featureKey="contact.test_drive"
          className="flex-1 min-h-[44px] !text-xs !px-2"
          leftIcon={Calendar}
          onClick={() => setTestDriveOpen(true)}
        >
          Test drive
        </SmartButton>
      </div>

      <MakeOfferSheet isOpen={offerOpen} onClose={() => setOfferOpen(false)} vehicle={vehicle} />
      <TestDriveSheet
        isOpen={testDriveOpen}
        onClose={() => setTestDriveOpen(false)}
        vehicle={vehicle}
      />
      <ShareSheet isOpen={shareOpen} onClose={() => setShareOpen(false)} vehicle={vehicle} />
    </>
  );
}
