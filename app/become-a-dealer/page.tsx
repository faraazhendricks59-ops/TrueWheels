import type { Metadata } from "next";
import { BecomeADealerContent } from "@/components/dealer-application/BecomeADealerContent";

export const metadata: Metadata = {
  title: "Become a Verified Dealer | TrueWheels",
  description:
    "Apply to join TrueWheels as a verified dealer and access the full dealer CRM, analytics, and marketplace.",
};

export default function BecomeADealerPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <BecomeADealerContent />
    </main>
  );
}
