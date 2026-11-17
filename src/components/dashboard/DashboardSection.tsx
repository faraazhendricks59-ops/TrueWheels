"use client";

import { Car, Gavel, MessageSquare, Heart, Settings } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

const SECTIONS = {
  listings: { icon: Car, title: "My Listings", description: "Vehicles you have listed will appear here." },
  bids: { icon: Gavel, title: "Auctions & Bids", description: "Your active bids and auction activity will appear here." },
  messages: { icon: MessageSquare, title: "Messages", description: "Conversations with buyers and sellers will appear here." },
  saved: { icon: Heart, title: "Saved Vehicles", description: "Vehicles you save will appear in your Digital Garage." },
  settings: { icon: Settings, title: "Settings", description: "Manage your account, notifications and verification." },
} as const;

export function DashboardSection({ variant }: { variant: keyof typeof SECTIONS }) {
  const { icon, title, description } = SECTIONS[variant];
  return (
    <div className="py-16 flex justify-center">
      <EmptyState icon={icon} title={title} description={description} />
    </div>
  );
}
