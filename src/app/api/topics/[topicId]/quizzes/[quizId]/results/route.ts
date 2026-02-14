import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import {
  quizResults,
  quizzes,
  topics,
  subjects,
  semesters,
} from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, and, desc } from 'drizzle-orm';

interface RouteParams {
  params: Promise<{ topicId: string; quizId: string }>;
}

async function validateQuizAccess(topicId: string, quizId: string, userId: string) {
  const [row] = await db
    .select({ id: quizzes.id })
    .from(quizzes)
    .innerJoin(topics, eq(topics.id, quizzes.topic_id))
    .innerJoin(subjects, eq(subjects.id, topics.subject_id))
    .innerJoin(semesters, eq(semesters.id, subjects.semester_id))
    .where(
      and(eq(quizzes.id, quizId), eq(quizzes.topic_id, topicId), eq(semesters.user_id, userId))
    )
    .limit(1);
  return row ?? null;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { topicId, quizId } = await params;
    const quiz = await validateQuizAccess(topicId, quizId, session.user.id);
    if (!quiz) {
      return NextResponse.json({ success: false, error: 'Quiz not found' }, { status: 404 });
    }
    const list = await db
      .select({
        id: quizResults.id,
        quiz_id: quizResults.quiz_id,
        user_id: quizResults.user_id,
        score: quizResults.score,
        answers: quizResults.answers,
        created_at: quizResults.created_at,
      })
      .from(quizResults)
      .where(eq(quizResults.quiz_id, quizId))
      .orderBy(desc(quizResults.created_at));
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { topicId, quizId } = await params;
    const quiz = await validateQuizAccess(topicId, quizId, session.user.id);
    if (!quiz) {
      return NextResponse.json({ success: false, error: 'Quiz not found' }, { status: 404 });
    }
    const body = await request.json();
    const score = Number(body.score);
    if (!Number.isInteger(score) || score < 0) {
      return NextResponse.json(
        { success: false, error: 'Valid score is required' },
        { status: 400 }
      );
    }
    const answers = Array.isArray(body.answers)
      ? (body.answers as Array<{ questionId?: string; selectedAnswer?: number }>).filter(
          (a) => typeof a.questionId === 'string' && Number.isInteger(Number(a.selectedAnswer))
        ).map((a) => ({
          questionId: String(a.questionId),
          selectedAnswer: Number(a.selectedAnswer),
        }))
      : [];
    const [created] = await db
      .insert(quizResults)
      .values({
        quiz_id: quizId,
        user_id: session.user.id,
        score,
        answers,
      })
      .returning({
        id: quizResults.id,
        quiz_id: quizResults.quiz_id,
        user_id: quizResults.user_id,
        score: quizResults.score,
        answers: quizResults.answers,
        created_at: quizResults.created_at,
      });
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save result' },
      { status: 500 }
    );
  }
}
