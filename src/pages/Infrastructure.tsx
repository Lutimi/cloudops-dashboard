import { Globe, Layers, Gauge, MapPin, Boxes, Coins, Scale } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import RegionCard from '../components/RegionCard';
import { continents, regions, totalAzCount } from '../data/regions';
import { useApp } from '../context/AppContext';

const uniqueServices = [...new Set(regions.flatMap((region) => region.services))].length;

const criteria = [
  { icon: Gauge, title: 'Latencia', detail: 'Cercanía a los usuarios finales' },
  { icon: Coins, title: 'Costos', detail: 'El precio varía por región' },
  { icon: Scale, title: 'Cumplimiento', detail: 'Requisitos legales de residencia de datos' },
  { icon: Boxes, title: 'Catálogo', detail: 'Disponibilidad de servicios por región' },
];

export default function Infrastructure() {
  const { region, setRegionId } = useApp();

  return (
    <>
      <PageHeader
        title="Infraestructura Global"
        description="Representación visual de la infraestructura global de AWS: regiones, ubicaciones, servicios desplegados y estado operativo."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Regiones cubiertas" value={regions.length} description="Presencia global simulada" icon={Globe} tone="primary" />
        <StatCard title="Zonas de disponibilidad" value={totalAzCount} description="Aislamiento por datacenter" icon={Layers} tone="indigo" />
        <StatCard title="Servicios desplegados" value={uniqueServices} description="Servicios únicos en regiones" icon={Boxes} tone="green" />
        <StatCard
          title="Latencia de la región principal"
          value={`${region.latencyMs} ms`}
          description={`Promedio en ${region.code}`}
          icon={Gauge}
          tone={region.latencyMs <= 150 ? 'green' : 'amber'}
        />
      </div>

      <div className="card mt-4 p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Región principal de despliegue</h2>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Define dónde se hospedará la carga principal. Se guarda en el navegador y se refleja en el Dashboard y
              el encabezado de la aplicación.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="shrink-0 text-blue-600 dark:text-blue-400" />
            <select
              className="input w-auto min-w-64 font-medium"
              value={region.id}
              onChange={(event) => setRegionId(event.target.value)}
            >
              {regions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.code} · {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:grid-cols-2 lg:grid-cols-4">
          {criteria.map((item) => (
            <div key={item.title} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <item.icon size={15} />
              </span>
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {continents.map((continent) => (
        <section key={continent} className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{continent}</h2>
            <span className="chip bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {regions.filter((item) => item.continent === continent).length} regiones
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {regions
              .filter((item) => item.continent === continent)
              .map((item) => (
                <RegionCard
                  key={item.id}
                  region={item}
                  selected={item.id === region.id}
                  onSelect={setRegionId}
                />
              ))}
          </div>
        </section>
      ))}
    </>
  );
}
