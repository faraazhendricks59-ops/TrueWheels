import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";

export const metadata: Metadata = { title: "Messages | TrueWheels" };

export default function MessagesPage() {
  return <PlaceholderPage variant="messages" />;
}
