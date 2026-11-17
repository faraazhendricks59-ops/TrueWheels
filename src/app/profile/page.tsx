import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";

export const metadata: Metadata = { title: "Profile | TrueWheels" };

export default function ProfilePage() {
  return <PlaceholderPage variant="profile" />;
}
