import { HTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type BadgeVariant = "live" | "verified" | "featured" | "sold" | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

/**
 * Tinted status pill.
 *
 * Text/background pairs clear WCAG AA (4.5:1) in both themes. Solid semantic
 * fills were avoided deliberately — white on the brand's success/warning greens
 * and ambers lands near 2:1 and fails.
 */
const variants: Record<BadgeVariant, string> = {
  live: "bg-brand-red/10 text-brand-red",
  verified: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  featured: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  sold: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  neutral: "bg-neutral-hover text-neutral-muted",
};

export function Badge({ variant = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
          variants[variant],
          className,
        ),
      )}
      {...props}
    >
      {children}
    </span>
  );
}
