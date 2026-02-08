import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notes, topics, subjects, semesters } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, desc, asc } from 'drizzle-orm';

interface RouteParams {
  params: Promise<{ topicId: string }>;
}

async function validateTopicAccess(topicId: string, userId: string) {
  const [row] = await db
    .select({ id: topics.id, user_id: semesters.user_id })
    .from(topics)
    .innerJoin(subjects, eq(subjects.id, topics.subject_id))
    .innerJoin(semesters, eq(semesters.id, subjects.semester_id))
    .where(eq(topics.id, topicId))
    .limit(1);
  if (!row || row.user_id !== userId) return null;
  return row;
}

/**
 * GET /api/topics/[topicId]/notes — list notes for topic
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { topicId } = await params;
    const topic = await validateTopicAccess(topicId, session.user.id);
    if (!topic) {
      return NextResponse.json({ success: false, error: 'Topic not found' }, { status: 404 });
    }
    const list = await db
      .select({
        id: notes.id,
        topic_id: notes.topic_id,
        topic_name: notes.topic_name,
        content: notes.content,
        ai_refined: notes.ai_refined,
        created_at: notes.created_at,
      })
      .from(notes)
      .where(eq(notes.topic_id, topicId))
      .orderBy(asc(notes.created_at));
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch notes' }, { status: 500 });
  }
}

/**
 * POST /api/topics/[topicId]/notes — create note (content as JSON string)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { topicId } = await params;
    const topic = await validateTopicAccess(topicId, session.user.id);
    if (!topic) {
      return NextResponse.json({ success: false, error: 'Topic not found' }, { status: 404 });
    }
    const body = await request.json();
    const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : null;
    if (!name) {
      return NextResponse.json({ success: false, error: 'Note name is required' }, { status: 400 });
    }
    const content = typeof body.content === 'string' ? body.content : JSON.stringify(body.content ?? { type: 'doc', content: [] });
    const [created] = await db
      .insert(notes)
      .values({
        topic_id: topicId,
        topic_name: name,
        content,
        ai_refined: false,
      })
      .returning({
        id: notes.id,
        topic_id: notes.topic_id,
        topic_name: notes.topic_name,
        content: notes.content,
        ai_refined: notes.ai_refined,
        created_at: notes.created_at,
      });
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ success: false, error: 'Failed to create note' }, { status: 500 });
  }
}
