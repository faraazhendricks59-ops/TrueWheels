import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Render as the child element (e.g. a Next.js Link) instead of a <button>. */
  asChild?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-red text-white shadow-card hover:bg-brand-red-dark',
  outline: 'border border-brand-silver bg-surface-white text-brand-graphite shadow-card hover:shadow-card-hover',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', asChild = false, className, type, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        {...(asChild ? {} : { type: type ?? 'button' })}
        className={twMerge(
          clsx(
            'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
            variants[variant],
            className,
          ),
        )}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
