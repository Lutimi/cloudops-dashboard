import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CloudRegion } from '../types/cloud';
import { getRegion } from '../data/regions';
import { STORAGE_KEYS, loadJSON, saveJSON } from '../lib/storage';

type Theme = 'light' | 'dark';

interface AppState {
  theme: Theme;
  region: CloudRegion;
  toggleTheme: () => void;
  setRegionId: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => loadJSON<Theme>(STORAGE_KEYS.theme, 'light'));
  const [regionId, setRegionIdState] = useState<string>(() => {
    const stored = loadJSON<string>(STORAGE_KEYS.region, 'us-east-1');
    return getRegion(stored).id;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    saveJSON(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setRegionId = useCallback((id: string) => {
    const valid = getRegion(id).id;
    setRegionIdState(valid);
    saveJSON(STORAGE_KEYS.region, valid);
  }, []);

  const value = useMemo<AppState>(
    () => ({ theme, region: getRegion(regionId), toggleTheme, setRegionId }),
    [theme, regionId, toggleTheme, setRegionId],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return ctx;
}
