import type { Metadata } from "next";
import { NetworkView } from "@/components/social/NetworkView";

export const metadata: Metadata = {
  title: "Your network | TrueWheels",
  description:
    "Your own activity on this device — viewed, saved and garaged vehicles — and the listings it suggests.",
};

export default function NetworkPage() {
  return <NetworkView />;
}
