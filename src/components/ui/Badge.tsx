import { ReactNode } from "react";
import { clsx } from "clsx";
import { ShieldCheck } from "lucide-react";

type Tone = "red" | "green" | "amber" | "blue" | "ink" | "aurora";
type Variant = "status" | "trust" | "spec" | "live" | "ai";

const TONES: Record<Tone, string> = {
  red: "text-brand border-brand/30 bg-brand/5",
  green: "text-semantic-success border-semantic-success/30 bg-semantic-success/5",
  amber: "text-semantic-warning border-semantic-warning/30 bg-semantic-warning/5",
  blue: "text-aurora-blue border-aurora-blue/30 bg-aurora-blue/5",
  ink: "text-ink-600 border-ink-200 bg-ink-50",
  aurora: "text-aurora-purple border-aurora-purple/30 bg-aurora-purple/5",
};

interface BadgeProps {
  variant?: Variant;
  tone?: Tone;
  icon?: ReactNode;
  dot?: boolean;
  pulse?: boolean;
  children: ReactNode;
  className?: string;
}

export function Badge({
  variant = "status",
  tone = "ink",
  icon,
  dot,
  pulse,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 h-[22px] px-2.5 rounded-full border",
        "text-[10px] font-semibold uppercase tracking-wide leading-none whitespace-nowrap",
        variant === "spec"
          ? "font-mono normal-case tracking-normal text-ink-600 border-ink-200 bg-transparent rounded-md"
          : TONES[tone],
        className
      )}
    >
      {dot && (
        <span className={clsx("w-1.5 h-1.5 rounded-full bg-current", pulse && "animate-pulse")} />
      )}
      {icon}
      {children}
    </span>
  );
}

export function TrustBadge({
  label,
  source,
  verifiedAt,
  tone = "green",
}: {
  label: string;
  source: string;
  verifiedAt?: string;
  tone?: Tone;
}) {
  return (
    <span className="group relative inline-flex">
      <Badge variant="trust" tone={tone} icon={<ShieldCheck size={12} strokeWidth={1.75} />}>
        {label}
      </Badge>
      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 opacity-0 group-hover:opacity-100 transition-opacity bg-ink-900 text-white text-[10px] leading-relaxed rounded-lg px-3 py-2 shadow-lift z-20">
        {source}
        {verifiedAt && <span className="block text-ink-300 mt-0.5">Verified {verifiedAt}</span>}
      </span>
    </span>
  );
}
