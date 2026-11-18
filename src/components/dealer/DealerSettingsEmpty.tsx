"use client";

import { Store } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * A client wrapper so the server route can render the empty state without
 * passing it an icon: `EmptyState` is a client component, and a component
 * (a function) cannot cross the server/client boundary as a prop.
 */
export function DealerSettingsEmpty() {
  return (
    <EmptyState
      icon={Store}
      title="Showroom settings"
      description="Editing the showroom profile needs the dealership service, which this build does not include yet."
    />
  );
}
