import { useState } from 'react';
import { CircleCheck, ShieldCheck, KeyRound } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import { networkNodes } from '../data/network';
import { cn } from '../lib/utils';
import type { NetworkNodeInfo } from '../types/cloud';

function FlowConnector({ className }: { className?: string }) {
  return (
    <div className={cn('flow-track h-0.5 w-16 shrink-0 rounded bg-slate-300 dark:bg-slate-700', className)}>
      <span className="flow-dot" />
      <span className="flow-dot" style={{ animationDelay: '0.65s' }} />
      <span className="flow-dot" style={{ animationDelay: '1.3s' }} />
    </div>
  );
}

function DiagramNode({
  info,
  selected,
  onSelect,
  className,
}: {
  info: NetworkNodeInfo;
  selected: boolean;
  onSelect: (id: string) => void;
  className?: string;
}) {
  const Icon = info.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(info.id)}
      className={cn(
        'flex w-32 shrink-0 flex-col items-center gap-2 rounded-xl border bg-white p-3 text-center transition hover:border-blue-400 hover:shadow-sm dark:bg-slate-900 dark:hover:border-blue-500',
        selected
          ? 'border-blue-600 ring-2 ring-blue-500/40 dark:border-blue-400'
          : 'border-slate-200 dark:border-slate-700',
        className,
      )}
    >
      <span
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg',
          selected
            ? 'bg-blue-600 text-white'
            : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
        )}
      >
        <Icon size={19} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-slate-900 dark:text-white">{info.name}</p>
        <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-slate-500 dark:text-slate-400">{info.sub}</p>
      </div>
    </button>
  );
}

function getNode(id: string): NetworkNodeInfo {
  return networkNodes.find((node) => node.id === id) ?? networkNodes[0];
}

export default function Network() {
  const [selectedId, setSelectedId] = useState('cloudfront');
  const selected = getNode(selectedId);

  return (
    <>
      <PageHeader
        title="Arquitectura de Red"
        description="Representación interactiva del flujo: Internet → Route 53 → CloudFront → VPC → EC2/RDS. Haz clic en cualquier componente para ver su rol y configuración."
      />

      <div className="grid items-start gap-4 xl:grid-cols-3">
        <div className="card p-5 xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Flujo de tráfico de la solución</h2>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-6 rounded bg-blue-500" /> Tráfico cifrado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-0 w-6 border-t-2 border-dashed border-slate-400" /> Traza interna
              </span>
            </div>
          </div>

          <p className="mt-1 text-xs text-slate-400 lg:hidden">
            Desplaza horizontalmente para ver el diagrama completo.
          </p>

          <div className="mt-4 overflow-x-auto pb-2">
            <div className="flex min-w-[1040px] items-center">
              <DiagramNode info={getNode('internet')} selected={selectedId === 'internet'} onSelect={setSelectedId} />
              <FlowConnector />
              <DiagramNode info={getNode('route53')} selected={selectedId === 'route53'} onSelect={setSelectedId} />
              <FlowConnector />
              <DiagramNode info={getNode('cloudfront')} selected={selectedId === 'cloudfront'} onSelect={setSelectedId} />

              <FlowConnector className="w-10" />
              <div className="flex-1 rounded-2xl border-2 border-blue-300 bg-blue-50/40 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                  <button
                    type="button"
                    onClick={() => setSelectedId('vpc')}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition hover:bg-blue-100/70 dark:hover:bg-blue-900/30',
                      selectedId === 'vpc' && 'bg-blue-100 dark:bg-blue-900/40',
                    )}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-600 text-white">
                      {(() => {
                        const VpcIcon = getNode('vpc').icon;
                        return <VpcIcon size={14} />;
                      })()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                        VPC 10.0.0.0/16 · us-east-1
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Red privada aislada · 2 AZ</p>
                    </div>
                  </button>

                  <div className="mt-3 flex items-stretch">
                    <DiagramNode
                      info={getNode('igw')}
                      selected={selectedId === 'igw'}
                      onSelect={setSelectedId}
                      className="w-24"
                    />
                    <FlowConnector className="w-8 self-center" />
                    <div className="flex-1 rounded-xl border border-dashed border-slate-300 bg-white p-2.5 dark:border-slate-600 dark:bg-slate-900">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Subred pública · 10.0.1.0/24
                      </p>
                      <DiagramNode
                        info={getNode('alb')}
                        selected={selectedId === 'alb'}
                        onSelect={setSelectedId}
                        className="mx-auto w-full"
                      />
                    </div>
                    <FlowConnector className="w-8 self-center" />
                    <div className="flex-1 rounded-xl border border-dashed border-slate-300 bg-white p-2.5 dark:border-slate-600 dark:bg-slate-900">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Subred privada · 10.0.10.0/24
                      </p>
                      <DiagramNode
                        info={getNode('ec2')}
                        selected={selectedId === 'ec2'}
                        onSelect={setSelectedId}
                        className="w-full"
                      />
                      <div className="mx-auto my-2 h-6 w-0 border-l-2 border-dashed border-slate-300 dark:border-slate-600" />
                      <DiagramNode
                        info={getNode('rds')}
                        selected={selectedId === 'rds'}
                        onSelect={setSelectedId}
                        className="w-full"
                      />
                    </div>
                  </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Arquitectura mínima representada: </span>
            INTERNET → Route 53 → CloudFront → VPC → EC2/RDS, con subredes públicas (balanceador) y privadas
            (aplicación y base de datos) protegidas por security groups.
          </div>
        </div>

        <div className="xl:col-span-1">
          <div className="card sticky top-20 p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                {(() => {
                  const SelectedIcon = selected.icon;
                  return <SelectedIcon size={22} />;
                })()}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900 dark:text-white">{selected.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selected.sub}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge status="ok" label="Activo" />
              <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {selected.scope}
              </span>
              <span className="chip bg-slate-100 font-mono text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {selected.protocol}
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{selected.description}</p>

            <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              {selected.details.map((detail) => (
                <li key={detail} className="flex items-start gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  <CircleCheck size={14} className="mt-0.5 shrink-0 text-green-600 dark:text-green-400" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          <div className="card mt-4 p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-green-600 dark:text-green-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Seguridad de la red</h3>
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <KeyRound size={13} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
                Security Groups: ALB solo acepta tráfico de CloudFront (443) y EC2 solo del ALB.
              </li>
              <li className="flex items-start gap-2">
                <KeyRound size={13} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
                RDS inaccesible desde Internet: solo la subred privada puede alcanzar el puerto 3306.
              </li>
              <li className="flex items-start gap-2">
                <KeyRound size={13} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
                NACLs por subred como segunda capa de filtrado por estado.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card mt-4 p-5">
        <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Resumen de componentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-400 dark:border-slate-700">
                <th className="pb-2 pr-4 font-semibold">Componente</th>
                <th className="pb-2 pr-4 font-semibold">Alcance</th>
                <th className="pb-2 pr-4 font-semibold">Protocolo</th>
                <th className="pb-2 font-semibold">Función</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {networkNodes.map((node) => (
                <tr key={node.id} className={cn('transition', selectedId === node.id && 'bg-blue-50/60 dark:bg-blue-950/20')}>
                  <td className="py-2.5 pr-4 font-semibold text-slate-800 dark:text-slate-100">{node.name}</td>
                  <td className="py-2.5 pr-4">
                    <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {node.scope}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-slate-500 dark:text-slate-400">{node.protocol}</td>
                  <td className="py-2.5 text-xs text-slate-500 dark:text-slate-400">{node.sub}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
