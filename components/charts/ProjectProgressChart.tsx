'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ProjectProgressData {
  name: string;
  progress: number;
  budget: number;
  status: string;
}

interface ProjectProgressChartProps {
  data: ProjectProgressData[];
}

const COLORS = {
  active: '#3B82F6',
  completed: '#10B981',
  on_hold: '#F59E0B',
  planning: '#8B5CF6'
};

const STATUS_COLORS = {
  active: '#3B82F6',
  completed: '#10B981',
  'on-hold': '#F59E0B',
  planning: '#8B5CF6'
};

export function ProjectProgressChart({ data }: ProjectProgressChartProps) {
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ProjectProgressData;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">Progress: {data.progress}%</p>
          <p className="text-sm text-gray-600">Budget: ${(data.budget / 1000000).toFixed(1)}M</p>
          <p className="text-sm text-gray-600">Status: {data.status}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
            label={{ value: 'Progress (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="progress" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] || '#6B7280'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
