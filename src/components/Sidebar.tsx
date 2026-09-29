import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Coins,
  Globe,
  Network,
  ShieldCheck,
  Boxes,
  Cloud,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const NAV_GROUPS: Array<{ label: string; items: NavItem[] }> = [
  {
    label: 'General',
    items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Planificación',
    items: [
      { to: '/planning', label: 'Planificación Cloud', icon: ClipboardList },
      { to: '/costs', label: 'Costos', icon: Coins },
    ],
  },
  {
    label: 'Infraestructura',
    items: [
      { to: '/infrastructure', label: 'Infraestructura Global', icon: Globe },
      { to: '/network', label: 'Arquitectura de Red', icon: Network },
    ],
  },
  {
    label: 'Seguridad y catálogo',
    items: [
      { to: '/security', label: 'Seguridad', icon: ShieldCheck },
      { to: '/services', label: 'Servicios AWS', icon: Boxes },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { region } = useApp();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'no-print fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
              <Cloud size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-white">CloudOps</p>
              <p className="text-[11px] leading-tight text-slate-400">Dashboard</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {group.label}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/dashboard'}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                          isActive
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white',
                        )
                      }
                    >
                      <item.icon size={18} />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl bg-white/5 p-3.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              <p className="text-xs font-semibold text-white">AWS_health: Operativo</p>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
              Región principal: <span className="font-mono text-slate-300">{region.code}</span>
              <br />
              SLA objetivo: 99.99% · Multi-AZ
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
