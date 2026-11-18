import type { Metadata } from "next";
import { HomeCockpit } from "@/components/home/HomeCockpit";

export const metadata: Metadata = {
  title: "TrueWheels | South Africa’s vehicle marketplace",
  description:
    "Search, buy, sell, bid and connect. South Africa's vehicle marketplace, powered by AI.",
};

export default function HomePage() {
  return <HomeCockpit />;
}
