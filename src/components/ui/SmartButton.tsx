"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";
import { Loader2, Lock, type LucideIcon } from "lucide-react";
import { useFeatureFlags, FeatureKey } from "@/lib/feature-flags";
import { Icon } from "./Icon";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface SmartButtonProps {
  featureKey: FeatureKey;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  /**
   * Required in practice for `size="icon"`, which renders no text content.
   * Declared explicitly rather than spread through, so an accidental typo in a
   * prop name is a type error instead of a silently dropped attribute.
   */
  "aria-label"?: string;
  "aria-pressed"?: boolean;
  /** Anchor for the guided tour spotlight. */
  "data-tour"?: string;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-600 shadow-glow hover:shadow-lift",
  secondary:
    "bg-ink-100 text-ink-900 hover:bg-ink-200 dark:bg-ink-800 dark:text-white dark:hover:bg-ink-700",
  outline:
    "bg-transparent border border-ink-200 text-ink-900 hover:bg-ink-50 dark:border-ink-700 dark:text-white dark:hover:bg-ink-800",
  ghost: "bg-transparent text-ink-600 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800",
  danger: "bg-semantic-error text-white hover:bg-red-600",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
  icon: "h-10 w-10 p-0",
};

export function SmartButton({
  featureKey,
  children,
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  disabledReason,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onClick,
  type = "button",
  className,
  "aria-label": ariaLabel,
  "aria-pressed": ariaPressed,
  "data-tour": dataTour,
}: SmartButtonProps) {
  const { isEnabled } = useFeatureFlags();
  const isFeatureEnabled = isEnabled(featureKey);
  const isDisabled = disabled || isLoading || !isFeatureEnabled;

  // God Mode: Feature is disabled by Admin
  if (!isFeatureEnabled) {
    return (
      <button
        type={type}
        disabled
        aria-label={ariaLabel}
        data-tour={dataTour}
        className={clsx(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all ease-swift",
          "bg-ink-50 text-ink-300 border border-ink-100 cursor-not-allowed dark:bg-ink-900 dark:border-ink-800 dark:text-ink-600",
          SIZES[size],
          className
        )}
        title={disabledReason || "Temporarily disabled by Platform Admin"}
      >
        <Lock size={14} strokeWidth={1.75} />
        <span className="line-through decoration-1">{children}</span>
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      data-tour={dataTour}
      className={clsx(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all ease-swift",
        "focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-ink-950",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
    >
      {isLoading ? (
        <Loader2 size={size === "sm" ? 14 : 16} className="animate-spin" strokeWidth={2} />
      ) : (
        <>
          {LeftIcon && <Icon icon={LeftIcon} size={size === "sm" ? 14 : 16} />}
          {children}
          {RightIcon && <Icon icon={RightIcon} size={size === "sm" ? 14 : 16} />}
        </>
      )}
    </button>
  );
}
