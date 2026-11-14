import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: ButtonVariant; size?: ButtonSize; }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "primary", size = "md", children, ...props }, ref) => {
  const variants = { primary: "bg-brand-red text-white hover:bg-brand-red-dark focus:ring-brand-red shadow-sm", secondary: "bg-brand-graphite text-white hover:bg-gray-800 focus:ring-brand-graphite", outline: "border border-brand-silver text-brand-graphite hover:bg-surface-grey focus:ring-brand-silver", ghost: "text-gray-600 hover:bg-surface-grey hover:text-brand-graphite" };
  const sizes = { sm: "h-8 px-3 text-xs", md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-base" };
  return <button ref={ref} className={twMerge(clsx("inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className))} {...props}>{children}</button>;
});
Button.displayName = "Button";
