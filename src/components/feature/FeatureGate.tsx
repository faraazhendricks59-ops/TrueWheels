"use client";

import { ReactNode } from "react";
import { useFeatureFlags, type FeatureKey } from "@/lib/feature-flags";

/**
 * Renders children only when the feature is enabled. Use for navigation entries
 * and static blocks; SmartButton already applies its own gating for actions.
 */
export function FeatureGate({
  featureKey,
  children,
  fallback = null,
}: {
  featureKey: FeatureKey;
  children: ReactNode;
  /** Rendered instead of the children when the feature is off. */
  fallback?: ReactNode;
}) {
  const { isEnabled } = useFeatureFlags();
  if (!isEnabled(featureKey)) return <>{fallback}</>;
  return <>{children}</>;
}
