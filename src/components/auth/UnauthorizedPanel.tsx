"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { ROLE_LABELS, isUserRole } from "@/lib/auth/roles";

export function UnauthorizedPanel() {
  const params = useSearchParams();
  const from = params.get("from");
  const required = (params.get("required") ?? "")
    .split(",")
    .filter(isUserRole)
    .map((role) => ROLE_LABELS[role]);
  const { role } = useAuth();

  return (
    <div className="max-w-lg mx-auto py-16 text-center">
      <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-semantic-error/10">
        <ShieldAlert size={26} className="text-semantic-error" />
      </span>
      <h1 className="text-2xl font-display font-bold text-ink-900 dark:text-white mb-2">
        You do not have access
      </h1>
      <p className="text-sm text-ink-500 dark:text-ink-300 mb-2">
        {from ? `${from} requires ` : "This area requires "}
        {required.length ? required.join(" or ") : "a higher access tier"}.
      </p>
      <p className="text-xs text-ink-400 mb-8">
        You are signed in as {ROLE_LABELS[role]}.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-white"
        >
          Back to dashboard
        </Link>
        <Link
          href="/auth/login"
          className="inline-flex h-10 items-center rounded-xl border border-ink-200 dark:border-ink-700 px-4 text-sm font-semibold text-ink-700 dark:text-ink-200"
        >
          Switch account
        </Link>
      </div>
    </div>
  );
}
