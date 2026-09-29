import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

type Tone = 'primary' | 'green' | 'amber' | 'red' | 'slate' | 'indigo';

const TONES: Record<Tone, string> = {
  primary: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
  green: 'bg-green-50 text-green-600 dark:bg-green-950/60 dark:text-green-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
};

interface StatCardProps {
  title: string;
  value: ReactNode;
  description?: string;
  icon: LucideIcon;
  tone?: Tone;
}

export default function StatCard({ title, value, description, icon: Icon, tone = 'primary' }: StatCardProps) {
  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-1.5 truncate text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          {description && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', TONES[tone])}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
