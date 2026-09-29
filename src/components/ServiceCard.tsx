import { ChevronRight } from 'lucide-react';
import type { AWSService } from '../types/cloud';
import StatusBadge from './StatusBadge';

interface ServiceCardProps {
  service: AWSService;
  onDetail?: (service: AWSService) => void;
}

export default function ServiceCard({ service, onDetail }: ServiceCardProps) {
  const Icon = service.icon;
  return (
    <div className="card card-hover flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Icon size={22} />
          </div>
          <div>
            <h3 className="font-semibold leading-tight text-slate-900 dark:text-white">{service.name}</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">{service.category}</span>
          </div>
        </div>
        <StatusBadge
          status={service.used ? 'ok' : 'info'}
          label={service.used ? 'En uso' : 'Disponible'}
        />
      </div>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{service.description}</p>
      <div className="mt-3 flex-1 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
        <span className="font-semibold text-slate-700 dark:text-slate-200">Función principal: </span>
        {service.mainFunction}
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <span className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">{service.pricing}</span>
        {onDetail && (
          <button
            type="button"
            onClick={() => onDetail(service)}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Ver detalle
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
