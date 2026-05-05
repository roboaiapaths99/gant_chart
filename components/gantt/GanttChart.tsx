"use client";

import React, { useState, useRef, useEffect } from "react";

export interface Task {
  id: string;
  taskId: number;
  taskName: string;
  resourceNames: string | null;
  duration: number;
  startDate: string | Date;
  endDate: string | Date;
  predecessors: string | null;
  progress: number;
  [key: string]: any; // Allow extra properties from global Task
}

export interface Props {
  tasks: Task[];
  template?: string;
  onTaskClick?: (task: Task) => void;
}

const RESOURCE_COLORS: Record<string, string> = {
  "Civil Crew": "#3b82f6",
  "Steel fixers": "#ef4444", 
  "Concrete team": "#10b981",
  "Formwork+Steel fixer": "#f59e0b",
  "Management": "#8b5cf6",
  "Survey Team": "#06b6d4",
  "Excavators": "#dc2626",
  "Rebar Crew": "#059669",
  "Concrete Mixers": "#d97706",
  "Carpenters": "#7c3aed",
  "Clearing Crew": "#84cc16",
  "Heavy Equipment": "#f97316",
  "Pile Driving": "#eab308",
  "Foundation Team": "#6366f1",
  "Steel Workers": "#a855f7",
  "Utility Workers": "#e11d48",
  "Digging Crew": "#0ea5e9",
  "Concrete Finishers": "#fbbf24",
  "Riggers": "#f59e0b",
  "Cladding Team": "#10b981"
};

