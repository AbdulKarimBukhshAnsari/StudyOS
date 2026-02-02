import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { semesters, subjects, topics } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, and, sql } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

interface RouteParams {
  params: Promise<{ semesterId: string }>;
}

/**
 * GET /api/semesters/[semesterId]/subjects
 * Get all subjects for a semester with topic count
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

    // Verify semester ownership
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

    // Get subjects with topic counts
    const subjectsWithCounts = await db
      .select({
        id: subjects.id,
        name: subjects.name,
        description: subjects.description,
        priority: subjects.priority,
        semester_id: subjects.semester_id,
        created_at: subjects.created_at,
        topic_count: sql<number>`COALESCE(COUNT(${topics.id}), 0)`.as('topic_count'),
      })
      .from(subjects)
      .leftJoin(topics, eq(topics.subject_id, subjects.id))
      .where(eq(subjects.semester_id, semesterId))
      .groupBy(
        subjects.id,
        subjects.name,
        subjects.description,
        subjects.priority,
        subjects.semester_id,
        subjects.created_at
      )
      .orderBy(subjects.priority, subjects.created_at);

    const data = subjectsWithCounts.map((s) => ({
      ...s,
      topic_count: Number(s.topic_count),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subjects' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/semesters/[semesterId]/subjects
 * Create a new subject for a semester
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
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
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Subject name is required' },
        { status: 400 }
      );
    }

    // Verify semester ownership
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

    // Create subject
    const [newSubject] = await db
      .insert(subjects)
      .values({
        semester_id: semesterId,
        name: body.name.trim(),
        description: body.description?.trim() || null,
        priority: body.priority ?? 1,
      })
      .returning();
    // Revalidate relevant cache tags
    revalidateTag(`subjects-semester-${semesterId}` , 'max');

    return NextResponse.json({
      success: true,
      data: newSubject,
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create subject' },
      { status: 500 }
    );
  }
}
