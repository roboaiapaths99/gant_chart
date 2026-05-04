'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface TaskData {
  date: string;
  completed: number;
  inProgress: number;
  notStarted: number;
  total: number;
}

interface TaskTimelineChartProps {
  data: TaskData[];
}

export function TaskTimelineChart({ data }: TaskTimelineChartProps) {
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: { color: string; name: string; value: number }, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
          {payload[0] && (
            <p className="text-sm text-gray-600 mt-1">
              Total: {payload.reduce((sum: number, entry: { value: number }) => sum + entry.value, 0)} tasks
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
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#E5E7EB" />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ fill: '#10B981', r: 4 }}
            name="Completed"
          />
          <Line
            type="monotone"
            dataKey="inProgress"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ fill: '#F59E0B', r: 4 }}
            name="In Progress"
          />
          <Line
            type="monotone"
            dataKey="notStarted"
            stroke="#6B7280"
            strokeWidth={2}
            dot={{ fill: '#6B7280', r: 4 }}
            name="Not Started"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
