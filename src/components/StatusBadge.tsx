import { CircleCheck, TriangleAlert, CircleAlert, Info } from 'lucide-react';
import type { Status } from '../types/cloud';
import { cn } from '../lib/utils';

const STATUS_CONFIG: Record<Status, { label: string; icon: typeof CircleCheck; className: string }> = {
  ok: {
    label: 'Operativo',
    icon: CircleCheck,
    className: 'bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900',
  },
  warning: {
    label: 'Requiere revisión',
    icon: TriangleAlert,
    className: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900',
  },
  error: {
    label: 'Problema',
    icon: CircleAlert,
    className: 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900',
  },
  info: {
    label: 'Informativo',
    icon: Info,
    className: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900',
  },
};

interface StatusBadgeProps {
  status: Status;
  label?: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.className,
      )}
    >
      <Icon size={13} strokeWidth={2.5} />
      {label ?? config.label}
    </span>
  );
}
