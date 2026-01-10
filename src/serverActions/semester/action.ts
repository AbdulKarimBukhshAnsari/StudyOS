'use server';

import { db } from '@/db';
import { semesters, subjects, topics } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth-server';
import { eq,  count } from 'drizzle-orm';

export interface SemesterWithSubjectCount {
  id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  created_at: Date;
  subject_count: number;
}

export interface SubjectWithTopicCount {
  id: string;
  name: string;
  description: string | null;
  priority: number;
  semester_id: string;
  created_at: Date;
  topic_count: number;
}

/**
 * Get all semesters for the current user with subject count
 */
export async function getUserSemesters(): Promise<SemesterWithSubjectCount[]> {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  try {
    const userSemesters = await db
      .select({
        id: semesters.id,
        name: semesters.name,
        start_date: semesters.start_date,
        end_date: semesters.end_date,
        is_active: semesters.is_active,
        created_at: semesters.created_at,
      })
      .from(semesters)
      .where(eq(semesters.user_id, user.id))
      .orderBy(semesters.created_at);

    // Get subject counts for each semester
    const semestersWithCounts = await Promise.all(
      userSemesters.map(async (semester) => {
        const [subjectCountResult] = await db
          .select({ count: count() })
          .from(subjects)
          .where(eq(subjects.semester_id, semester.id));

        return {
          ...semester,
          subject_count: subjectCountResult?.count || 0,
        };
      })
    );

    return semestersWithCounts as unknown as SemesterWithSubjectCount[];
  } catch (error) {
    console.error('Error fetching semesters:', error);
    return [];
  }
}

/**
 * Get a single semester by ID for the current user
 */
export async function getSemesterById(semesterId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  try {
    const [semester] = await db
      .select()
      .from(semesters)
      .where(eq(semesters.id, semesterId))
    return semester || null;
  } catch (error) {
    console.error('Error fetching semester:', error);
    return null;
  }
}

/**
 * Get all subjects for a semester with topic count
 */
export async function getSubjectsBySemesterId(
  semesterId: string
): Promise<SubjectWithTopicCount[]> {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  // Verify the semester belongs to the user
  const semester = await getSemesterById(semesterId);
  if (!semester) {
    return [];
  }

  try {
    const semesterSubjects = await db
      .select({
        id: subjects.id,
        name: subjects.name,
        description: subjects.description,
        priority: subjects.priority,
        semester_id: subjects.semester_id,
        created_at: subjects.created_at,
      })
      .from(subjects)
      .where(eq(subjects.semester_id, semesterId))
      .orderBy(subjects.priority, subjects.created_at);

    // Get topic counts for each subject
    const subjectsWithCounts = await Promise.all(
      semesterSubjects.map(async (subject) => {
        const [topicCountResult] = await db
          .select({ count: count() })
          .from(topics)
          .where(eq(topics.subject_id, subject.id));

        return {
          ...subject,
          topic_count: topicCountResult?.count || 0,
        };
      })
    );

    return subjectsWithCounts;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
}

