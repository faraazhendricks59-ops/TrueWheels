import type { Metadata } from "next";
import { SavedSearchesManager } from "@/components/saved-searches/SavedSearchesManager";

export const metadata: Metadata = {
  title: "Saved searches | TrueWheels",
  description: "Manage your saved searches and the alerts they send you.",
};

export default function SavedSearchesPage() {
  // The root layout already provides the shell, so this page adds none of its
  // own: wrapping again would nest a second header.
  return <SavedSearchesManager />;
}
