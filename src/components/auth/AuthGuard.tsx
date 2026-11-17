"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import type { UserRole } from "@/lib/auth/roles";
import { CardSkeleton } from "@/components/auth/CardSkeleton";

interface AuthGuardProps {
  children: ReactNode;
  /** Omit to allow any signed-in user. */
  allowedRoles?: UserRole[];
  fallback?: ReactNode;
}

export function AuthGuard({ children, allowedRoles, fallback }: AuthGuardProps) {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = Boolean(user);
  const hasRole = !allowedRoles || allowedRoles.includes(role);
  const isAuthorized = isAuthenticated && hasRole;

  useEffect(() => {
    if (isLoading || isAuthorized) return;
    if (!isAuthenticated) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    } else {
      router.replace("/unauthorized");
    }
  }, [isLoading, isAuthorized, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      fallback ?? (
        <div className="py-16 flex justify-center">
          <CardSkeleton />
        </div>
      )
    );
  }

  // Never render protected content while a redirect is pending.
  if (!isAuthorized) return null;

  return <>{children}</>;
}
