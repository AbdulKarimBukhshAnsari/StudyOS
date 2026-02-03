import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { semesters, subjects, users } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { formatDateForInput } from '@/utils/date';

type OnboardingPayload = {
  semesterName: string;
  semesterStartDate: string;
  semesterEndDate: string;
  subjectName: string;
  subjectDescription: string;
  subjectPriority: number;
};

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated session
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
    const data: OnboardingPayload = await request.json();

    // Validate required fields
    if (!data.semesterName || !data.semesterStartDate || !data.semesterEndDate || !data.subjectName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the semester
    const [semester] = await db
      .insert(semesters)
      .values({
        user_id: userId,
        name: data.semesterName,
        start_date: formatDateForInput(new Date(data.semesterStartDate)),
        end_date: formatDateForInput(new Date(data.semesterEndDate)),
        is_active: true,
      })
      .returning();

    if (!semester) {
      return NextResponse.json(
        { success: false, error: 'Failed to create semester' },
        { status: 500 }
      );
    }

    // Create the subject
    const [subject] = await db
      .insert(subjects)
      .values({
        semester_id: semester.id,
        name: data.subjectName,
        description: data.subjectDescription || null,
        priority: data.subjectPriority || 1,
      })
      .returning();

    if (!subject) {
      return NextResponse.json(
        { success: false, error: 'Failed to create subject' },
        { status: 500 }
      );
    }

    // Mark user as onboarded
    await db
      .update(users)
      .set({ is_onboarded: true })
      .where(eq(users.better_auth_user_id, userId));

    return NextResponse.json({
      success: true,
      data: { semester, subject },
    });
  } catch (error) {
    console.error('Onboarding API error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during onboarding' },
      { status: 500 }
    );
  }
}
