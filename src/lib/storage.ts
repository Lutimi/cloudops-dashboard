import type { CloudProposal, CostItem } from '../types/cloud';
import { defaultCostItems } from '../data/costs';

export const STORAGE_KEYS = {
  theme: 'cloudops.theme',
  region: 'cloudops.region',
  proposals: 'cloudops.proposals',
  costs: 'cloudops.costs',
} as const;

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

export function loadProposals(): CloudProposal[] {
  return loadJSON<CloudProposal[]>(STORAGE_KEYS.proposals, []);
}

export function saveProposals(list: CloudProposal[]): void {
  saveJSON(STORAGE_KEYS.proposals, list);
}

export function loadCostItems(): CostItem[] {
  const items = loadJSON<CostItem[] | null>(STORAGE_KEYS.costs, null);
  return Array.isArray(items) && items.length > 0 ? items : defaultCostItems;
}

export function saveCostItems(items: CostItem[]): void {
  saveJSON(STORAGE_KEYS.costs, items);
}
