'use client';

import { COLOR_PALETTE } from '@/lib/gantt-colors';

export default function GanttLegend() {
  const sampleResources = [
    'Civil Crew',
    'Steel Team',
    'Layout Team',
    'Electrical',
    'Plumbing',
    'HVAC',
  ];

  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50 border-t rounded-b-lg flex-wrap">
      <span className="text-sm font-medium text-gray-700">Resources:</span>
      {sampleResources.slice(0, 6).map((resource, index) => (
        <div key={resource} className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: COLOR_PALETTE[index % COLOR_PALETTE.length] }}
          />
          <span className="text-xs text-gray-600">{resource}</span>
        </div>
      ))}
    </div>
  );
}
