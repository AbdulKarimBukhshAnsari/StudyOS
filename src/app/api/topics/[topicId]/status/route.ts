import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { semesters, subjects, topics } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

interface RouteParams {
  params: Promise<{ topicId: string }>;
}

const VALID_STATUSES = ['Not Clear', 'Somewhat Clear', 'Clear'] as const;
type TopicStatus = (typeof VALID_STATUSES)[number];

/**
 * Helper to validate topic access
 */
async function validateTopicAccess(topicId: string, userId: string) {
  const [topic] = await db
    .select({
      id: topics.id,
      name: topics.name,
      status: topics.status,
      subject_id: topics.subject_id,
      user_id: semesters.user_id,
    })
    .from(topics)
    .innerJoin(subjects, eq(subjects.id, topics.subject_id))
    .innerJoin(semesters, eq(semesters.id, subjects.semester_id))
    .where(eq(topics.id, topicId))
    .limit(1);

  if (!topic || topic.user_id !== userId) {
    return null;
  }

  return topic;
}

/**
 * PATCH /api/topics/[topicId]/status
 * Update topic status
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    const { topicId } = await params;
    const userId = session.user.id;
    const body = await request.json();

    // Validate status
    if (!body.status || !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be one of: Not Clear, Somewhat Clear, Clear' },
        { status: 400 }
      );
    }

    const topic = await validateTopicAccess(topicId, userId);
    if (!topic) {
      return NextResponse.json(
        { success: false, error: 'Topic not found' },
        { status: 404 }
      );
    }

    // Update topic status
    await db
      .update(topics)
      .set({ status: body.status as TopicStatus })
      .where(eq(topics.id, topicId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating topic status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update topic status' },
      { status: 500 }
    );
  }
}
