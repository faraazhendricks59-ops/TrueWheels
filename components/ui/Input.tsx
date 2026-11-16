import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  /** Validation message. When set, the field is marked invalid for assistive tech. */
  error?: string;
  className?: string;
}

/**
 * Text input with an associated label and accessible error reporting.
 *
 * The label is wired up with htmlFor/useId rather than being left as a bare
 * <label>, and the error is announced through aria-describedby + aria-invalid so
 * a screen-reader user hears why the field was rejected.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, required, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className={clsx("space-y-1.5", className)}>
        <label htmlFor={inputId} className="block text-sm font-medium text-brand-graphite">
          {label}
          {required && (
            <span className="ml-0.5 text-brand-red" aria-hidden="true">
              *
            </span>
          )}
        </label>

        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={twMerge(
            clsx(
              "h-10 w-full rounded-lg border bg-surface-white px-4 text-sm text-brand-graphite",
              "placeholder:text-neutral-subtle focus:outline-none focus:ring-2",
              error
                ? "border-semantic-error focus:border-semantic-error focus:ring-semantic-error/20"
                : "border-brand-silver focus:border-brand-red focus:ring-brand-red/20",
            ),
          )}
          {...props}
        />

        {error && (
          <p id={errorId} className="text-xs font-medium text-semantic-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
