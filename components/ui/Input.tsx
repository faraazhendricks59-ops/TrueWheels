import { InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; }
export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, id, ...props }, ref) => { const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-"); return <div className="w-full space-y-1.5">{label && <label htmlFor={inputId} className="text-sm font-medium text-brand-graphite">{label}</label>}<input ref={ref} id={inputId} aria-invalid={Boolean(error)} aria-describedby={error && inputId ? `${inputId}-error` : undefined} className={twMerge(clsx("h-10 w-full rounded-lg border bg-surface-white px-4 text-brand-graphite placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1", error ? "border-semantic-error focus:ring-semantic-error" : "border-brand-silver focus:border-brand-red focus:ring-brand-red/20", className))} {...props} />{error && <p id={inputId ? `${inputId}-error` : undefined} className="text-xs text-semantic-error">{error}</p>}</div>; });
Input.displayName = "Input";
