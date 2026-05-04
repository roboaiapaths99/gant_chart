'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface BudgetData {
  month: string;
  planned: number;
  actual: number;
  variance: number;
}

interface BudgetAnalysisChartProps {
  data: BudgetData[];
}

export function BudgetAnalysisChart({ data }: BudgetAnalysisChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${(entry.value / 1000000).toFixed(2)}M
            </p>
          ))}
          {payload[0] && payload[1] && (
            <p className="text-sm text-gray-600 mt-1">
              Variance: {((payload[1].value - payload[0].value) / payload[0].value * 100).toFixed(1)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="planned"
            stackId="1"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.3}
            name="Planned"
          />
          <Area
            type="monotone"
            dataKey="actual"
            stackId="2"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.6}
            name="Actual"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
