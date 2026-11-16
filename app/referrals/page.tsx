import type { Metadata } from "next";
import { ReferralDashboard } from "@/components/referrals/ReferralDashboard";

export const metadata: Metadata = {
  title: "Refer & Earn | TrueWheels",
  description: "Invite friends to TrueWheels and you both earn listing credits.",
  // Personal referral stats should not appear in search results.
  robots: { index: false, follow: true },
};

export default function ReferralsPage() {
  return (
    <div className="min-h-screen bg-surface-grey">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <ReferralDashboard />
      </div>
    </div>
  );
}
