import { Building, CircleCheck, Cloud, Gauge, KeyRound, ShieldCheck, TriangleAlert, CircleAlert, User } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import SecurityCard from '../components/SecurityCard';
import { countByStatus, iamRoles, iamUsers, securityChecks } from '../data/security';
import type { SecurityCategory } from '../types/cloud';

const okCount = countByStatus('ok');
const warningCount = countByStatus('warning');
const errorCount = countByStatus('error');
const complianceScore = Math.round(((okCount + 0.5 * warningCount) / securityChecks.length) * 100);

const categories: SecurityCategory[] = [
  'Modelo de responsabilidad compartida',
  'IAM',
  'Protección de cuentas',
  'Protección de datos',
  'Cumplimiento',
];

const awsResponsibilities = [
  'Seguridad física de datacenters y controles perimetrales',
  'Hardware, energía, refrigeración y redes globales',
  'Virtualización y aislamiento entre instancias',
  'Servicios administrados: S3, RDS, CloudFront',
];

const customerResponsibilities = [
  'Datos y cifrado en reposo y en tránsito',
  'Gestión de identidades y accesos (IAM)',
  'Configuración de seguridad en la nube (S3, VPC)',
  'Parches del sistema operativo invitado',
];

export default function Security() {
  return (
    <>
      <PageHeader
        title="Seguridad"
        description="Panel de seguridad de la solución Cloud: modelo de responsabilidad compartida, IAM, protección de cuentas, protección de datos y cumplimiento."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Controles correctos" value={okCount} description="Verde: sin hallazgos" icon={CircleCheck} tone="green" />
        <StatCard title="Requieren revisión" value={warningCount} description="Amarillo: acción recomendada" icon={TriangleAlert} tone="amber" />
        <StatCard title="Problemas críticos" value={errorCount} description="Rojo: atender de inmediato" icon={CircleAlert} tone="red" />
        <StatCard
          title="Puntaje de cumplimiento"
          value={`${complianceScore}%`}
          description="Simulado a partir de los controles"
          icon={Gauge}
          tone={complianceScore >= 90 ? 'green' : 'amber'}
        />
      </div>

      <div className="card mt-4 p-5 md:p-6">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Modelo de responsabilidad compartida</h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          La seguridad se comparte: AWS protege la nube (infraestructura) y el cliente protege lo que hay en la nube
          (datos, identidades y configuración).
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <Building size={19} />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Responsabilidad de AWS</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Seguridad DE la nube</p>
              </div>
            </div>
            <ul className="mt-3 space-y-2">
              {awsResponsibilities.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  <CircleCheck size={14} className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <ShieldCheck size={19} />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Responsabilidad del cliente</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Seguridad EN la nube</p>
              </div>
            </div>
            <ul className="mt-3 space-y-2">
              {customerResponsibilities.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                  <CircleCheck size={14} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="card mt-4 p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Gestión de IAM</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {iamUsers.length} usuarios · {iamRoles.length} roles · política de contraseñas activa
          </p>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <User size={13} /> Usuarios IAM
            </p>
            <ul className="space-y-2">
              {iamUsers.map((user) => (
                <li
                  key={user.name}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {user.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-mono text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span
                      className={
                        user.mfa
                          ? 'chip bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400'
                          : 'chip bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                      }
                    >
                      {user.credential}
                    </span>
                    <p className="mt-1 text-[11px] text-slate-400">{user.lastActivity}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <KeyRound size={13} /> Roles IAM
            </p>
            <ul className="space-y-2">
              {iamRoles.map((role) => (
                <li
                  key={role.name}
                  className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-mono text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {role.name}
                    </p>
                    <span className="chip bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                      {role.policy}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{role.purpose}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {categories.map((category) => {
        const checks = securityChecks.filter((check) => check.category === category);
        return (
          <section key={category} className="mt-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <Cloud size={17} className="text-blue-600 dark:text-blue-400" />
                {category}
              </h2>
              <span className="chip bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {checks.length} controles
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {checks.map((check) => (
                <SecurityCard key={check.id} check={check} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
