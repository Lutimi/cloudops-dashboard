import { MapPin } from 'lucide-react';
import type { CloudRegion } from '../types/cloud';
import { cn } from '../lib/utils';
import StatusBadge from './StatusBadge';

const STATUS_LABEL: Record<string, string> = {
  ok: 'Operativa',
  warning: 'Con observaciones',
  error: 'Incidente',
  info: 'Respaldo DR',
};

interface RegionCardProps {
  region: CloudRegion;
  selected: boolean;
  onSelect?: (id: string) => void;
}

export default function RegionCard({ region, selected, onSelect }: RegionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(region.id)}
      className={cn(
        'card card-hover w-full p-5 text-left',
        selected && 'border-blue-500/50 ring-2 ring-blue-500 dark:border-blue-400/50 dark:ring-blue-400',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900 dark:text-white">{region.name}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <MapPin size={12} className="shrink-0" />
            {region.location}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200">{region.code}</p>
          <p className="text-[11px] text-slate-400">{region.azCount} AZ</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {region.services.slice(0, 4).map((service) => (
          <span
            key={service}
            className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            {service}
          </span>
        ))}
        {region.services.length > 4 && (
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            +{region.services.length - 4}
          </span>
        )}
      </div>

      <p className="mt-3 line-clamp-2 min-h-8 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        {region.note}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{region.latencyMs} ms promedio</span>
        <StatusBadge status={region.status} label={STATUS_LABEL[region.status]} />
      </div>

      {selected && (
        <p className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400">Región principal seleccionada</p>
      )}
    </button>
  );
}
