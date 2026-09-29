import { useState } from 'react';
import { Coins, Plus, RotateCcw, Wallet, Boxes, TrendingUp } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import CostCard from '../components/CostCard';
import CostPieChart from '../components/charts/CostPieChart';
import { costableServices, defaultCostItems } from '../data/costs';
import { loadCostItems, saveCostItems } from '../lib/storage';
import { monthlyCost, mostExpensiveItem, totalAnnual, totalMonthly } from '../lib/calc';
import { shortServiceName } from '../data/awsServices';
import { usd } from '../lib/utils';
import type { CostItem } from '../types/cloud';
import { CHART_COLORS } from '../components/charts/CostPieChart';

export default function Costs() {
  const [items, setItems] = useState<CostItem[]>(() => loadCostItems());

  const monthly = totalMonthly(items);
  const annual = totalAnnual(items);
  const mostExpensive = mostExpensiveItem(items);

  const persist = (updated: CostItem[]) => {
    setItems(updated);
    saveCostItems(updated);
  };

  const handleUpdate = (updated: CostItem) => {
    persist(items.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleRemove = (id: string) => {
    persist(items.filter((item) => item.id !== id));
  };

  const nextService = costableServices.find(
    (service) => !items.some((item) => item.serviceId === service.id),
  );

  const handleAdd = () => {
    if (!nextService) return;
    persist([
      ...items,
      {
        id: `item-${crypto.randomUUID()}`,
        serviceId: nextService.id,
        service: nextService.service,
        quantity: 1,
        hours: 730,
        unitRate: nextService.unitRate,
        unitLabel: nextService.unitLabel,
      },
    ]);
  };

  const handleReset = () => {
    persist(defaultCostItems.map((item) => ({ ...item })));
  };

  const maxItemCost = items.length > 0 ? Math.max(...items.map((item) => monthlyCost(item))) : 0;

  return (
    <>
      <PageHeader
        title="Costos y economía Cloud"
        description="Estimación simulada de costos según servicio, cantidad y horas. Ajusta los valores y observa el impacto en el gasto mensual y anual."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Costo mensual total" value={usd(monthly)} description="Suma de todos los ítems" icon={Coins} tone="amber" />
        <StatCard title="Costo anual total" value={usd(annual)} description="Proyección mensual × 12" icon={Wallet} tone="amber" />
        <StatCard
          title="Ítem más costoso"
          value={mostExpensive ? shortServiceName(mostExpensive.service) : '—'}
          description={mostExpensive ? `${usd(monthlyCost(mostExpensive))} al mes` : 'Sin ítems'}
          icon={TrendingUp}
          tone="indigo"
        />
        <StatCard
          title="Servicios estimados"
          value={`${items.length} / ${costableServices.length}`}
          description="Ítems del estimador"
          icon={Boxes}
          tone="primary"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Configurador de estimación</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Fórmula simulada: costo mensual = cantidad × horas × tarifa unitaria
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={handleAdd} disabled={!nextService}>
            <Plus size={16} /> Agregar servicio
          </button>
          <button type="button" className="btn-ghost" onClick={handleReset}>
            <RotateCcw size={16} /> Restablecer
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <CostCard key={item.id} item={item} onChange={handleUpdate} onRemove={handleRemove} />
        ))}
        {items.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center dark:border-slate-700 md:col-span-2 xl:col-span-3">
            <Boxes size={26} className="text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No hay ítems en la estimación. Agrega un servicio para comenzar.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Distribución de costos</h2>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{usd(monthly)}/mes</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Proporción del gasto mensual por servicio (simulado).
          </p>
          <div className="mt-2">
            <CostPieChart items={items} height={300} />
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Ranking de gasto mensual</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Ítems ordenados de mayor a menor costo estimado.
          </p>
          {items.length === 0 ? (
            <p className="mt-6 text-sm text-slate-400">Sin datos para mostrar.</p>
          ) : (
            <ul className="mt-4 space-y-3.5">
              {[...items]
                .sort((a, b) => monthlyCost(b) - monthlyCost(a))
                .map((item) => {
                  const cost = monthlyCost(item);
                  const width = maxItemCost > 0 ? Math.max(4, (cost / maxItemCost) * 100) : 0;
                  const index = [...items]
                    .sort((a, b) => monthlyCost(b) - monthlyCost(a))
                    .findIndex((sorted) => sorted.id === item.id);
                  return (
                    <li key={item.id}>
                      <div className="flex items-baseline justify-between gap-2 text-xs">
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {shortServiceName(item.service)}
                        </span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400">{usd(cost)}</span>
                      </div>
                      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${width}%`, backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                        />
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
          <p className="mt-5 border-t border-slate-100 pt-3 text-[11px] leading-relaxed text-slate-400 dark:border-slate-800">
            Valores educativos con tarifas de referencia. No provienen de una API real de AWS.
          </p>
        </div>
      </div>
    </>
  );
}
