import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SkeletonProps { className?: string; }

export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden="true" className={twMerge(clsx("animate-shimmer rounded-lg", className))} />;
}

export function SkeletonLine({ className }: SkeletonProps) {
  return <Skeleton className={twMerge(clsx("h-3", className))} />;
}

export function SkeletonCircle({ className }: SkeletonProps) {
  return <Skeleton className={twMerge(clsx("rounded-full", className))} />;
}

export function SkeletonImage({ className }: SkeletonProps) {
  return <Skeleton className={twMerge(clsx("rounded-xl", className))} />;
}
