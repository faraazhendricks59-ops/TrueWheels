"use client";

import { Users } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

const SECTIONS = {
  users: { icon: Users, title: "User management", description: "Review accounts, roles and verification status." },
} as const;

export function AdminSection({ variant }: { variant: keyof typeof SECTIONS }) {
  const { icon, title, description } = SECTIONS[variant];
  return (
    <div className="py-16 flex justify-center">
      <EmptyState icon={icon} title={title} description={description} />
    </div>
  );
}
