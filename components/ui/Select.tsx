import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  label: string;
  error?: string;
  className?: string;
}

/** Native select styled to match Input, with the same label/error wiring. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, id, required, children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = `${selectId}-error`;

    return (
      <div className={clsx("space-y-1.5", className)}>
        <label htmlFor={selectId} className="block text-sm font-medium text-brand-graphite">
          {label}
          {required && (
            <span className="ml-0.5 text-brand-red" aria-hidden="true">
              *
            </span>
          )}
        </label>

        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={twMerge(
            clsx(
              "h-10 w-full rounded-lg border bg-surface-white px-4 text-sm text-brand-graphite",
              "focus:outline-none focus:ring-2",
              error
                ? "border-semantic-error focus:border-semantic-error focus:ring-semantic-error/20"
                : "border-brand-silver focus:border-brand-red focus:ring-brand-red/20",
            ),
          )}
          {...props}
        >
          {children}
        </select>

        {error && (
          <p id={errorId} className="text-xs font-medium text-semantic-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
