import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { CostItem } from '../../types/cloud';
import { monthlyCost } from '../../lib/calc';
import { shortServiceName } from '../../data/awsServices';

export const CHART_COLORS = [
  '#2563EB',
  '#F59E0B',
  '#16A34A',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
  '#F97316',
];

interface CostPieChartProps {
  items: CostItem[];
  height?: number;
}

export default function CostPieChart({ items, height = 280 }: CostPieChartProps) {
  const data = items.map((item) => ({
    name: shortServiceName(item.service),
    value: Number(monthlyCost(item).toFixed(2)),
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="58%"
          outerRadius="85%"
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-300">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
