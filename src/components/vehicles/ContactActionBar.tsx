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
}: {
  vehicle: DemoVehicle;
  seller: SellerIdentity;
}) {
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const { toast } = useToast();

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
