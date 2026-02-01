import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { semesters, subjects, topics } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, sql } from 'drizzle-orm';

interface RouteParams {
  params: Promise<{ subjectId: string }>;
}

/**
 * Helper to validate subject access
 */
async function validateSubjectAccess(subjectId: string, userId: string) {
  const [subject] = await db
    .select({
      id: subjects.id,
      semester_id: subjects.semester_id,
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
 * GET /api/subjects/[subjectId]/topics
 * Get all topics for a subject
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

    // Get topics
    const topicsList = await db
      .select()
      .from(topics)
      .where(eq(topics.subject_id, subjectId))
      .orderBy(topics.order_index, topics.created_at);

    return NextResponse.json({ success: true, data: topicsList });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/subjects/[subjectId]/topics
 * Create a new topic for a subject
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

    const { subjectId } = await params;
    const userId = session.user.id;
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Topic name is required' },
        { status: 400 }
      );
    }

    // Validate access
    const subject = await validateSubjectAccess(subjectId, userId);
    if (!subject) {
      return NextResponse.json(
        { success: false, error: 'Subject not found' },
        { status: 404 }
      );
    }

    // Check topic count limit (50 max)
    const [topicCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(topics)
      .where(eq(topics.subject_id, subjectId));

    const currentCount = Number(topicCount?.count || 0);
    if (currentCount >= 50) {
      return NextResponse.json(
        { success: false, error: 'Maximum limit of 50 topics reached per subject' },
        { status: 400 }
      );
    }

    // Get max order_index for this subject
    const [maxOrderResult] = await db
      .select({ max: sql<number>`COALESCE(MAX(${topics.order_index}), 0)` })
      .from(topics)
      .where(eq(topics.subject_id, subjectId));

    const nextOrder = (maxOrderResult?.max ? Number(maxOrderResult.max) : 0) + 1;

    // Insert topic
    const [newTopic] = await db
      .insert(topics)
      .values({
        subject_id: subjectId,
        name: body.name.trim(),
        order_index: nextOrder,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newTopic,
    });
  } catch (error) {
    console.error('Error creating topic:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create topic' },
      { status: 500 }
    );
  }
}
