import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notes, topics, subjects, semesters } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

interface RouteParams {
  params: Promise<{ noteId: string }>;
}

async function validateNoteAccess(noteId: string, userId: string) {
  const [row] = await db
    .select({
      id: notes.id,
      topic_id: notes.topic_id,
      topic_name: notes.topic_name,
      content: notes.content,
      ai_refined: notes.ai_refined,
      created_at: notes.created_at,
      user_id: semesters.user_id,
    })
    .from(notes)
    .innerJoin(topics, eq(topics.id, notes.topic_id))
    .innerJoin(subjects, eq(subjects.id, topics.subject_id))
    .innerJoin(semesters, eq(semesters.id, subjects.semester_id))
    .where(eq(notes.id, noteId))
    .limit(1);
  if (!row || row.user_id !== userId) return null;
  const { user_id: _, ...note } = row;
  return note;
}

/**
 * GET /api/notes/[noteId]
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { noteId } = await params;
    const note = await validateNoteAccess(noteId, session.user.id);
    if (!note) {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: note });
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch note' }, { status: 500 });
  }
}

/**
 * PATCH /api/notes/[noteId] — update content (and optionally ai_refined)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { noteId } = await params;
    const existing = await validateNoteAccess(noteId, session.user.id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }
    const body = await request.json();
    const content = body.content !== undefined
      ? (typeof body.content === 'string' ? body.content : JSON.stringify(body.content))
      : existing.content;
    await db
      .update(notes)
      .set({
        content,
        ...(body.ai_refined !== undefined && { ai_refined: !!body.ai_refined }),
      })
      .where(eq(notes.id, noteId));
    const [updated] = await db
      .select({
        id: notes.id,
        topic_id: notes.topic_id,
        topic_name: notes.topic_name,
        content: notes.content,
        ai_refined: notes.ai_refined,
        created_at: notes.created_at,
      })
      .from(notes)
      .where(eq(notes.id, noteId))
      .limit(1);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ success: false, error: 'Failed to update note' }, { status: 500 });
  }
}

/**
 * DELETE /api/notes/[noteId]
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { noteId } = await params;
    const note = await validateNoteAccess(noteId, session.user.id);
    if (!note) {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }
    await db.delete(notes).where(eq(notes.id, noteId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete note' }, { status: 500 });
  }
}
