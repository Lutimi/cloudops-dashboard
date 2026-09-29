import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { CostItem } from '../../types/cloud';
import { monthlyCost } from '../../lib/calc';
import { shortServiceName } from '../../data/awsServices';

interface CostBarChartProps {
  items: CostItem[];
  height?: number;
}

export default function CostBarChart({ items, height = 280 }: CostBarChartProps) {
  const data = items.map((item) => ({
    name: shortServiceName(item.service),
    monthly: Number(monthlyCost(item).toFixed(2)),
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" strokeOpacity={0.4} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={46} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }}
          cursor={{ fill: 'rgba(37, 99, 235, 0.06)' }}
        />
        <Bar dataKey="monthly" name="Costo mensual (USD)" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={46} />
      </BarChart>
    </ResponsiveContainer>
  );
}
