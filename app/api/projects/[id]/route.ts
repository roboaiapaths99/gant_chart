import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getProjectById, getTasksByProjectId } from '@/lib/mock-data';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if database is available
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.log('Database not available, returning fallback project');
      
      // Return comprehensive mock data when database is not available
      const mockProject = getProjectById(params.id) || {
        id: params.id,
        name: 'Demo Project',
        description: 'This is a demo project showing Gantt chart functionality',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: false,
        shareToken: null,
        status: 'active',
        budget: 5000000,
        startDate: '2026-05-01',
        endDate: '2026-08-31',
        location: 'Demo Location',
        client: 'Demo Client',
        progress: 35,
        tasks: []
      };
      
      const mockTasks = getTasksByProjectId(params.id);
      
      return NextResponse.json({ project: mockProject, tasks: mockTasks });
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        tasks: {
          orderBy: [{ taskId: 'asc' }],
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, description, isPublic } = body;

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(isPublic !== undefined && { isPublic }),
      },
    });

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
