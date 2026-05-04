'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, FolderOpen, Calendar, TrendingUp, Crown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import { Project } from '@/types';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load projects',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Project deleted successfully',
        });
        fetchProjects();
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete project',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="text-gray-600 font-medium mt-2">
            Manage your Gantt chart projects
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:shadow-xl transition-all shadow-lg shadow-purple-500/30">
            <Plus className="h-5 w-5 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-16 text-center shadow-xl">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FolderOpen className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-3">No projects yet</h3>
          <p className="text-gray-600 font-medium mb-8">Create your first project to get started</p>
          <Link href="/dashboard/projects/new">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transition-all shadow-lg shadow-blue-500/30">
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="p-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-3">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-sm text-gray-600 font-medium mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500 font-medium mb-4">
                  <span className="bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1 rounded-full">
                    {project._count?.tasks ?? project.tasks?.length ?? 0} tasks
                  </span>
                  <span>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Link href={`/dashboard/projects/${project.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200/50 hover:shadow-lg transition-all text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
