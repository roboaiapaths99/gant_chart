import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check database connection
    await prisma.$connect();
    
    // Get all tasks to calculate resource utilization
    const tasks = await prisma.task.findMany({
      include: {
        project: true,
      },
    });

    // Calculate resource utilization
    const resourceMap = new Map<string, { totalTasks: number; completedTasks: number; totalDuration: number }>();

    tasks.forEach(task => {
      const resource = task.resourceNames || 'Unassigned';
      const current = resourceMap.get(resource) || { totalTasks: 0, completedTasks: 0, totalDuration: 0 };
      
      resourceMap.set(resource, {
        totalTasks: current.totalTasks + 1,
        completedTasks: current.completedTasks + (task.progress === 100 ? 1 : 0),
        totalDuration: current.totalDuration + task.duration,
      });
    });

    // Convert to response format
    const resources = Array.from(resourceMap.entries()).map(([name, data]) => {
      const utilization = data.totalTasks > 0 ? Math.round((data.completedTasks / data.totalTasks) * 100) : 0;
      
      // Assign colors based on resource names
      const colorMap: Record<string, string> = {
        'Civil Crew': '#6B7280',
        'Steel fixers': '#1E40AF',
        'Concrete team': '#D97706',
        'Formwork+Steel': '#7C3AED',
        'Management': '#059669',
        'Unassigned': '#9CA3AF',
      };

      return {
        name,
        color: colorMap[name] || '#9CA3AF',
        utilization,
        totalTasks: data.totalTasks,
        completedTasks: data.completedTasks,
        totalDuration: data.totalDuration,
      };
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching resource workload:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch resource workload' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
