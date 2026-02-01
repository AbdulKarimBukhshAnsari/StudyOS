import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { semesters, subjects, topics } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

interface RouteParams {
  params: Promise<{ topicId: string }>;
}

/**
 * Helper to validate topic access
 */
async function validateTopicAccess(topicId: string, userId: string) {
  const [topic] = await db
    .select({
      id: topics.id,
      name: topics.name,
      status: topics.status,
      order_index: topics.order_index,
      subject_id: topics.subject_id,
      created_at: topics.created_at,
      semester_id: subjects.semester_id,
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
 * GET /api/topics/[topicId]
 * Get a topic by ID
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

    const { topicId } = await params;
    const userId = session.user.id;

    const topic = await validateTopicAccess(topicId, userId);
    if (!topic) {
      return NextResponse.json(
        { success: false, error: 'Topic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: topic.id,
        name: topic.name,
        status: topic.status,
        order_index: topic.order_index,
        subject_id: topic.subject_id,
        created_at: topic.created_at,
      },
    });
  } catch (error) {
    console.error('Error fetching topic:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch topic' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/topics/[topicId]
 * Delete a topic
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

    const { topicId } = await params;
    const userId = session.user.id;

    const topic = await validateTopicAccess(topicId, userId);
    if (!topic) {
      return NextResponse.json(
        { success: false, error: 'Topic not found' },
        { status: 404 }
      );
    }

    await db.delete(topics).where(eq(topics.id, topicId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting topic:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete topic' },
      { status: 500 }
    );
  }
}
