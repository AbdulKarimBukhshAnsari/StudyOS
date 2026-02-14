import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { quizzes, notes, topics, subjects, semesters } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, asc, and, inArray } from 'drizzle-orm';
import { noteContentToPlainText } from '@/lib/note-content-utils';
import { generateQuizQuestions } from '@/lib/groq-quiz';

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
        id: quizzes.id,
        topic_id: quizzes.topic_id,
        name: quizzes.name,
        notes_ids: quizzes.notes_ids,
        questions: quizzes.questions,
        created_at: quizzes.created_at,
      })
      .from(quizzes)
      .where(eq(quizzes.topic_id, topicId))
      .orderBy(asc(quizzes.created_at));
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch quizzes' }, { status: 500 });
  }
}

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
      return NextResponse.json({ success: false, error: 'Quiz name is required' }, { status: 400 });
    }
    const notesIds = Array.isArray(body.notes_ids)
      ? body.notes_ids.filter((id: unknown) => typeof id === 'string')
      : [];
    if (notesIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Select at least one note' },
        { status: 400 }
      );
    }

    const numQuestions = Math.min(
      15,
      Math.max(1, Number(body.question_count) || 10)
    );
    const questionType =
      typeof body.question_type === 'string' ? body.question_type : 'Both';
    const complexity =
      typeof body.complexity === 'string' ? body.complexity : 'Medium';

    const noteRows = await db
      .select({ content: notes.content })
      .from(notes)
      .where(
        and(eq(notes.topic_id, topicId), inArray(notes.id, notesIds))
      );
    const notesContent = noteRows
      .map((r) => noteContentToPlainText(r.content))
      .filter(Boolean)
      .join('\n\n---\n\n');

    const questions = await generateQuizQuestions({
      notesContent: notesContent || 'No content provided.',
      numQuestions,
      questionType,
      complexity,
    });

    const [created] = await db
      .insert(quizzes)
      .values({
        topic_id: topicId,
        name,
        notes_ids: notesIds,
        questions,
      })
      .returning({
        id: quizzes.id,
        topic_id: quizzes.topic_id,
        name: quizzes.name,
        notes_ids: quizzes.notes_ids,
        questions: quizzes.questions,
        created_at: quizzes.created_at,
      });
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error('Error creating quiz:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to create quiz';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
    const quizId = typeof body.quizId === 'string' && body.quizId.trim() ? body.quizId.trim() : null;
    if (!quizId) {
      return NextResponse.json({ success: false, error: 'Quiz ID is required' }, { status: 400 });
    }
    await db.delete(quizzes).where(and(eq(quizzes.topic_id, topicId), eq(quizzes.id, quizId)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete quiz' }, { status: 500 });
  }
}