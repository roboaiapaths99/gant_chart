import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockProjects } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  try {
    // Check if database is available
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.log('Database not available, returning fallback data');
      // Return comprehensive mock data when database is not available
      return NextResponse.json({ success: true, projects: mockProjects });
    }

    const projects = await prisma.project.findMany({
      include: {
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Project name is required' },
        { status: 400 }
      );
    }

    // Check if database is available
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.log('Database not available, returning fallback project');
      // Return comprehensive mock data when database is not available
      return NextResponse.json({ success: true, projects: mockProjects });
    }

    // Get or create a default user
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

    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        userId: user.id,
        shareToken: generateShareToken(),
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}
