"use client";

import { useId } from "react";
import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import { Icon } from "./Icon";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  hint,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  id: propsId,
  className,
  containerClassName,
  ...props
}: InputProps) {
  const autoId = useId();
  const id = propsId || autoId;

  return (
    <div className={clsx("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-ink-600 dark:text-ink-300 uppercase tracking-wide"
        >
          {label}
          {props.required && <span className="text-brand ml-0.5">*</span>}
        </label>
      )}

      <div className="relative group">
        {LeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-400 group-focus-within:text-brand transition-colors">
            <Icon icon={LeftIcon} size={16} />
          </div>
        )}

        <input
          id={id}
          className={clsx(
            "w-full h-11 px-3.5 rounded-xl bg-white dark:bg-ink-900 border text-sm text-ink-900 dark:text-white placeholder:text-ink-400",
            "transition-all ease-swift focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand",
            "disabled:bg-ink-50 disabled:text-ink-400 disabled:cursor-not-allowed",
            LeftIcon && "pl-10",
            RightIcon && "pr-10",
            error
              ? "border-semantic-error focus:ring-semantic-error/20 focus:border-semantic-error"
              : "border-ink-200 dark:border-ink-800",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...props}
        />

        {RightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-400">
            <Icon icon={RightIcon} size={16} />
          </div>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="text-xs text-semantic-error font-medium flex items-center gap-1">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-ink-400">
          {hint}
        </p>
      )}
    </div>
  );
}
