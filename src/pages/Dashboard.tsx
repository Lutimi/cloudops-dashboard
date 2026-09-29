import { Link } from 'react-router-dom';
import {
  Coins,
  FileDown,
  Plus,
  ArrowRight,
  ShieldCheck,
  CircleCheck,
  TriangleAlert,
  CircleAlert,
  Boxes,
  Server,
  Globe,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import CostPieChart from '../components/charts/CostPieChart';
import CostBarChart from '../components/charts/CostBarChart';
import { awsServices, countUsedServices } from '../data/awsServices';
import { countByStatus, securityChecks } from '../data/security';
import { loadCostItems, loadProposals } from '../lib/storage';
import { monthlyCost, totalAnnual, totalMonthly } from '../lib/calc';
import { formatDate, formatNumber, usd } from '../lib/utils';
import { useApp } from '../context/AppContext';

const pendingChecks = securityChecks.filter((check) => check.status !== 'ok');
const okCount = countByStatus('ok');
const warningCount = countByStatus('warning');
const errorCount = countByStatus('error');
const complianceScore = Math.round(((okCount + 0.5 * warningCount) / securityChecks.length) * 100);
const cloudResources = 27;

const buildDate = new Date(2026, 8, 28).toLocaleDateString('es', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function Dashboard() {
  const { region } = useApp();
  const costItems = loadCostItems();
  const monthly = totalMonthly(costItems);
  const annual = totalAnnual(costItems);
  const mostExpensive = costItems.reduce(
    (top, item) => (monthlyCost(item) > monthlyCost(top) ? item : top),
    costItems[0],
  );
  const proposals = loadProposals();
  const latestProposal = proposals.length > 0 ? proposals[proposals.length - 1] : undefined;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Resumen general de la solución Cloud · ${buildDate}`}
        actions={
          <>
            <Link to="/planning" className="btn-primary">
              <Plus size={16} /> Registrar propuesta
            </Link>
            <button type="button" className="btn-ghost no-print" onClick={() => window.print()}>
              <FileDown size={16} /> Exportar reporte
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Servicios en uso"
          value={`${countUsedServices()} / ${awsServices.length}`}
          description="Servicios del catálogo AWS"
          icon={Boxes}
          tone="primary"
        />
        <StatCard
          title="Costo mensual"
          value={usd(monthly)}
          description="Simulación con tarifas simuladas"
          icon={Coins}
          tone="amber"
        />
        <StatCard
          title="Costo anual"
          value={usd(annual)}
          description="Proyección a 12 meses"
          icon={Coins}
          tone="amber"
        />
        <StatCard
          title="Estado de seguridad"
          value={`${complianceScore}%`}
          description={`${errorCount} crítica · ${warningCount} por revisar`}
          icon={ShieldCheck}
          tone={complianceScore >= 90 ? 'green' : 'amber'}
        />
        <StatCard
          title="Región principal"
          value={region.code}
          description={region.name}
          icon={Globe}
          tone="slate"
        />
        <StatCard
          title="Recursos Cloud"
          value={formatNumber(cloudResources)}
          description="Instancias, buckets, roles y redes"
          icon={Server}
          tone="indigo"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Distribución de costos</h2>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{usd(monthly)}/mes</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Participación de cada servicio en el gasto mensual simulado.
          </p>
          <div className="mt-2">
            <CostPieChart items={costItems} />
          </div>
        </div>

        <div className="card p-5 lg:col-span-3">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Costo mensual por servicio</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">USD · datos simulados</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Mayor gasto: {mostExpensive.service} con {usd(monthlyCost(mostExpensive))} al mes.
          </p>
          <div className="mt-2">
            <CostBarChart items={costItems} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Resumen de seguridad</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Modelo de responsabilidad compartida, IAM, protección de datos y cumplimiento.
              </p>
            </div>
            <Link
              to="/security"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Ver panel completo <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2.5 rounded-xl border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/40">
              <CircleCheck size={18} className="shrink-0 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">{okCount}</p>
                <p className="text-[11px] text-green-700/80 dark:text-green-400/80">Correctos</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/40">
              <TriangleAlert size={18} className="shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{warningCount}</p>
                <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80">Por revisar</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/40">
              <CircleAlert size={18} className="shrink-0 text-red-600 dark:text-red-400" />
              <div>
                <p className="text-lg font-bold text-red-700 dark:text-red-300">{errorCount}</p>
                <p className="text-[11px] text-red-700/80 dark:text-red-400/80">Críticos</p>
              </div>
            </div>
          </div>

          <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {pendingChecks.map((check) => (
              <li key={check.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{check.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                    {check.recommendation || check.description}
                  </p>
                </div>
                <StatusBadge status={check.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <div className="card p-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Estado de la arquitectura</h2>
            <div className="mt-3 space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 dark:text-slate-400">Región principal</span>
                <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-100">{region.code}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 dark:text-slate-400">Disponibilidad</span>
                <StatusBadge status="ok" label="99.99% Multi-AZ" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 dark:text-slate-400">Latencia media</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">{region.latencyMs} ms</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 dark:text-slate-400">Red</span>
                <Link
                  to="/network"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  Ver arquitectura <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>

          <div className="card flex flex-1 flex-col p-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Propuestas registradas</h2>
            {latestProposal ? (
              <>
                <p className="mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400">{latestProposal.name}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {latestProposal.appType} · {latestProposal.regionCode} · {formatNumber(latestProposal.users)} usuarios
                </p>
                <p className="mt-0.5 text-xs text-slate-400">Registrada el {formatDate(latestProposal.createdAt)}</p>
                <Link to="/planning" className="btn-ghost mt-4 w-full">
                  Gestionar propuestas
                </Link>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-start justify-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Todavía no hay propuestas registradas. Registra la primera propuesta de solución Cloud.
                </p>
                <Link to="/planning" className="btn-primary mt-4">
                  <Plus size={16} /> Registrar propuesta
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
