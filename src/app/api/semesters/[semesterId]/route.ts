import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { semesters } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, and } from 'drizzle-orm';

interface RouteParams {
  params: Promise<{ semesterId: string }>;
}

/**
 * GET /api/semesters/[semesterId]
 * Get a single semester by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { semesterId } = await params;
    const userId = session.user.id;

    const [semester] = await db
      .select()
      .from(semesters)
      .where(and(eq(semesters.id, semesterId), eq(semesters.user_id, userId)))
      .limit(1);

    if (!semester) {
      return NextResponse.json(
        { success: false, error: 'Semester not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...semester,
        start_date: new Date(semester.start_date).toISOString(),
        end_date: new Date(semester.end_date).toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching semester:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch semester' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/semesters/[semesterId]
 * Delete a semester
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { semesterId } = await params;
    const userId = session.user.id;

    // Verify ownership before deleting
    const [semester] = await db
      .select()
      .from(semesters)
      .where(and(eq(semesters.id, semesterId), eq(semesters.user_id, userId)))
      .limit(1);

    if (!semester) {
      return NextResponse.json(
        { success: false, error: 'Semester not found' },
        { status: 404 }
      );
    }

    await db.delete(semesters).where(eq(semesters.id, semesterId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting semester:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete semester' },
      { status: 500 }
    );
  }
}
