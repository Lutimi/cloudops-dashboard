import { useMemo, useState } from 'react';
import { Search, Filter, X, Boxes, CircleCheck, SearchX, Coins } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import ServiceCard from '../components/ServiceCard';
import StatusBadge from '../components/StatusBadge';
import { awsServices, serviceCategories, shortServiceName } from '../data/awsServices';
import { cn } from '../lib/utils';
import type { AWSService, ServiceCategory } from '../types/cloud';

type UsageFilter = 'todos' | 'usados' | 'disponibles';

export default function Services() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'Todas' | ServiceCategory>('Todas');
  const [usage, setUsage] = useState<UsageFilter>('todos');
  const [selected, setSelected] = useState<AWSService | null>(null);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return awsServices.filter((service) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [service.name, service.category, service.description, service.mainFunction]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory = category === 'Todas' || service.category === category;
      const matchesUsage =
        usage === 'todos' || (usage === 'usados' && service.used) || (usage === 'disponibles' && !service.used);
      return matchesQuery && matchesCategory && matchesUsage;
    });
  }, [query, category, usage]);

  const hasFilters = query !== '' || category !== 'Todas' || usage !== 'todos';

  const clearFilters = () => {
    setQuery('');
    setCategory('Todas');
    setUsage('todos');
  };

  const usedCount = awsServices.filter((service) => service.used).length;

  return (
    <>
      <PageHeader
        title="Servicios AWS"
        description="Catálogo de servicios utilizados en la solución: nombre, categoría, descripción, función principal y estado de utilización."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard title="Servicios en catálogo" value={awsServices.length} description="Servicios evaluados" icon={Boxes} tone="primary" />
        <StatCard title="En uso" value={usedCount} description="Incluidos en la propuesta" icon={CircleCheck} tone="green" />
        <StatCard title="Categorías" value={serviceCategories.length} description="Por área de la nube" icon={Filter} tone="indigo" />
      </div>

      <div className="card mt-4 p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="input pl-9"
              placeholder="Buscar por nombre, categoría o función…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <select
            className="input md:w-52"
            value={usage}
            onChange={(event) => setUsage(event.target.value as UsageFilter)}
          >
            <option value="todos">Todos los estados</option>
            <option value="usados">Solo en uso</option>
            <option value="disponibles">Solo disponibles</option>
          </select>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(['Todas', ...serviceCategories] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCategory(option)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                category === option
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-300 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500',
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center dark:border-slate-700">
          <SearchX size={28} className="text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No se encontraron servicios para «{query}» con los filtros actuales.
          </p>
          {hasFilters && (
            <button type="button" className="btn-ghost" onClick={clearFilters}>
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((service) => (
            <ServiceCard key={service.id} service={service} onDetail={setSelected} />
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
            aria-hidden="true"
          />
          <div className="pop-in card relative z-10 w-full max-w-lg p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  {(() => {
                    const Icon = selected.icon;
                    return <Icon size={24} />;
                  })()}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selected.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Categoría: {selected.category}</p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                onClick={() => setSelected(null)}
                aria-label="Cerrar detalle"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-3">
              <StatusBadge
                status={selected.used ? 'ok' : 'info'}
                label={selected.used ? 'En uso en la solución' : 'Disponible para incorporar'}
              />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{selected.description}</p>

            <div className="mt-4 rounded-lg bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-slate-100">Función principal: </span>
              {selected.mainFunction}
            </div>

            <div className="mt-4 flex items-start gap-2 border-t border-slate-100 pt-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
              <Coins size={16} className="mt-0.5 shrink-0 text-amber-500" />
              <span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">Modelo de precios: </span>
                {selected.pricing}
              </span>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Nombre corto en la solución: {shortServiceName(selected.name)}
            </p>

            <button type="button" className="btn-primary mt-5 w-full" onClick={() => setSelected(null)}>
              Cerrar detalle
            </button>
          </div>
        </div>
      )}
    </>
  );
}
