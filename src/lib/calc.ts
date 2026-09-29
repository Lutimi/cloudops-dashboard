import type { CostItem } from '../types/cloud';

export const monthlyCost = (item: CostItem): number =>
  item.quantity * item.hours * item.unitRate;

export const annualCost = (item: CostItem): number => monthlyCost(item) * 12;

export const totalMonthly = (items: CostItem[]): number =>
  items.reduce((sum, item) => sum + monthlyCost(item), 0);

export const totalAnnual = (items: CostItem[]): number =>
  items.reduce((sum, item) => sum + annualCost(item), 0);

export const mostExpensiveItem = (items: CostItem[]): CostItem | undefined =>
  items.length > 0
    ? items.reduce((top, item) => (monthlyCost(item) > monthlyCost(top) ? item : top))
    : undefined;
