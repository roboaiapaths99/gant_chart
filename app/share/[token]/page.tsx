'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const GanttChart = dynamic(() => import("@/components/gantt/GanttChart"), { ssr: false });

export default function SharePage() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProject();
  }, [params.token]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/share/${params.token}`);
      const data = await response.json();
      if (data.success) {
        setProject(data.project);
      } else {
        setError(data.error || 'Failed to load project');
      }
    } catch (err) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-lg border p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Project Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'This project may have been deleted or is no longer public.'}
          </p>
          <Link href="/">
            <Button>Go to GanttFlow</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            {project.description && (
              <p className="text-gray-600">{project.description}</p>
            )}
          </div>
          <Link href="/">
            <Button variant="outline">Powered by GanttFlow</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border overflow-hidden">
          <GanttChart tasks={project.tasks} />
        </div>
      </div>
    </div>
  );
}
