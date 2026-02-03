import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { semesters, subjects } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, sql } from 'drizzle-orm';

/**
 * GET /api/semesters
 * Get all semesters for the current user with subject count
 */
export async function GET() {
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

    const userId = session.user.id;

    const semestersWithCounts = await db
      .select({
        id: semesters.id,
        name: semesters.name,
        start_date: semesters.start_date,
        end_date: semesters.end_date,
        is_active: semesters.is_active,
        created_at: semesters.created_at,
        subject_count: sql<number>`COALESCE(COUNT(${subjects.id}), 0)`.as('subject_count'),
      })
      .from(semesters)
      .leftJoin(subjects, eq(subjects.semester_id, semesters.id))
      .where(eq(semesters.user_id, userId))
      .groupBy(
        semesters.id,
        semesters.name,
        semesters.start_date,
        semesters.end_date,
        semesters.is_active,
        semesters.created_at
      )
      .orderBy(semesters.created_at);

    const data = semestersWithCounts.map((s) => ({
      ...s,
      start_date: new Date(s.start_date).toISOString(),
      end_date: new Date(s.end_date).toISOString(),
      subject_count: Number(s.subject_count),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching semesters:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch semesters' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/semesters
 * Create a new semester
 */
export async function POST(request: NextRequest) {
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

    const userId = session.user.id;
    const body = await request.json();

    if (!body.name || !body.start_date || !body.end_date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [newSemester] = await db
      .insert(semesters)
      .values({
        user_id: userId,
        name: body.name.trim(),
        start_date: body.start_date,
        end_date: body.end_date,
        is_active: body.is_active ?? true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newSemester,
    });
  } catch (error) {
    console.error('Error creating semester:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create semester' },
      { status: 500 }
    );
  }
}
