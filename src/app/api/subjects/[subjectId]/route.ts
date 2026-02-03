import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { semesters, subjects, topics, quizzes } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, and, sql } from 'drizzle-orm';

interface RouteParams {
  params: Promise<{ subjectId: string }>;
}

/**
 * Helper to validate subject access
 */
async function validateSubjectAccess(subjectId: string, userId: string) {
  // Get subject with semester info
  const [subject] = await db
    .select({
      id: subjects.id,
      name: subjects.name,
      description: subjects.description,
      priority: subjects.priority,
      semester_id: subjects.semester_id,
      created_at: subjects.created_at,
      user_id: semesters.user_id,
    })
    .from(subjects)
    .innerJoin(semesters, eq(semesters.id, subjects.semester_id))
    .where(eq(subjects.id, subjectId))
    .limit(1);

  if (!subject || subject.user_id !== userId) {
    return null;
  }

  return subject;
}

/**
 * GET /api/subjects/[subjectId]
 * Get a subject by ID with counts
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

    const { subjectId } = await params;
    const userId = session.user.id;

    // Validate access
    const subject = await validateSubjectAccess(subjectId, userId);
    if (!subject) {
      return NextResponse.json(
        { success: false, error: 'Subject not found' },
        { status: 404 }
      );
    }

    // Get subject with counts
    const [subjectData] = await db
      .select({
        id: subjects.id,
        name: subjects.name,
        description: subjects.description,
        priority: subjects.priority,
        semester_id: subjects.semester_id,
        created_at: subjects.created_at,
        topic_count: sql<number>`COALESCE(COUNT(DISTINCT ${topics.id}), 0)`.as('topic_count'),
        quiz_count: sql<number>`COALESCE(COUNT(DISTINCT ${quizzes.id}), 0)`.as('quiz_count'),
      })
      .from(subjects)
      .leftJoin(topics, eq(topics.subject_id, subjects.id))
      .leftJoin(quizzes, eq(quizzes.topic_id, topics.id))
      .where(eq(subjects.id, subjectId))
      .groupBy(
        subjects.id,
        subjects.name,
        subjects.description,
        subjects.priority,
        subjects.semester_id,
        subjects.created_at
      )
      .limit(1);

    return NextResponse.json({
      success: true,
      data: {
        ...subjectData,
        topic_count: Number(subjectData?.topic_count || 0),
        quiz_count: Number(subjectData?.quiz_count || 0),
      },
    });
  } catch (error) {
    console.error('Error fetching subject:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subject' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/subjects/[subjectId]
 * Delete a subject
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

    const { subjectId } = await params;
    const userId = session.user.id;

    // Validate access
    const subject = await validateSubjectAccess(subjectId, userId);
    if (!subject) {
      return NextResponse.json(
        { success: false, error: 'Subject not found' },
        { status: 404 }
      );
    }

    // Delete subject (cascade will handle topics, notes, etc.)
    await db.delete(subjects).where(eq(subjects.id, subjectId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subject:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete subject' },
      { status: 500 }
    );
  }
}
