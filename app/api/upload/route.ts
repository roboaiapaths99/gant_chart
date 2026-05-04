import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseExcelFile } from '@/lib/excel-parser';
import { Plan } from '@prisma/client';

const PLAN_LIMITS: Record<Plan, { maxTasks: number }> = {
  FREE: { maxTasks: 20 },
  PRO: { maxTasks: 200 },
  BUSINESS: { maxTasks: 500 },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const projectName = formData.get('projectName') as string;
    const projectDescription = formData.get('description') as string;
    const isPublic = formData.get('isPublic') === 'true';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!projectName) {
      return NextResponse.json(
        { success: false, error: 'Project name is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (
      !file.name.endsWith('.xlsx') &&
      !file.name.endsWith('.xls') &&
      !file.name.endsWith('.csv')
    ) {
      return NextResponse.json(
        { success: false, error: 'Only .xlsx, .xls, and .csv files are supported' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parseResult = parseExcelFile(buffer);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to parse file',
          details: parseResult.errors,
        },
        { status: 400 }
      );
    }

    // Check if database is available
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.log('Database not available, creating fallback project');
      
      // Create fallback project when database is not available
      const fallbackProject = {
        id: `demo-${Date.now()}`,
        name: projectName,
        description: projectDescription || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic,
        shareToken: generateShareToken(),
        tasks: parseResult.tasks.map((task, index) => ({
          id: `task-${index + 1}`,
          projectId: `demo-${Date.now()}`,
          taskId: task.taskId,
          taskName: task.taskName,
          duration: task.duration,
          startDate: task.startDate.toISOString(),
          endDate: task.endDate.toISOString(),
          predecessors: task.predecessors,
          resourceNames: task.resourceNames,
          progress: task.progress,
          createdAt: new Date().toISOString(),
        })),
      };
      
      return NextResponse.json({ 
        success: true, 
        project: fallbackProject,
        message: 'Project created in demo mode (database not available)'
      });
    }

    // Get or create default user
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'demo@ganttflow.com',
          name: 'Demo User',
          password: 'demo',
        },
      });
    }

    // Create project with tasks
    const project = await prisma.project.create({
      data: {
        name: projectName,
        description: projectDescription || null,
        userId: user.id,
        isPublic,
        shareToken: generateShareToken(),
        tasks: {
          create: parseResult.tasks.map((task) => ({
            taskId: task.taskId,
            taskName: task.taskName,
            duration: task.duration,
            startDate: task.startDate,
            endDate: task.endDate,
            predecessors: task.predecessors || null,
            resourceNames: task.resourceNames || null,
            progress: task.progress,
          })),
        },
      },
      include: {
        tasks: true,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}
