import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: 'primary' | 'outline';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionVariant = 'primary',
}: EmptyStateProps) {
  return (
    <div className="bg-surface-white border border-brand-silver border-dashed rounded-xl p-12 text-center">
      <div className="w-16 h-16 bg-surface-grey rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon size={28} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-brand-graphite mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant={actionVariant} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
