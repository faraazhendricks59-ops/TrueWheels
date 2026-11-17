import type { Metadata } from "next";
import { CompareManager } from "@/components/compare/CompareManager";

export const metadata: Metadata = {
  title: "Compare vehicles | TrueWheels",
  description: "Compare specifications side by side and see which listing offers the best value.",
};

export default function ComparePage() {
  // The root layout already renders the application shell, so this page adds
  // none of its own.
  return <CompareManager />;
}
