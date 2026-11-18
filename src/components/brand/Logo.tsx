import { clsx } from "clsx";

type Size = "xs" | "sm" | "md" | "lg" | "xl";
const MARK_SIZES: Record<Size, string> = {
  xs: "text-base",
  sm: "text-2xl",
  md: "text-3xl",
  lg: "text-5xl",
  xl: "text-7xl",
};
const WORD_SIZES: Record<Size, string> = {
  xs: "text-sm",
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
};

interface LogoProps {
  variant?: "full" | "mark" | "word";
  size?: Size;
  animated?: boolean;
  className?: string;
  /**
   * For a dark surface that does not flip with the theme, such as the home hero
   * over video. The wordmark is otherwise `text-ink-900`, which is near-black in
   * light mode and would disappear against the video.
   */
  onDark?: boolean;
}

export function Logo({ variant = "full", size = "md", animated, className, onDark }: LogoProps) {
  const mark = (
    <span className={clsx("tw-mark", MARK_SIZES[size], animated && "tw-animated", className)}>
      <i className="tw-slash tw-slash--thin" />
      <i className="tw-slash" />
      <b className="tw-t">T</b>
      <b className="tw-w">W</b>
    </span>
  );
  const word = (
    <span
      className={clsx(
        "font-display italic font-black tracking-tight",
        onDark ? "text-white" : "text-ink-900",
        WORD_SIZES[size],
        className
      )}
    >
      True<span className="text-brand">Wheels</span>
    </span>
  );

  if (variant === "mark") return mark;
  if (variant === "word") return word;
  return (
    <span className="inline-flex items-center gap-2.5">
      {mark}
      {word}
    </span>
  );
}
