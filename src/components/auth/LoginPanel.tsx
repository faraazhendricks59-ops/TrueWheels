"use client";

import { useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { CardSkeleton } from "./CardSkeleton";
import { RoleSwitcher } from "./RoleSwitcher";
import { useAuth } from "@/components/providers/AuthProvider";
import { ROLE_LABELS } from "@/lib/auth/roles";

export function LoginPanel() {
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/dashboard";
  const { user, role, isLoading, isLiveAuth } = useAuth();

  return (
    <div className="max-w-md mx-auto py-16">
      <h1 className="text-2xl font-display font-bold text-ink-900 dark:text-white mb-2">Sign in</h1>
      <p className="text-sm text-ink-500 dark:text-ink-300 mb-8">
        {isLiveAuth
          ? "Sign in to continue."
          : "Firebase credentials are not configured yet, so sign-in runs in demo mode."}
      </p>

      {isLoading ? (
        <CardSkeleton />
      ) : user ? (
        <div className="rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-6">
          <p className="text-sm text-ink-700 dark:text-ink-200">
            Signed in as <strong>{user.name}</strong> · {ROLE_LABELS[role]}
          </p>
          <a
            href={redirect}
            className="mt-4 inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-white"
          >
            Continue
          </a>
        </div>
      ) : (
        <RoleSwitcher redirect={redirect} />
      )}

      <p className="mt-6 flex items-start gap-2 text-xs text-ink-400">
        <ShieldCheck size={14} className="mt-0.5 flex-shrink-0" />
        Sessions are signed server-side. The demo issuer is disabled in production builds.
      </p>
    </div>
  );
}
