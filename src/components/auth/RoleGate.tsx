"use client";

import { ReactNode } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import type { UserRole } from "@/lib/auth/roles";

interface RoleGateProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

/**
 * Renders children only for the listed tiers. Distinct from FeatureGate, which
 * reflects platform-wide switches rather than who the viewer is.
 */
export function RoleGate({ children, allowedRoles, fallback = null }: RoleGateProps) {
  const { role, isLoading } = useAuth();

  // Render nothing while the session resolves, so protected UI never flashes
  // for a user who turns out not to have the role.
  if (isLoading) return null;

  if (!allowedRoles.includes(role)) return <>{fallback}</>;

  return <>{children}</>;
}
