'use server';

import { cache } from 'react';
import { db } from '@/db';
import { semesters, subjects, topics, quizzes } from '@/db/schema';
import { requireCachedUserId } from '@/context/userContext';
import { eq, sql, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

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
 * Optimized with JOIN to get counts in a single query
 * Cached using React cache() for the request
 * User check automatically handled by context
 */
export const getUserSemesters = cache(async (): Promise<SemesterWithSubjectCount[]> => {
  const userId = await requireCachedUserId();

  try {
    // Use a single query with LEFT JOIN and GROUP BY to get counts
    const semestersWithCounts = await db
      .select({
        id: semesters.id,
        name: semesters.name,
        start_date: semesters.start_date,
        end_date: semesters.end_date,
        is_active: semesters.is_active,
        created_at: semesters.created_at,
        subject_count: sql<number>`COALESCE(COUNT(${subjects.id}), 0)`.as('subject_count'),
      })
      .from(semesters)
      .leftJoin(subjects, eq(subjects.semester_id, semesters.id))
      .where(eq(semesters.user_id, userId))
      .groupBy(
        semesters.id,
        semesters.name,
        semesters.start_date,
        semesters.end_date,
        semesters.is_active,
        semesters.created_at
      )
      .orderBy(semesters.created_at);

    return semestersWithCounts.map((s) => ({
      ...s,
      start_date: new Date(s.start_date),
      end_date: new Date(s.end_date),
      subject_count: Number(s.subject_count),
    })) as SemesterWithSubjectCount[];
  } catch (error) {
    console.error('Error fetching semesters:', error);
    return [];
  }
});

/**
 * Get a single semester by ID for the current user
 * Cached using React cache() for the request
 * User check automatically handled by context
 */
export const getSemesterById = cache(async (semesterId: string) => {
  const userId = await requireCachedUserId();

  try {
    const [semester] = await db
      .select()
      .from(semesters)
      .where(eq(semesters.id, semesterId))
      .limit(1);
    
    // Verify the semester belongs to the user
    if (!semester || semester.user_id !== userId) {
      return null;
    }
    
    return semester;
  } catch (error) {
    console.error('Error fetching semester:', error);
    return null;
  }
});

/**
 * Get all subjects for a semester with topic count
 * Optimized with JOIN to get counts in a single query
 * Cached using React cache() for the request
 */
export const getSubjectsBySemesterId = cache(async (
  semesterId: string
): Promise<SubjectWithTopicCount[]> => {
  // User check automatically handled by requireCachedUserId in getSemesterById
  try {
    // First verify the semester belongs to the user (using cached function)
    const semester = await getSemesterById(semesterId);
    if (!semester) {
      return [];
    }

    // Use a single query with LEFT JOIN and GROUP BY to get counts
    const subjectsWithCounts = await db
      .select({
        id: subjects.id,
        name: subjects.name,
        description: subjects.description,
        priority: subjects.priority,
        semester_id: subjects.semester_id,
        created_at: subjects.created_at,
        topic_count: sql<number>`COALESCE(COUNT(${topics.id}), 0)`.as('topic_count'),
      })
      .from(subjects)
      .leftJoin(topics, eq(topics.subject_id, subjects.id))
      .where(eq(subjects.semester_id, semesterId))
      .groupBy(
        subjects.id,
        subjects.name,
        subjects.description,
        subjects.priority,
        subjects.semester_id,
        subjects.created_at
      )
      .orderBy(subjects.priority, subjects.created_at);

    return subjectsWithCounts.map((s) => ({
      ...s,
      topic_count: Number(s.topic_count),
    })) as SubjectWithTopicCount[];
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
});

/**
 * Get semester with subjects in a single optimized query
 * This is the most efficient way to get all data needed for a semester page
 */
export const getSemesterWithSubjects = cache(async (semesterId: string) => {
  // User check automatically handled by requireCachedUserId in getSemesterById
  try {
    // Get semester and verify ownership
    const semester = await getSemesterById(semesterId);
    if (!semester) {
      return null;
    }

    // Get subjects with topic counts in one query
    const subjects = await getSubjectsBySemesterId(semesterId);

    return {
      semester,
      subjects,
    };
  } catch (error) {
    console.error('Error fetching semester with subjects:', error);
    return null;
  }
});

/**
 * Create a new subject for a semester
 * Validates ownership and sets default priority to 1
 */
export async function createSubject(
  semesterId: string,
  data: { name: string; description?: string; priority?: number }
) {
  await requireCachedUserId();

  try {
    // Verify semester ownership
    const semester = await getSemesterById(semesterId);
    if (!semester) {
      return { success: false, error: 'Semester not found' };
    }

    // Insert subject with default priority of 1
    const [newSubject] = await db
      .insert(subjects)
      .values({
        semester_id: semesterId,
        name: data.name.trim(),
        description: data.description?.trim() || null,
        priority: data.priority ?? 1,
      })
      .returning();

    revalidatePath(`/dashboard/semester/${semesterId}`);
    return { success: true, data: newSubject };
  } catch (error) {
    console.error('Error creating subject:', error);
    return { success: false, error: 'Failed to create subject' };
  }
}

/**
 * Delete a subject
 * Validates ownership through semester
 */
export async function deleteSubject(subjectId: string, semesterId: string) {
  await requireCachedUserId();

  try {
    // Verify semester ownership
    const semester = await getSemesterById(semesterId);
    if (!semester) {
      return { success: false, error: 'Semester not found' };
    }

    // Verify subject belongs to this semester
    const [subject] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.id, subjectId))
      .limit(1);

    if (!subject || subject.semester_id !== semesterId) {
      return { success: false, error: 'Subject not found' };
    }

    // Delete subject (cascade will handle topics, notes, etc.)
    await db.delete(subjects).where(eq(subjects.id, subjectId));

    revalidatePath(`/dashboard/semester/${semesterId}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting subject:', error);
    return { success: false, error: 'Failed to delete subject' };
  }
}

/**
 * Get subject with topic and quiz counts
 * Optimized single query
 */
export const getSubjectById = cache(async (subjectId: string, semesterId: string) => {
  await requireCachedUserId();

  try {
    // Verify semester ownership
    const semester = await getSemesterById(semesterId);
    if (!semester) {
      return null;
    }

    // Get subject with counts in a single query
    const [subjectData] = await db
      .select({
        id: subjects.id,
        name: subjects.name,
        description: subjects.description,
        priority: subjects.priority,
        semester_id: subjects.semester_id,
        created_at: subjects.created_at,
        topic_count: sql<number>`COALESCE(COUNT(DISTINCT ${topics.id}), 0)`.as('topic_count'),
        quiz_count: sql<number>`COALESCE(COUNT(DISTINCT ${quizzes.id}), 0)`.as('quiz_count'),
      })
      .from(subjects)
      .leftJoin(topics, eq(topics.subject_id, subjects.id))
      .leftJoin(quizzes, eq(quizzes.topic_id, topics.id))
      .where(and(eq(subjects.id, subjectId), eq(subjects.semester_id, semesterId)))
      .groupBy(
        subjects.id,
        subjects.name,
        subjects.description,
        subjects.priority,
        subjects.semester_id,
        subjects.created_at
      )
      .limit(1);

    if (!subjectData) {
      return null;
    }

    return {
      ...subjectData,
      topic_count: Number(subjectData.topic_count),
      quiz_count: Number(subjectData.quiz_count),
    };
  } catch (error) {
    console.error('Error fetching subject:', error);
    return null;
  }
});

/**
 * Get all topics for a subject
 * Optimized query with ordering
 */
export const getTopicsBySubjectId = cache(async (subjectId: string) => {
  await requireCachedUserId();

  try {
    const topicsList = await db
      .select()
      .from(topics)
      .where(eq(topics.subject_id, subjectId))
      .orderBy(topics.order_index, topics.created_at);

    return topicsList;
  } catch (error) {
    console.error('Error fetching topics:', error);
    return [];
  }
});

/**
 * Create a new topic for a subject
 */
export async function createTopic(
  subjectId: string,
  data: { name: string }
) {
  await requireCachedUserId();

  try {
    // Verify subject exists and get its semester to verify ownership
    const [subject] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.id, subjectId))
      .limit(1);

    if (!subject) {
      return { success: false, error: 'Subject not found' };
    }

    // Verify semester ownership
    const semester = await getSemesterById(subject.semester_id);
    if (!semester) {
      return { success: false, error: 'Access denied' };
    }

    // Get max order_index for this subject
    const [maxOrder] = await db
      .select({ max: sql<number>`COALESCE(MAX(${topics.order_index}), 0)` })
      .from(topics)
      .where(eq(topics.subject_id, subjectId));

    const nextOrder = (maxOrder?.max ? Number(maxOrder.max) : 0) + 1;

    // Insert topic
    const [newTopic] = await db
      .insert(topics)
      .values({
        subject_id: subjectId,
        name: data.name.trim(),
        order_index: nextOrder,
      })
      .returning();

    revalidatePath(`/dashboard/semester/${subject.semester_id}/${subjectId}`);
    return { success: true, data: newTopic };
  } catch (error) {
    console.error('Error creating topic:', error);
    return { success: false, error: 'Failed to create topic' };
  }
}

