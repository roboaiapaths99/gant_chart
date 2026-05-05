'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Download, Calendar, Search, Maximize2, Minimize2, BarChart3, Clock, Users } from 'lucide-react';
import GanttChart, { Task } from '@/components/gantt/GanttChart';

interface Project {
  id: string;
  name: string;
  description?: string;
  _count?: {
    tasks: number;
  };
  progress?: number;
}

const TEMPLATES = [
  { id: "dark-forest", label: "Dark Forest", bg: "#1a2e1a", text: "#e8f0e8" },
  { id: "ocean-blue", label: "Ocean Blue", bg: "#0f172a", text: "#e2e8f0" },
  { id: "slate-pro", label: "Slate Pro", bg: "#1e293b", text: "#f1f5f9" },
  { id: "warm-ivory", label: "Warm Ivory", bg: "#3d4a2e", text: "#f0ead8" },
];

// Inline mock tasks to ensure the page works immediately
const mockTasks: Task[] = [
  {
    id: '1',
    taskId: 1,
    taskName: 'Site Preparation',
    duration: 5,
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    predecessors: '',
    resourceNames: 'Civil Crew',
    progress: 100
  },
  {
    id: '2',
    taskId: 2,
    taskName: 'Foundation Work',
    duration: 10,
    startDate: '2024-01-21',
    endDate: '2024-01-31',
    predecessors: '1',
    resourceNames: 'Steel fixers',
    progress: 85
  },
  {
    id: '3',
    taskId: 3,
    taskName: 'Steel Installation',
    duration: 8,
    startDate: '2024-02-01',
    endDate: '2024-02-09',
    predecessors: '2',
    resourceNames: 'Steel fixers',
    progress: 60
  },
  {
    id: '4',
    taskId: 4,
    taskName: 'Concrete Pouring',
    duration: 6,
    startDate: '2024-02-10',
    endDate: '2024-02-16',
    predecessors: '3',
    resourceNames: 'Concrete team',
    progress: 40
  },
  {
    id: '5',
    taskId: 5,
    taskName: 'Formwork Setup',
    duration: 7,
    startDate: '2024-02-17',
    endDate: '2024-02-24',
    predecessors: '4',
    resourceNames: 'Formwork+Steel fixer',
    progress: 25
  },
  {
    id: '6',
    taskId: 6,
    taskName: 'Quality Inspection',
    duration: 3,
    startDate: '2024-02-25',
    endDate: '2024-02-28',
    predecessors: '5',
    resourceNames: 'Management',
    progress: 0
  },
  {
    id: '7',
    taskId: 7,
    taskName: 'Final Finishing',
    duration: 5,
    startDate: '2024-03-01',
    endDate: '2024-03-06',
    predecessors: '6',
    resourceNames: 'Civil Crew',
    progress: 0
  },
  {
    id: '8',
    taskId: 8,
    taskName: 'Project Handover',
    duration: 2,
    startDate: '2024-03-07',
    endDate: '2024-03-09',
    predecessors: '7',
    resourceNames: 'Management',
    progress: 0
  }
];

export default function GanttViewPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [template, setTemplate] = useState("slate-pro");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Load projects from localStorage
    const localProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    setProjects(localProjects);
    
    // Load tasks from localStorage
    const localTasks = JSON.parse(localStorage.getItem('tasks') || '{}');
    if (localProjects.length > 0) {
      setTasks(localTasks[localProjects[0].id] || mockTasks);
      setSelectedProject(localProjects[0]);
    } else {
      setTasks(mockTasks);
    }
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    const localTasks = JSON.parse(localStorage.getItem('tasks') || '{}');
    setTasks(localTasks[project.id] || mockTasks);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.resourceNames || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Project Sidebar */}
      <div className="w-full lg:w-80 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 overflow-y-auto lg:h-screen">
        <div className="p-6 border-b border-gray-200/50">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Your Projects
          </h2>
          <p className="text-sm text-gray-600 font-medium">{projects.length} projects</p>
        </div>
        
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-purple-500 w-full text-sm font-medium"
            />
          </div>

          <div className="space-y-3">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  onClick={() => handleProjectSelect(project)}
                  className={`cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                    selectedProject?.id === project.id
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300/50 shadow-lg'
                      : 'bg-white/50 border-gray-200/50'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{project.name}</h3>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-gray-600 font-medium">
                      <div className="flex items-center">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        {project._count?.tasks || 0} tasks
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {project.progress || 0}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 font-medium">No projects found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className={`bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 md:px-8 py-4 shadow-xl transition-all duration-300 ${isFullscreen ? 'h-0 overflow-hidden p-0 border-0' : ''}`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {selectedProject?.name || 'Gantt View'}
                </h1>
                <p className="text-gray-600 font-medium">
                  {selectedProject?.description || 'Visual timeline of all projects'}
                </p>
              </div>
            </div>
            <div className="flex items-center flex-wrap gap-3">
              {TEMPLATES.map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => setTemplate(tpl.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                  style={template === tpl.id ? { background: tpl.bg, color: tpl.text, borderColor: tpl.bg } : { background: "transparent", color: "#6b7280", borderColor: "#e5e7eb" }}
                >{tpl.label}</button>
              ))}
              <div className="w-px bg-gray-200 mx-1"></div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleFullscreen}
                className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4 mr-2" /> : <Maximize2 className="h-4 w-4 mr-2" />}
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </Button>
              <div className="w-px bg-gray-200 mx-1"></div>
              <Button variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Link href="/dashboard/projects/new">
                <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:shadow-xl transition-all shadow-lg shadow-purple-500/30">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating fullscreen controls */}
        {isFullscreen && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 p-2">
            {TEMPLATES.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => setTemplate(tpl.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                style={template === tpl.id ? { background: tpl.bg, color: tpl.text, borderColor: tpl.bg } : { background: "transparent", color: "#6b7280", borderColor: "#e5e7eb" }}
              >{tpl.label}</button>
            ))}
            <div className="w-px bg-gray-200 mx-1"></div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleFullscreen}
              className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all"
            >
              <Minimize2 className="h-4 w-4 mr-2" />
              Exit Fullscreen
            </Button>
          </div>
        )}

        <div className="p-4 md:p-6">
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-purple-500 w-full font-medium"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl p-6 min-h-[700px]">
            <div className="mb-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-2">
                Project Timeline ({filteredTasks.length} tasks)
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600 font-medium">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            {filteredTasks.length > 0 ? (
              <div className="w-full overflow-auto" style={{ maxHeight: '600px' }}>
                <GanttChart key={selectedProject?.id || 'default'} tasks={filteredTasks} template={template as any} />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-gray-600 font-bold">No tasks to display</p>
                <p className="text-sm text-gray-500 font-medium mt-2">
                  {searchTerm ? 'Try adjusting your search' : 'Create a project to get started'}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
