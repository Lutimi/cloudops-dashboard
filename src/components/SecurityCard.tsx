import { Lightbulb } from 'lucide-react';
import type { SecurityCheckItem, Status } from '../types/cloud';
import { cn } from '../lib/utils';
import StatusBadge from './StatusBadge';

const BORDER: Record<Status, string> = {
  ok: 'border-l-green-500',
  warning: 'border-l-amber-500',
  error: 'border-l-red-500',
  info: 'border-l-blue-500',
};

const RECOMMENDATION: Record<string, string> = {
  warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
  error: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300',
};

export default function SecurityCard({ check }: { check: SecurityCheckItem }) {
  return (
    <div className={cn('card border-l-4 p-4', BORDER[check.status])}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold leading-snug text-slate-900 dark:text-white">{check.title}</h3>
        <StatusBadge status={check.status} />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{check.description}</p>
      {check.status !== 'ok' && check.recommendation && (
        <div
          className={cn(
            'mt-3 flex items-start gap-2 rounded-lg p-2.5 text-xs leading-relaxed',
            RECOMMENDATION[check.status] ?? '',
          )}
        >
          <Lightbulb size={14} className="mt-0.5 shrink-0" />
          <span>{check.recommendation}</span>
        </div>
      )}
    </div>
  );
}
