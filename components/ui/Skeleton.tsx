import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SkeletonProps {
  className?: string;
}

/** Base shimmer block */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={twMerge(clsx('animate-shimmer rounded-lg', className))} />
  );
}

/** Text line placeholder */
export function SkeletonLine({ className }: SkeletonProps) {
  return <Skeleton className={twMerge(clsx('h-3', className))} />;
}

/** Circular placeholder (avatars, icons) */
export function SkeletonCircle({ className }: SkeletonProps) {
  return <Skeleton className={twMerge(clsx('rounded-full', className))} />;
}

/** Image / media placeholder */
export function SkeletonImage({ className }: SkeletonProps) {
  return <Skeleton className={twMerge(clsx('rounded-xl', className))} />;
}