const THEME_TEMPLATES: Record<string, any> = {
  "dark-forest": {
    background: "#1e293b",
    headerBg: "#0f172a",
    gridBg: "#1e293b20",
    border: "#334155",
    text: "#f1f5f9",
    barColors: [
      { bg: "#3b82f6", border: "#3b82f6" },
      { bg: "#ef4444", border: "#ef4444" },
      { bg: "#10b981", border: "#10b981" },
      { bg: "#f59e0b", border: "#f59e0b" },
      { bg: "#8b5cf6", border: "#8b5cf6" },
      { bg: "#06b6d4", border: "#06b6d4" },
      { bg: "#dc2626", border: "#dc2626" },
      { bg: "#d97706", border: "#d97706" },
      { bg: "#fbbf24", border: "#fbbf24" },
      { bg: "#a855f7", border: "#a855f7" },
      { bg: "#e11d48", border: "#e11d48" },
      { bg: "#0ea5e9", border: "#0ea5e9" },
      { bg: "#fbbf24", border: "#fbbf24" },
      { bg: "#10b981", border: "#10b981" },
      { bg: "#f59e0b", border: "#f59e0b" },
      { bg: "#3b82f6", border: "#3b82f6" },
      { bg: "#ef4444", border: "#ef4444" },
      { bg: "#10b981", border: "#10b981" },
      { bg: "#f59e0b", border: "#f59e0b" },
      { bg: "#8b5cf6", border: "#8b5cf6" },
      { bg: "#06b6d4", border: "#06b6d4" },
      { bg: "#dc2626", border: "#dc2626" },
      { bg: "#d97706", border: "#d97706" },
      { bg: "#fbbf24", border: "#fbbf24" },
      { bg: "#a855f7", border: "#a855f7" },
      { bg: "#e11d48", border: "#e11d48" },
      { bg: "#0ea5e9", border: "#0ea5e9" },
      { bg: "#fbbf24", border: "#fbbf24" },
      { bg: "#10b981", border: "#10b981" },
      { bg: "#f59e0b", border: "#f59e0b" },
      { bg: "#3b82f6", border: "#3b82f6" },
      { bg: "#ef4444", border: "#ef4444" },
      { bg: "#f59e0b", border: "#f59e0b" },
      { bg: "#10b981", border: "#10b981" },
      { bg: "#8b5cf6", border: "#8b5cf6" },
      { bg: "#06b6d4", border: "#06b6d4" },
      { bg: "#dc2626", border: "#dc2626" },
      { bg: "#d97706", border: "#d97706" }
    ],
    todayLine: "#fbbf24",
    selectedBg: "#4a5c3a",
    hoverBg: "#4a5c3a"
  },
  "ocean-blue": {
    background: "#0f172a",
    headerBg: "#1e40af",
    gridBg: "#1e3a8a20",
    border: "#3b82f6",
    text: "#f8fafc",
    barColors: [
      { bg: "#0ea5e9", border: "#0ea5e9" },
      { bg: "#3b82f6", border: "#3b82f6" },
      { bg: "#10b981", border: "#10b981" },
      { bg: "#f59e0b", border: "#f59e0b" },
      { bg: "#6366f1", border: "#6366f1" },
      { bg: "#8b5cf6", border: "#8b5cf6" },
      { bg: "#06b6d4", border: "#06b6d4" },
      { bg: "#dc2626", border: "#dc2626" },
      { bg: "#d97706", border: "#d97706" },
      { bg: "#fbbf24", border: "#fbbf24" },
      { bg: "#a855f7", border: "#a855f7" },
      { bg: "#e11d48", border: "#e11d48" },
      { bg: "#0ea5e9", border: "#0ea5e9" },
      { bg: "#fbbf24", border: "#fbbf24" },
      { bg: "#10b981", border: "#10b981" },
      { bg: "#f59e0b", border: "#f59e0b" },
      { bg: "#3b82f6", border: "#3b82f6" },
      { bg: "#10b981", border: "#10b981" },
      { bg: "#f59e0b", border: "#f59e0b" },
      { bg: "#6366f1", border: "#6366f1" },
      { bg: "#8b5cf6", border: "#8b5cf6" },
      { bg: "#06b6d4", border: "#06b6d4" },
      { bg: "#dc2626", border: "#dc2626" },
      { bg: "#d97706", border: "#d97706" }
    ],
    todayLine: "#fbbf24",
    selectedBg: "#4a5c3a",
    hoverBg: "#4a5c3a"
  },
  "slate-pro": {
    background: "#f8fafc",
    headerBg: "#e2e8f0",
    gridBg: "#f1f5f920",
    border: "#cbd5e1",
    text: "#1e293b",
    barColors: [
      { bg: "#3b82f6", border: "#3b82f6" },
      { bg: "#ef4444", border: "#ef4444" },
      { bg: "#f59e0b", border: "#f59e0b" },
      { bg: "#10b981", border: "#10b981" },
      { bg: "#8b5cf6", border: "#8b5cf6" },
      { bg: "#06b6d4", border: "#06b6d4" },
      { bg: "#dc2626", border: "#dc2626" },
      { bg: "#d97706", border: "#d97706" },
      { bg: "#fbbf24", border: "#fbbf24" },
      { bg: "#a855f7", border: "#a855f7" },
      { bg: "#e11d48", border: "#e11d48" },
      { bg: "#0ea5e9", border: "#0ea5e9" },
      { bg: "#fbbf24", border: "#fbbf24" },
      { bg: "#10b981", border: "#10b981" },
      { bg: "#f59e0b", border: "#f59e0b" },
      { bg: "#3b82f6", border: "#3b82f6" },
      { bg: "#ef4444", border: "#ef4444" },
      { bg: "#f59e0b", border: "#f59e0b" },
      { bg: "#10b981", border: "#10b981" },
      { bg: "#8b5cf6", border: "#8b5cf6" },
      { bg: "#06b6d4", border: "#06b6d4" },
      { bg: "#dc2626", border: "#dc2626" },
      { bg: "#d97706", border: "#d97706" }
    ],
    todayLine: "#f59e0b",
    selectedBg: "#dcfce7",
    hoverBg: "#f1f5f9"
  },
  "warm-ivory": {
    background: "#fef3c7",
    headerBg: "#fff7ed",
    gridBg: "#fef3c720",
    border: "#d97706",
    text: "#78350f",
    barColors: [
      { bg: "#d97706", border: "#d97706" },
      { bg: "#fbbf24", border: "#fbbf24" },
      { bg: "#f59e0b", border: "#f59e0b" },
      { bg: "#a855f7", border: "#a855f7" },
      { bg: "#e11d48", border: "#e11d48" },
      { bg: "#0ea5e9", border: "#0ea5e9" },
      { bg: "#3b82f6", border: "#3b82f6" },
      { bg: "#ef4444", border: "#ef4444" },
      { bg: "#10b981", border: "#10b981" },
      { bg: "#f59e0b", border: "#f59e0b" },
      { bg: "#6366f1", border: "#6366f1" },
      { bg: "#8b5cf6", border: "#8b5cf6" },
      { bg: "#06b6d4", border: "#06b6d4" },
      { bg: "#dc2626", border: "#dc2626" },
      { bg: "#fbbf24", border: "#fbbf24" },
      { bg: "#a855f7", border: "#a855f7" },
      { bg: "#e11d48", border: "#e11d48" },
      { bg: "#0ea5e9", border: "#0ea5e9" },
      { bg: "#fbbf24", border: "#fbbf24" },
      { bg: "#10b981", border: "#10b981" },
      { bg: "#f59e0b", border: "#f59e0b" },
      { bg: "#3b82f6", border: "#3b82f6" },
      { bg: "#ef4444", border: "#ef4444" },
      { bg: "#f59e0b", border: "#f59e0b" },
      { bg: "#10b981", border: "#10b981" },
      { bg: "#8b5cf6", border: "#8b5cf6" },
      { bg: "#06b6d4", border: "#06b6d4" },
      { bg: "#dc2626", border: "#dc2626" },
      { bg: "#d97706", border: "#d97706" }
    ],
    todayLine: "#f59e0b",
    selectedBg: "#fef3c7",
    hoverBg: "#fef3c7"
  }
};

