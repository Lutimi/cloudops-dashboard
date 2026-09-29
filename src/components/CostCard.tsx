import { X } from 'lucide-react';
import type { CostItem } from '../types/cloud';
import { costableServices } from '../data/costs';
import { annualCost, monthlyCost } from '../lib/calc';
import { usd } from '../lib/utils';

interface CostCardProps {
  item: CostItem;
  onChange: (item: CostItem) => void;
  onRemove: (id: string) => void;
}

export default function CostCard({ item, onChange, onRemove }: CostCardProps) {
  const patch = (fields: Partial<CostItem>) => onChange({ ...item, ...fields });

  const handleServiceChange = (serviceId: string) => {
    const costable = costableServices.find((service) => service.id === serviceId);
    if (!costable) return;
    patch({ serviceId, service: costable.service, unitRate: costable.unitRate, unitLabel: costable.unitLabel });
  };

  const handleQuantity = (raw: string) => {
    patch({ quantity: raw === '' ? 0 : Math.max(0, Number(raw)) });
  };

  const handleHours = (raw: string) => {
    patch({ hours: raw === '' ? 0 : Math.max(0, Number(raw)) });
  };

  return (
    <div className="card flex flex-col p-5">
      <div className="flex items-center gap-2">
        <select
          className="input flex-1 font-medium"
          value={item.serviceId}
          onChange={(event) => handleServiceChange(event.target.value)}
        >
          {costableServices.map((service) => (
            <option key={service.id} value={service.id}>
              {service.service}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="rounded-lg border border-slate-300 p-2 text-slate-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900 dark:hover:bg-red-950/50 dark:hover:text-red-400"
          aria-label="Quitar servicio de la estimación"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor={`qty-${item.id}`}>Cantidad</label>
          <input
            id={`qty-${item.id}`}
            type="number"
            min={0}
            className="input"
            value={item.quantity}
            onChange={(event) => handleQuantity(event.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor={`hours-${item.id}`}>Horas al mes</label>
          <input
            id={`hours-${item.id}`}
            type="number"
            min={0}
            className="input"
            value={item.hours}
            onChange={(event) => handleHours(event.target.value)}
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Tarifa simulada: <span className="font-semibold">{usd(item.unitRate)}</span> / {item.unitLabel}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Mensual</p>
          <p className="mt-0.5 text-xl font-bold text-amber-600 dark:text-amber-400">{usd(monthlyCost(item))}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Anual</p>
          <p className="mt-0.5 text-xl font-bold text-slate-900 dark:text-white">{usd(annualCost(item))}</p>
        </div>
      </div>
    </div>
  );
}
