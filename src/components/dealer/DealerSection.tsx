"use client";

import { Car, Briefcase } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

const SECTIONS = {
  inventory: { icon: Car, title: "Inventory", description: "Manage the vehicles on your forecourt." },
  leads: { icon: Briefcase, title: "Leads & CRM", description: "Track enquiries and follow-ups from buyers." },
} as const;

export function DealerSection({ variant }: { variant: keyof typeof SECTIONS }) {
  const { icon, title, description } = SECTIONS[variant];
  return (
    <div className="py-16 flex justify-center">
      <EmptyState icon={icon} title={title} description={description} />
    </div>
  );
}
