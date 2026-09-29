import { useEffect, useState, type FormEvent } from 'react';
import { Building2, MapPin, Users, Gauge, Target, Trash2, CircleCheck, ClipboardList, Save } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import { awsServices, shortServiceName } from '../data/awsServices';
import { regions } from '../data/regions';
import { loadProposals, saveProposals } from '../lib/storage';
import { formatDate, formatNumber } from '../lib/utils';
import { cn } from '../lib/utils';
import type { CloudProposal } from '../types/cloud';

const appTypes = [
  'Aplicación web',
  'API REST',
  'Aplicación móvil',
  'Microservicios',
  'Plataforma de datos',
  'IA / Machine Learning',
];

const availabilityOptions = ['99.9% – Básica', '99.95% – Multi-AZ', '99.99% – Misión crítica'];

const objectives = [
  'Reducción de costos',
  'Escalabilidad y elasticidad',
  'Time-to-market más rápido',
  'Modernización de infraestructura',
  'Continuidad del negocio',
];

interface FormState {
  name: string;
  appType: string;
  description: string;
  regionCode: string;
  users: string;
  availability: string;
  objective: string;
}

const emptyForm: FormState = {
  name: '',
  appType: '',
  description: '',
  regionCode: regions[0].code,
  users: '',
  availability: '',
  objective: '',
};

export default function Planning() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [proposals, setProposals] = useState<CloudProposal[]>(() => loadProposals());

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 4000);
    return () => clearTimeout(timer);
  }, [saved]);

  const setField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((serviceId) => serviceId !== id) : [...prev, id],
    );
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const missing: string[] = [];
    if (form.name.trim().length < 3) missing.push('El nombre de la solución es obligatorio (mínimo 3 caracteres).');
    if (!form.appType) missing.push('Selecciona el tipo de aplicación.');
    if (form.description.trim().length < 10) missing.push('Agrega una descripción de al menos 10 caracteres.');
    if (!form.availability) missing.push('Selecciona el nivel de disponibilidad requerido.');
    if (!form.objective) missing.push('Selecciona el objetivo de la migración.');
    if (!form.users || Number(form.users) <= 0) missing.push('Indica el número estimado de usuarios.');
    if (selectedServices.length === 0) missing.push('Selecciona al menos un servicio Cloud.');

    if (missing.length > 0) {
      setErrors(missing);
      return;
    }

    const proposal: CloudProposal = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      appType: form.appType,
      description: form.description.trim(),
      regionCode: form.regionCode,
      users: Number(form.users),
      availability: form.availability,
      services: selectedServices,
      objective: form.objective,
      createdAt: new Date().toISOString(),
    };

    const updated = [...proposals, proposal];
    setProposals(updated);
    saveProposals(updated);
    setForm(emptyForm);
    setSelectedServices([]);
    setErrors([]);
    setSaved(true);
  };

  const handleReset = () => {
    setForm(emptyForm);
    setSelectedServices([]);
    setErrors([]);
  };

  const handleDelete = (id: string) => {
    const updated = proposals.filter((proposal) => proposal.id !== id);
    setProposals(updated);
    saveProposals(updated);
  };

  return (
    <>
      <PageHeader
        title="Planificación Cloud"
        description="Registra la propuesta de solución Cloud antes de la implementación real: tipo de aplicación, región, disponibilidad, servicios y objetivo de la migración."
      />

      {saved && (
        <div className="pop-in mb-4 flex items-center gap-2.5 rounded-xl border border-green-200 bg-green-50 p-3.5 text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
          <CircleCheck size={18} />
          Propuesta registrada correctamente y guardada en este navegador.
        </div>
      )}

      <div className="grid items-start gap-4 lg:grid-cols-5">
        <form onSubmit={handleSubmit} className="card p-5 md:p-6 lg:col-span-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Nueva propuesta de solución</h2>

          {errors.length > 0 && (
            <div className="pop-in mt-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/40">
              <ul className="list-inside list-disc space-y-1 text-xs font-medium text-red-700 dark:text-red-300">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="name">Nombre de la solución</label>
              <input
                id="name"
                type="text"
                className="input"
                placeholder="Ej. Portal Empresarial Corporativo"
                value={form.name}
                onChange={(event) => setField('name', event.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="appType">Tipo de aplicación</label>
              <select id="appType" className="input" value={form.appType} onChange={(event) => setField('appType', event.target.value)}>
                <option value="">Seleccionar…</option>
                {appTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="region">Región seleccionada</label>
              <select id="region" className="input" value={form.regionCode} onChange={(event) => setField('regionCode', event.target.value)}>
                {regions.map((region) => (
                  <option key={region.id} value={region.code}>
                    {region.code} · {region.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="users">Número estimado de usuarios</label>
              <input
                id="users"
                type="number"
                min={1}
                className="input"
                placeholder="Ej. 1500"
                value={form.users}
                onChange={(event) => setField('users', event.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="availability">Nivel de disponibilidad requerido</label>
              <select id="availability" className="input" value={form.availability} onChange={(event) => setField('availability', event.target.value)}>
                <option value="">Seleccionar…</option>
                {availabilityOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="objective">Objetivo de la migración</label>
              <select id="objective" className="input" value={form.objective} onChange={(event) => setField('objective', event.target.value)}>
                <option value="">Seleccionar…</option>
                {objectives.map((objective) => (
                  <option key={objective} value={objective}>{objective}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="description">Descripción</label>
              <textarea
                id="description"
                rows={3}
                className="input resize-none"
                placeholder="Describe brevemente la solución y su alcance…"
                value={form.description}
                onChange={(event) => setField('description', event.target.value)}
              />
            </div>
          </div>

          <div className="mt-5">
            <span className="label">Servicios Cloud seleccionados ({selectedServices.length})</span>
            <div className="flex flex-wrap gap-2">
              {awsServices.map((service) => {
                const active = selectedServices.includes(service.id);
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition',
                      active
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500',
                    )}
                  >
                    <service.icon size={13} />
                    {shortServiceName(service.name)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
            <button type="submit" className="btn-primary">
              <Save size={16} /> Registrar propuesta
            </button>
            <button type="button" className="btn-ghost" onClick={handleReset}>
              Limpiar formulario
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Propuestas registradas</h2>
            <span className="chip bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              {proposals.length}
            </span>
          </div>

          {proposals.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center dark:border-slate-700">
              <ClipboardList size={28} className="text-slate-300 dark:text-slate-600" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Aún no hay propuestas. Completa el formulario para registrar la primera.
              </p>
            </div>
          ) : (
            proposals.map((proposal) => (
              <article key={proposal.id} className="card card-hover p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">{proposal.name}</h3>
                    <p className="mt-0.5 text-xs text-slate-400">{formatDate(proposal.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status="ok" label="Registrada" />
                    <button
                      type="button"
                      onClick={() => handleDelete(proposal.id)}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                      aria-label="Eliminar propuesta"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {proposal.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <Building2 size={12} /> {proposal.appType}
                  </span>
                  <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <MapPin size={12} /> {proposal.regionCode}
                  </span>
                  <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <Users size={12} /> {formatNumber(proposal.users)}
                  </span>
                  <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <Gauge size={12} /> {proposal.availability}
                  </span>
                  <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <Target size={12} /> {proposal.objective}
                  </span>
                </div>

                <p className="mt-3 text-[11px] text-slate-400">
                  Servicios: {proposal.services.length} seleccionados
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </>
  );
}
