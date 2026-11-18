"use client";

import { useState } from "react";
import { MessageSquare, Tag, Calendar } from "lucide-react";
import { SmartButton } from "@/components/ui/SmartButton";
import { useToast } from "@/components/ui/Toast";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { MakeOfferSheet } from "./MakeOfferSheet";
import { TestDriveSheet } from "./TestDriveSheet";
import { WhatsAppDeepLink } from "./WhatsAppDeepLink";
import type { DemoVehicle } from "@/lib/demo/vehicles";
import type { SellerIdentity } from "@/lib/seller";

/**
 * The ways a buyer can approach this listing.
 *
 * The brief had this bar choose between a WhatsApp chat and an in-app message
 * depending on whether a seller phone number was present, and route the offer and
 * test-drive flows into services that report success. No phone number, message
 * service, offer service or booking service exists, so each control here either
 * prepares something the buyer can send themselves or says plainly that it is not
 * connected.
 */
export function ContactActionBar({
  vehicle,
  seller,
  /**
   * One row of primary actions, for the fixed mobile bar where vertical space is
   * scarce. The WhatsApp link and the message notice are left out: both are
   * reachable from the page itself, and a bar four rows tall covers half the
   * screen it is meant to help someone read.
   */
  compact = false,
}: {
  vehicle: DemoVehicle;
  seller: SellerIdentity;
  compact?: boolean;
}) {
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const { toast } = useToast();

  if (compact) {
    return (
      <>
        <div className="flex items-center gap-2">
          <SmartButton
            featureKey="contact.make_offer"
            className="flex-1 min-h-[44px] !text-xs"
            leftIcon={Tag}
            onClick={() => setIsOfferOpen(true)}
          >
            Prepare offer
          </SmartButton>
          <SmartButton
            featureKey="contact.test_drive"
            variant="secondary"
            className="flex-1 min-h-[44px] !text-xs"
            leftIcon={Calendar}
            onClick={() => setIsTestDriveOpen(true)}
          >
            Test drive
          </SmartButton>
        </div>
        <MakeOfferSheet
          isOpen={isOfferOpen}
          onClose={() => setIsOfferOpen(false)}
          vehicle={vehicle}
        />
        <TestDriveSheet
          isOpen={isTestDriveOpen}
          onClose={() => setIsTestDriveOpen(false)}
          vehicle={vehicle}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <WhatsAppDeepLink vehicle={vehicle} />

        <div className="grid grid-cols-2 gap-2">
          <FeatureGate featureKey="contact.make_offer">
            <SmartButton
              featureKey="contact.make_offer"
              variant="secondary"
              className="w-full min-h-[44px] !text-xs"
              leftIcon={Tag}
              onClick={() => setIsOfferOpen(true)}
            >
              Prepare offer
            </SmartButton>
          </FeatureGate>

          <FeatureGate featureKey="contact.test_drive">
            <SmartButton
              featureKey="contact.test_drive"
              variant="secondary"
              className="w-full min-h-[44px] !text-xs"
              leftIcon={Calendar}
              onClick={() => setIsTestDriveOpen(true)}
            >
              Test drive
            </SmartButton>
          </FeatureGate>
        </div>

        <SmartButton
          featureKey="contact.message"
          variant="secondary"
          className="w-full min-h-[44px] !text-xs"
          leftIcon={MessageSquare}
          onClick={() =>
            toast({
              variant: "info",
              title: "Messaging is not connected",
              description:
                "There is no message service behind this button, so nothing was sent. Use the copyable enquiry above.",
            })
          }
        >
          Message in app
        </SmartButton>
      </div>

      <MakeOfferSheet
        isOpen={isOfferOpen}
        onClose={() => setIsOfferOpen(false)}
        vehicle={vehicle}
      />
      <TestDriveSheet
        isOpen={isTestDriveOpen}
        onClose={() => setIsTestDriveOpen(false)}
        vehicle={vehicle}
      />
    </>
  );
}
