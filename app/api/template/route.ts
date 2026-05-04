import { NextResponse } from 'next/server';
import { generateTemplate } from '@/lib/template-generator';

export async function GET() {
  try {
    const templateBuffer = generateTemplate();
    
    return new NextResponse(new Uint8Array(templateBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="GanttFlow_Project_Template.xlsx"',
      },
    });
  } catch (error) {
    console.error('Error generating template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate template' },
      { status: 500 }
    );
  }
}
