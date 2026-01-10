'use server';

import { cache } from 'react';
import { db } from '@/db';
import { semesters, subjects, topics } from '@/db/schema';
import { requireCachedUserId } from '@/context/userContext';
import { eq, sql } from 'drizzle-orm';

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

