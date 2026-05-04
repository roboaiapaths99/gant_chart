'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, FolderOpen, Calendar, TrendingUp, Crown, BarChart3, Users, Target, Activity, Upload, Download, Settings, Bell, FileSpreadsheet, Maximize2, Minimize2 } from 'lucide-react';

// Default mock data
const defaultProjects = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website',
    createdAt: '2024-01-15',
    _count: { tasks: 12 },
    progress: 75,
    status: 'active'
  },
  {
    id: '2', 
    name: 'Mobile App Development',
    description: 'Native iOS and Android applications',
    createdAt: '2024-01-20',
    _count: { tasks: 8 },
    progress: 45,
    status: 'active'
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    description: 'Q2 2024 digital marketing initiative',
    createdAt: '2024-02-01',
    _count: { tasks: 15 },
    progress: 30,
    status: 'planning'
  }
];

const mockTeam = [
  { id: 1, name: 'John Doe', role: 'Project Manager', avatar: 'JD', status: 'online' },
  { id: 2, name: 'Jane Smith', role: 'Developer', avatar: 'JS', status: 'online' },
  { id: 3, name: 'Mike Johnson', role: 'Designer', avatar: 'MJ', status: 'offline' },
  { id: 4, name: 'Sarah Wilson', role: 'QA Engineer', avatar: 'SW', status: 'online' }
];

const recentActivities = [
  { id: 1, action: 'Task completed', project: 'Website Redesign', time: '2 hours ago', user: 'John Doe' },
  { id: 2, action: 'New project created', project: 'Marketing Campaign', time: '5 hours ago', user: 'Jane Smith' },
  { id: 3, action: 'File uploaded', project: 'Mobile App Development', time: '1 day ago', user: 'Mike Johnson' },
  { id: 4, action: 'Team member added', project: 'Website Redesign', time: '2 days ago', user: 'Sarah Wilson' }
];

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  _count: {
    tasks: number;
  };
  progress: number;
  status: string;
}

export default function DashboardPage() {
  // Get projects from localStorage or use defaults
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  useEffect(() => {
    try {
      const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      if (storedProjects.length > 0) {
        setProjects(storedProjects);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const team = mockTeam;
  const activities = recentActivities;

  const totalTasks = projects.reduce((sum, p) => sum + (p._count?.tasks || 0), 0);
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
    : 0;
  const activeProjects = projects.filter(p => p.status === 'active').length;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Sidebar */}
      <div className={`bg-white/80 backdrop-blur-xl border-r border-gray-200/50 transition-all duration-300 ${isFullscreen ? 'w-0 overflow-hidden' : 'w-full lg:w-64'}`}>
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">GanttFlow</h1>
              <p className="text-xs text-gray-500 font-medium">Project Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all">
            <Target className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/dashboard/projects" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group">
            <FolderOpen className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
            <span className="group-hover:text-gray-900">Projects</span>
          </Link>
          <Link href="/dashboard/gantt" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group">
            <Calendar className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
            <span className="group-hover:text-gray-900">Gantt View</span>
          </Link>
          <Link href="/dashboard/team" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group">
            <Users className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
            <span className="group-hover:text-gray-900">Team</span>
          </Link>
          <Link href="/dashboard/upload" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group">
            <Upload className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
            <span className="group-hover:text-gray-900">Upload File</span>
          </Link>
          <Link href="/dashboard/spreadsheet" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group">
            <FileSpreadsheet className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
            <span className="group-hover:text-gray-900">Spreadsheet Entry</span>
          </Link>
          <Link href="/dashboard/reports" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group">
            <BarChart3 className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
            <span className="group-hover:text-gray-900">Reports</span>
          </Link>
          <Link href="/dashboard/billing" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group">
            <Crown className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
            <span className="group-hover:text-gray-900">Billing</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group">
            <Settings className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
            <span className="group-hover:text-gray-900">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200/50">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-2xl p-5 shadow-xl shadow-purple-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-bold text-white">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-white/90 mb-4 leading-relaxed">Unlock unlimited projects, advanced analytics, and priority support</p>
            <Button size="sm" className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold shadow-lg">
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">Welcome back!</h1>
              <p className="text-gray-600 mt-2 text-lg">Here's what's happening with your projects</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-lg hover:shadow-xl transition-all">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleFullscreen}
                className="bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-lg hover:shadow-xl transition-all"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4 mr-2" /> : <Maximize2 className="h-4 w-4 mr-2" />}
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </Button>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl shadow-purple-500/30">
                JD
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Projects</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">{projects.length}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30">
                  <FolderOpen className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Tasks</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mt-2">
                    {projects.reduce((sum, p) => sum + p._count.tasks, 0)}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/30">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Active Projects</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent mt-2">{activeProjects}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30">
                  <Target className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Avg Progress</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent mt-2">{avgProgress}%</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Projects Section */}
            <div className="col-span-2">
              <Card className="p-6 bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Recent Projects</h2>
                  <Link href="/dashboard/projects">
                    <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">View All</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-5 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-200/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg">{project.name}</h3>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">{project.description}</p>
                        </div>
                        <div className="ml-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/30">
                            {project.name.charAt(0)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">{project._count?.tasks || 0} tasks</span>
                        <div className="flex items-center gap-3">
                          <div className="w-28 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all shadow-lg"
                              style={{ width: `${project.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-gray-700 font-semibold">{project.progress || 0}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <Card className="p-6 bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-5">Quick Actions</h2>
                <div className="space-y-3">
                  <Link href="/dashboard/projects/new" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-start bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                      <Plus className="h-4 w-4 mr-2" />
                      New Project
                    </Button>
                  </Link>
                  <Link href="/dashboard/gantt" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-start bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Gantt Chart
                    </Button>
                  </Link>
                  <Link href="/dashboard/upload" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-start bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Files
                    </Button>
                  </Link>
                  <Link href="/dashboard/spreadsheet" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-start bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Spreadsheet Entry
                    </Button>
                  </Link>
                  <Link href="/dashboard/reports" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-start bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
