import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Sun, Moon, MapPin, ShieldAlert, Coins, Gauge } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/planning': 'Planificación Cloud',
  '/costs': 'Costos y economía Cloud',
  '/infrastructure': 'Infraestructura Global',
  '/security': 'Seguridad',
  '/network': 'Arquitectura de Red',
  '/services': 'Servicios AWS',
};

interface Notification {
  id: number;
  title: string;
  detail: string;
  time: string;
  icon: LucideIcon;
  tone: string;
}

const notifications: Notification[] = [
  {
    id: 1,
    title: 'Hallazgo crítico de seguridad',
    detail: 'Bucket S3 público detectado en us-east-1. Requiere atención inmediata.',
    time: 'hace 15 min',
    icon: ShieldAlert,
    tone: 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400',
  },
  {
    id: 2,
    title: 'Presupuesto mensual al 71%',
    detail: 'Consumo actual de $252 de un presupuesto de $350.',
    time: 'hace 1 hora',
    icon: Coins,
    tone: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
  },
  {
    id: 3,
    title: 'Latencia estable',
    detail: 'Ping medio en la región us-east-1: 120 ms. Sin degradación.',
    time: 'hace 2 horas',
    icon: Gauge,
    tone: 'bg-green-50 text-green-600 dark:bg-green-950/60 dark:text-green-400',
  },
];

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const { theme, toggleTheme, region } = useApp();
  const location = useLocation();
  const title = TITLES[location.pathname] ?? 'CloudOps Dashboard';

  return (
    <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6 lg:px-8">
        <button
          type="button"
          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          onClick={onMenuClick}
          aria-label="Abrir menú"
        >
          <Menu size={18} />
        </button>

        <h1 className="truncate text-base font-semibold text-slate-900 dark:text-white md:text-lg">{title}</h1>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <div className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 sm:flex">
            <MapPin size={13} className="text-blue-600 dark:text-blue-400" />
            <span className="font-mono font-semibold">{region.code}</span>
            <span className="hidden text-slate-400 lg:inline">· {region.name}</span>
          </div>

          <div className="relative">
            <button
              type="button"
              className="relative rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={() => setNotifOpen((prev) => !prev)}
              aria-label="Notificaciones"
            >
              <Bell size={17} />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                3
              </span>
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} aria-hidden="true" />
                <div className="pop-in card absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] p-3">
                  <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Notificaciones
                  </p>
                  <ul className="space-y-1">
                    {notifications.map((item) => (
                      <li key={item.id} className="flex gap-3 rounded-xl p-2 transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                        <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', item.tone)}>
                          <item.icon size={16} />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            {item.detail}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-400">{item.time}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Desactivar modo oscuro' : 'Activar modo oscuro'}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <div className="flex items-center gap-2.5 border-l border-slate-200 pl-2.5 dark:border-slate-700 md:pl-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              AD
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold leading-tight text-slate-900 dark:text-white">Admin DevOps</p>
              <p className="text-xs leading-tight text-slate-500 dark:text-slate-400">admin@cloudops.dev</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
