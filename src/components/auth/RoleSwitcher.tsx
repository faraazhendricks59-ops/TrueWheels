"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { SmartButton } from "@/components/ui/SmartButton";
import { useAuth } from "@/components/providers/AuthProvider";
import { ASSIGNABLE_ROLES, ROLE_LABELS } from "@/lib/auth/roles";

export function RoleSwitcher({ redirect }: { redirect: string }) {
  const { setRole } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const choose = (role: (typeof ASSIGNABLE_ROLES)[number]) => {
    startTransition(async () => {
      await setRole(role);
      router.push(redirect);
      router.refresh();
    });
  };

  return (
    <div className="rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-6 space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Continue as</p>
      {ASSIGNABLE_ROLES.map((role) => (
        <SmartButton
          key={role}
          featureKey="auth.demo_role_switch"
          variant="secondary"
          className="w-full"
          isLoading={isPending}
          onClick={() => choose(role)}
        >
          {ROLE_LABELS[role]}
        </SmartButton>
      ))}
    </div>
  );
}
