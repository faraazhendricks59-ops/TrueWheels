import { ReactNode } from "react";
import { clsx } from "clsx";

interface TextProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function H1({ children, className, id }: TextProps) {
  return (
    <h1 id={id} className={clsx("font-display text-3xl md:text-4xl font-bold tracking-tight text-ink-900 dark:text-white", className)}>
      {children}
    </h1>
  );
}

export function H2({ children, className, id }: TextProps) {
  return (
    <h2 id={id} className={clsx("font-display text-2xl font-bold tracking-tight text-ink-900 dark:text-white", className)}>
      {children}
    </h2>
  );
}

export function Body({ children, className }: TextProps) {
  return <p className={clsx("text-sm md:text-base leading-relaxed text-ink-600 dark:text-ink-300", className)}>{children}</p>;
}

export function BodySmall({ children, className }: TextProps) {
  return <p className={clsx("text-xs leading-relaxed text-ink-500 dark:text-ink-400", className)}>{children}</p>;
}
