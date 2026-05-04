'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ResourceData {
  name: string;
  utilization: number;
  color: string;
  totalTasks: number;
  completedTasks: number;
}

interface ResourceUtilizationChartProps {
  data: ResourceData[];
}

const COLORS = [
  '#6B7280', // Civil Crew
  '#1E40AF', // Steel fixers
  '#D97706', // Concrete team
  '#7C3AED', // Formwork+Steel
  '#059669', // Management
];

export function ResourceUtilizationChart({ data }: ResourceUtilizationChartProps) {
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ResourceData;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">Utilization: {data.utilization}%</p>
          <p className="text-sm text-gray-600">Tasks: {data.completedTasks}/{data.totalTasks}</p>
          <p className="text-sm text-gray-600">Completion Rate: {Math.round((data.completedTasks / data.totalTasks) * 100)}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (cx === undefined || cy === undefined || midAngle === undefined || innerRadius === undefined || outerRadius === undefined || percent === undefined) {
      return null;
    }
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.1) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="utilization"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value: string, entry: any) => (
              <span className="text-sm">{value} ({entry.payload.utilization}%)</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
