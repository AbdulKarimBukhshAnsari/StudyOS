'use server'
import { db } from "@/db";
import { semesters, subjects } from "@/db/schema";
import { requireCachedUserId } from "@/context/userContext";
import { markUserAsOnboarded } from "@/serverActions/auth/action";
import { formatDateForInput } from "@/utils/date";

type OnboardingData = {
  semesterName: string;
  semesterStartDate: Date;
  semesterEndDate: Date;
  subjectName: string;
  subjectDescription: string;
  subjectPriority: number;
};

export const completeOnboarding = async (data: OnboardingData) => {
  const userId = await requireCachedUserId();

  try {
    // First, create the semester
    const [semester] = await db
      .insert(semesters)
      .values({
        user_id: userId,
        name: data.semesterName,
        start_date: formatDateForInput(data.semesterStartDate),
        end_date: formatDateForInput(data.semesterEndDate),
        is_active: true,
      })
      .returning();

    if (!semester) {
      return { success: false, error: 'Failed to create semester' };
    }

    // Then, create the subject
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
      return { success: false, error: 'Failed to create subject' };
    }

    // Mark user as onboarded
    const onboarded = await markUserAsOnboarded();
    if (!onboarded) {
      return { success: false, error: 'Failed to mark user as onboarded' };
    }

    return { success: true, semester, subject };
  } catch (error) {
    console.error('Onboarding error:', error);
    return { success: false, error: 'An error occurred during onboarding' };
  }
};

