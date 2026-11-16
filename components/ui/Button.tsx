import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-red text-white shadow-card hover:bg-brand-red-dark',
  outline: 'border border-brand-silver bg-white text-brand-graphite shadow-card hover:shadow-card-hover',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
          variants[variant],
          className,
        ),
      )}
      {...props}
    />
  ),
);

Button.displayName = 'Button';
