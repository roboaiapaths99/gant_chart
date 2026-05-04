import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { shareToken: params.token, isPublic: true },
      include: {
        tasks: {
          orderBy: [{ taskId: 'asc' }],
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found or not public' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Error fetching shared project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}
