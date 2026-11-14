import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps { icon: LucideIcon; title: string; description: string; actionLabel?: string; onAction?: () => void; actionVariant?: "primary" | "outline"; }
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, actionVariant = "primary" }: EmptyStateProps) { return <div className="rounded-xl border border-dashed border-brand-silver bg-surface-white p-12 text-center"><div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-grey"><Icon size={28} className="text-gray-400" aria-hidden="true" /></div><h2 className="mb-2 text-lg font-bold text-brand-graphite">{title}</h2><p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-gray-500">{description}</p>{actionLabel && onAction && <Button type="button" variant={actionVariant} onClick={onAction}>{actionLabel}</Button>}</div>; }