export default function GanttChart({ tasks, template = "slate-pro", onTaskClick }: Props) {
  const [zoom, setZoom] = useState(1);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentTheme = THEME_TEMPLATES[template] || THEME_TEMPLATES["slate-pro"];

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-lg font-semibold text-gray-700">No tasks to display</p>
          <p className="text-sm text-gray-500 mt-2">Upload an Excel file to generate your Gantt chart</p>
        </div>
      </div>
    );
  }

  const allDates = tasks.flatMap(t => [new Date(t.startDate), new Date(t.endDate)]);
  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000*60*60*24)) + 1;
  
  const getLeft = (date: string | Date) => {
    const d = new Date(date);
    const days = Math.ceil((d.getTime() - minDate.getTime()) / (1000*60*60*24));
    return (days / totalDays) * 100;
  };
  
  const getWidth = (start: string | Date, end: string | Date) => {
    const s = new Date(start), e = new Date(end);
    const days = Math.ceil((e.getTime() - s.getTime()) / (1000*60*60*24)) + 1;
    return Math.max((days / totalDays) * 100, 1);
  };

  const diff = maxDate.getTime() - minDate.getTime();
  const todayPct = diff <= 0 ? 0 : ((new Date().getTime() - minDate.getTime()) / diff) * 100;

  const months: string[] = [];
  const cur = new Date(minDate);
  cur.setDate(1);
  while (cur <= maxDate) {
    months.push(cur.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }));
    cur.setMonth(cur.getMonth() + 1);
  }

  const barW = Math.round(1000 * zoom);
  const nameW = 220;
  const resW = 140;

  return (
    <>
      <div className="rounded-xl shadow-lg overflow-hidden border" style={{ background: currentTheme.background, borderColor: currentTheme.border }}>
        <div className="overflow-auto" style={{ maxHeight: '600px' }}>
          <div className="flex gap-0" style={{ minWidth: nameW + resW + barW + "px" }}>
            {/* Left: task names */}
            <div style={{ width: nameW, flexShrink: 0 }}>
              <div className="h-12 border-b border-r flex items-center px-4" style={{ background: currentTheme.headerBg, borderColor: currentTheme.border }}>
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: currentTheme.text }}>Task Name</span>
              </div>
              {tasks.map((task, i) => (
                <div
                  key={task.id}
                  className={`h-14 border-b border-r flex items-center px-4 cursor-pointer transition-all duration-200 ${
                    selectedTask?.id === task.id 
                      ? "border-l-4" 
                      : hoveredTask?.id === task.id 
                        ? "border-l-4" 
                        : ""
                  }`}
                  style={{
                    borderColor: currentTheme.border,
                    backgroundColor: selectedTask?.id === task.id 
                      ? currentTheme.selectedBg 
                      : hoveredTask?.id === task.id 
                        ? currentTheme.hoverBg 
                        : i % 2 === 0 
                          ? "transparent" 
                          : currentTheme.gridBg,
                    borderLeftColor: selectedTask?.id === task.id 
                      ? currentTheme.todayLine 
                      : hoveredTask?.id === task.id 
                        ? currentTheme.text 
                        : "transparent"
                  }}
                  onClick={() => {
                    setSelectedTask(task);
                    if (onTaskClick) onTaskClick(task);
                  }}
                  onMouseEnter={() => setHoveredTask(task)}
                  onMouseLeave={() => setHoveredTask(null)}
                >
                  <div>
                    <div className="text-sm font-semibold truncate" style={{ maxWidth: nameW - 32, color: currentTheme.text }}>{task.taskName}</div>
                    <div className="text-xs mt-0.5" style={{ color: currentTheme.text, opacity: 0.7 }}>{task.resourceNames}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Middle: resource */}
            <div style={{ width: resW, flexShrink: 0 }}>
              <div className="h-12 border-b border-r flex items-center px-4" style={{ background: currentTheme.headerBg, borderColor: currentTheme.border }}>
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: currentTheme.text }}>Resource</span>
              </div>
              {tasks.map((task, i) => (
                <div key={task.id} className={`h-14 border-b border-r flex items-center px-4 transition-all duration-200`} style={{
                  borderColor: currentTheme.border,
                  backgroundColor: i % 2 === 0 ? "transparent" : currentTheme.gridBg
                }}>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: (task.resourceNames && RESOURCE_COLORS[task.resourceNames]) || currentTheme.text }}>
                    <span className="w-2.5 h-2.5 rounded-full inline-block shadow-sm" style={{ background: (task.resourceNames && RESOURCE_COLORS[task.resourceNames]) || currentTheme.text }}></span>
                    {task.resourceNames || 'Unassigned'}
                  </span>
                </div>
              ))}
            </div>

            {/* Right: bars */}
            <div style={{ width: barW, flexShrink: 0, overflowX: "auto" }}>
              {/* Month headers */}
              <div className="h-12 border-b flex" style={{ width: barW, background: currentTheme.headerBg, borderColor: currentTheme.border }}>
                {months.map((m, i) => (
                  <div key={i} className="flex-1 text-center text-xs font-semibold border-r flex items-center justify-center" style={{ color: currentTheme.text, borderColor: currentTheme.border }}>
                    {m}
                  </div>
                ))}
              </div>
              {/* Bar rows */}
              <div style={{ position: "relative", width: barW }}>
                {/* Today line */}
                {todayPct >= 0 && todayPct <= 100 && (
                  <div style={{ 
                    position: "absolute", 
                    left: `${todayPct}%`, 
                    top: 0, 
                    bottom: 0, 
                    width: 2, 
                    background: `linear-gradient(to bottom, ${currentTheme.todayLine}, ${currentTheme.todayLine})`, 
                    zIndex: 10, 
                    opacity: 0.9,
                    boxShadow: `0 0 8px ${currentTheme.todayLine}40`
                  }}>
                    <span style={{ 
                      position: "absolute", 
                      top: -24, 
                      left: "50%", 
                      transform: "translateX(-50%)", 
                      background: `linear-gradient(135deg, ${currentTheme.todayLine} 0%, ${currentTheme.todayLine} 100%)`, 
                      color: currentTheme.text, 
                      fontSize: 10, 
                      padding: "3px 8px", 
                      borderRadius: 6, 
                      whiteSpace: "nowrap",
                      fontWeight: 600,
                      boxShadow: `0 2px 8px ${currentTheme.todayLine}30`
                    }}>Today</span>
                  </div>
                )}
                {tasks.map((task, i) => {
                  const left = getLeft(task.startDate);
                  const width = getWidth(task.startDate, task.endDate);
                  const colorScheme = currentTheme.barColors[i % currentTheme.barColors.length];
                  const isSelected = selectedTask?.id === task.id;
                  const isHovered = hoveredTask?.id === task.id;
                  
                  return (
                    <div key={task.id} className={`h-14 border-b relative transition-all duration-200`} style={{
                      borderColor: currentTheme.border,
                      backgroundColor: i % 2 === 0 ? "transparent" : currentTheme.gridBg
                    }}>
                      {/* Dot grid line */}
                      <div className="absolute inset-0" style={{ 
                        backgroundImage: `radial-gradient(circle, ${currentTheme.border}20 1px, transparent 1px)`, 
                        backgroundSize: "24px 100%" 
                      }}></div>
                      {/* Bar */}
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 h-8 rounded-lg flex items-center cursor-pointer transition-all duration-300 shadow-md ${
                          isSelected ? "shadow-xl scale-105" : isHovered ? "shadow-lg scale-102" : ""
                        }`}
                        style={{ 
                          left: `${left}%`, 
                          width: `${width}%`, 
                          background: colorScheme.bg,
                          minWidth: 12,
                          border: `2px solid ${colorScheme.border}`
                        }}
                        onClick={() => {
                          setSelectedTask(task);
                          if (onTaskClick) onTaskClick(task);
                        }}
                        onMouseEnter={() => setHoveredTask(task)}
                        onMouseLeave={() => setHoveredTask(null)}
                        title={`${task.taskName} · ${task.progress}%`}
                      >
                        {/* Progress overlay */}
                        <div 
                          className="absolute left-0 top-0 bottom-0 rounded-l-lg transition-all duration-500" 
                          style={{ 
                            width: `${task.progress}%`,
                            background: "rgba(255, 255, 255, 0.3)",
                            backdropFilter: "blur(2px)"
                          }}
                        ></div>
                        <span className="relative z-10 text-white text-xs font-bold px-3 truncate drop-shadow-sm">
                          {task.progress > 0 ? task.progress + "%" : ""}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task detail slide-over */}
      {selectedTask && (
        <div className="fixed right-0 top-0 h-full w-full sm:w-96 shadow-2xl border-l z-50 overflow-y-auto animate-in slide-in-from-right duration-300" style={{
          background: currentTheme.background,
          borderColor: currentTheme.border
        }}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold" style={{ color: currentTheme.text }}>{selectedTask.taskName}</h3>
                <p className="text-sm mt-1" style={{ color: currentTheme.text, opacity: 0.7 }}>Task ID: {selectedTask.taskId}</p>
              </div>
              <button 
                onClick={() => setSelectedTask(null)} 
                className="text-2xl leading-none transition-colors"
                style={{ color: currentTheme.text, opacity: 0.6 }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="rounded-lg p-4" style={{
                background: `linear-gradient(135deg, ${currentTheme.todayLine}20 0%, ${currentTheme.todayLine}10 100%)`,
                border: `1px solid ${currentTheme.todayLine}30`
              }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: currentTheme.text }}>Progress</span>
                  <span className="text-sm font-bold" style={{ color: currentTheme.text }}>{selectedTask.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${selectedTask.progress}%`,
                      background: currentTheme.todayLine
                    }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg p-4" style={{ background: `${currentTheme.gridBg}40`, border: `1px solid ${currentTheme.border}30` }}>
                  <div className="text-xs mb-1" style={{ color: currentTheme.text, opacity: 0.7 }}>Start Date</div>
                  <div className="text-sm font-semibold" style={{ color: currentTheme.text }}>
                    {new Date(selectedTask.startDate).toLocaleDateString("en-IN")}
                  </div>
                </div>
                <div className="rounded-lg p-4" style={{ background: `${currentTheme.gridBg}40`, border: `1px solid ${currentTheme.border}30` }}>
                  <div className="text-xs mb-1" style={{ color: currentTheme.text, opacity: 0.7 }}>End Date</div>
                  <div className="text-sm font-semibold" style={{ color: currentTheme.text }}>
                    {new Date(selectedTask.endDate).toLocaleDateString("en-IN")}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2" style={{ borderBottom: `1px solid ${currentTheme.border}30` }}>
                  <span className="text-sm" style={{ color: currentTheme.text, opacity: 0.7 }}>Resource</span>
                  <span className="text-sm font-semibold" style={{ color: currentTheme.text }}>{selectedTask.resourceNames}</span>
                </div>
                <div className="flex justify-between items-center py-2" style={{ borderBottom: `1px solid ${currentTheme.border}30` }}>
                  <span className="text-sm" style={{ color: currentTheme.text, opacity: 0.7 }}>Duration</span>
                  <span className="text-sm font-semibold" style={{ color: currentTheme.text }}>{selectedTask.duration} days</span>
                </div>
                <div className="flex justify-between items-center py-2" style={{ borderBottom: `1px solid ${currentTheme.border}30` }}>
                  <span className="text-sm" style={{ color: currentTheme.text, opacity: 0.7 }}>Predecessors</span>
                  <span className="text-sm font-semibold" style={{ color: currentTheme.text }}>{selectedTask.predecessors || "None"}</span>
                </div>
              </div>

              <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${currentTheme.border}30` }}>
                <button className="w-full py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg" style={{
                  background: `linear-gradient(135deg, ${currentTheme.todayLine}, ${currentTheme.todayLine}dd)`,
                  color: currentTheme.background
                }}>
                  Edit Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
