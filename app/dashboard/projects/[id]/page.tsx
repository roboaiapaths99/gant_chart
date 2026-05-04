"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const GanttChart = dynamic(() => import("@/components/gantt/GanttChart"), { ssr: false });

const TEMPLATES = [
  { id: "dark-forest", label: "Dark Forest", bg: "#1a2e1a", text: "#e8f0e8" },
  { id: "ocean-blue", label: "Ocean Blue", bg: "#0f172a", text: "#e2e8f0" },
  { id: "slate-pro", label: "Slate Pro", bg: "#1e293b", text: "#f1f5f9" },
  { id: "warm-ivory", label: "Warm Ivory", bg: "#3d4a2e", text: "#f0ead8" },
];

import { Project, Task } from "@/types";

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [template, setTemplate] = useState("slate-pro");
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    // First try to get data from localStorage (for uploaded files)
    const projectId = Array.isArray(id) ? id[0] : id;
    const localProjects: Project[] = JSON.parse(localStorage.getItem('projects') || '[]');
    const localProject = localProjects.find((p: Project) => p.id === projectId);
    
    if (localProject) {
      setProject(localProject);
      const localTasks = JSON.parse(localStorage.getItem('tasks') || '{}');
      setTasks(localTasks[projectId as string] || []);
      setLoading(false);
    } else {
      // Fall back to API
      fetch(`/api/projects/${projectId}`)
        .then(r => r.json())
        .then(data => {
          setProject(data.project);
          setTasks(data.tasks || []);
          setLoading(false);
        });
    }
  }, [id]);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Create a simple PDF export using browser print functionality
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${project?.name} - Gantt Chart</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #333; }
                .project-info { margin-bottom: 20px; }
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="project-info">
                <h1>${project?.name}</h1>
                <p>Generated on ${new Date().toLocaleDateString()}</p>
                <p>Tasks: ${tasks.length} | Progress: ${avgProgress}%</p>
              </div>
              <div>
                <p>Gantt chart would be rendered here in a real implementation</p>
                <ul>
                  ${tasks.map(task => `<li>${task.taskName} - ${task.progress}% complete</li>`).join('')}
                </ul>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
      toast({
        title: "Export Started",
        description: "PDF export has been initiated",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to export PDF",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      // Create shareable link
      const shareableUrl = `${window.location.origin}/dashboard/projects/${id}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareableUrl);
      
      toast({
        title: "Link Copied",
        description: "Project link has been copied to clipboard",
      });
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const shareableUrl = `${window.location.origin}/dashboard/projects/${id}`;
      const textArea = document.createElement("textarea");
      textArea.value = shareableUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Link Copied",
        description: "Project link has been copied to clipboard",
      });
    } finally {
      setIsSharing(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500">Loading project...</p>
      </div>
    </div>
  );

  const done = tasks.filter(t => t.progress === 100).length;
  const avgProgress = tasks.length ? Math.round(tasks.reduce((s, t) => s + t.progress, 0) / tasks.length) : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium text-gray-900">{project?.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{tasks.length} tasks · {avgProgress}% complete · {done} done</p>
          </div>
          <div className="flex gap-2">
            {TEMPLATES.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => setTemplate(tpl.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                style={template === tpl.id ? { background: tpl.bg, color: tpl.text, borderColor: tpl.bg } : { background: "transparent", color: "#6b7280", borderColor: "#e5e7eb" }}
              >{tpl.label}</button>
            ))}
            <div className="w-px bg-gray-200 mx-1"></div>
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">— Zoom out</button>
            <button onClick={() => setZoom(z => Math.min(2.5, z + 0.2))} className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Zoom in +</button>
            <button onClick={handleExportPDF} disabled={isExporting} className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </button>
            <button onClick={handleShare} disabled={isSharing} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
              {isSharing ? 'Sharing...' : 'Share'}
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: avgProgress + "%" }}></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50">
        {[["Total tasks", tasks.length],["Completed", done],["In progress", tasks.filter(t=>t.progress>0&&t.progress<100).length],["Not started", tasks.filter(t=>t.progress===0).length]].map(([l,v])=>(
          <div key={l} className="px-6 py-3 border-r border-gray-200 last:border-r-0">
            <div className="text-lg font-medium text-gray-900">{v}</div>
            <div className="text-xs text-gray-500">{l}</div>
          </div>
        ))}
      </div>

      {/* Gantt chart */}
      <div className="flex-1 overflow-auto p-4 bg-white" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-5xl mb-4">📋</p>
              <p className="font-medium text-lg">No tasks found</p>
              <p className="text-sm mt-1">This project has no tasks yet</p>
            </div>
          </div>
        ) : (
          <GanttChart tasks={tasks} template={template as any} />
        )}
      </div>

      {/* Legend */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center gap-6 flex-wrap">
        {[["Civil Crew","#6B7280"],["Steel fixers","#1E40AF"],["Concrete team","#D97706"],["Formwork+Steel","#7C3AED"],["Management","#059669"]].map(([name,color])=>(
          <div key={name} className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-3 h-3 rounded" style={{ background: color }}></span>{name}
          </div>
        ))}
        <div className="flex items-center gap-2 text-xs text-gray-500 ml-4">
          <span className="w-0.5 h-4 bg-red-500 inline-block"></span>Today
        </div>
      </div>
    </div>
  );
}
