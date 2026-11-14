import { HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type BadgeVariant = "default" | "featured" | "live" | "verified" | "sold";
interface BadgeProps extends HTMLAttributes<HTMLDivElement> { variant?: BadgeVariant; }
export const Badge = forwardRef<HTMLDivElement, BadgeProps>(({ className, variant = "default", children, ...props }, ref) => { const variants = { default: "bg-surface-grey text-gray-600 border-brand-silver", featured: "bg-amber-50 text-amber-700 border-amber-200", live: "bg-brand-red/10 text-brand-red border-brand-red/20 animate-pulse", verified: "bg-blue-50 text-blue-700 border-blue-200", sold: "bg-gray-100 text-gray-500 border-gray-200 line-through" }; return <div ref={ref} className={twMerge(clsx("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold", variants[variant], className))} {...props}>{children}</div>; });
Badge.displayName = "Badge";
