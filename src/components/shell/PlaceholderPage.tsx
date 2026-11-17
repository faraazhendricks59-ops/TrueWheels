"use client";

import { MessageSquare, User } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

const VARIANTS = {
  messages: {
    icon: MessageSquare,
    title: "No messages yet",
    description: "Conversations with sellers and buyers will appear here once you start one.",
  },
  profile: {
    icon: User,
    title: "Your profile",
    description: "Manage your details, saved vehicles and verification status here.",
  },
} as const;

/**
 * The icon component is chosen inside this client component rather than passed
 * in from the server page: a component reference is a function and cannot cross
 * the server/client boundary.
 */
export function PlaceholderPage({ variant }: { variant: keyof typeof VARIANTS }) {
  const { icon, title, description } = VARIANTS[variant];
  return (
    <div className="py-16 flex justify-center">
      <EmptyState icon={icon} title={title} description={description} />
    </div>
  );
}
