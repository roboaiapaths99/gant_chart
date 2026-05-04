import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get or create default user (since auth is disabled)
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

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { tasks: true },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Check export limits
    const exportLimits: Record<string, number> = {
      FREE: 5,
      PRO: 50,
      BUSINESS: 999999,
    };

    // For now, just return success - actual PDF generation would be done here
    return NextResponse.json({ 
      success: true, 
      message: 'Export feature - would generate PDF here' 
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export project' },
      { status: 500 }
    );
  }
}
