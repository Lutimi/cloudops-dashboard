import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-col lg:pl-64 print:pl-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main
          key={location.pathname}
          className="fade-up mx-auto w-full max-w-[1440px] flex-1 p-4 md:p-6 lg:p-8 print:p-0"
        >
          <Outlet />
        </main>
        <footer className="no-print border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          CloudOps Dashboard · Práctica Integrativa Cloud Foundations (Semanas 5 y 6) · Datos simulados con fines
          educativos
        </footer>
      </div>
    </div>
  );
}
