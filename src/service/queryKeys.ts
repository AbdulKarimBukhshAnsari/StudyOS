/**
 * ============================================================
 * QUERY KEYS - Centralized Query Key Management
 * ============================================================
 * 
 * This file defines all query keys used by TanStack Query.
 * Using a centralized approach ensures:
 * 
 * 1. Type Safety - All keys are typed and autocomplete works
 * 2. Consistency - Same keys used across the app
 * 3. Easy Invalidation - Invalidate related queries easily
 * 
 * STRUCTURE:
 * - Each entity has its own factory function
 * - Keys are hierarchical: ['semesters'] → ['semesters', id] → ['semesters', id, 'subjects']
 * - This allows invalidating all semester queries or just one specific one
 * 
 * USAGE:
 * - queryKeys.semesters.all          → ['semesters']
 * - queryKeys.semesters.detail(id)   → ['semesters', 'detail', id]
 * - queryKeys.subjects.bysemester(semesterId) → ['subjects', 'semester', semesterId]
 */

export const queryKeys = {
  // ============ SEMESTERS ============
  semesters: {
    /** All semesters queries - use for broad invalidation */
    all: ['semesters'] as const,
    
    /** List of all semesters */
    list: () => [...queryKeys.semesters.all, 'list'] as const,
    
    /** Single semester by ID */
    detail: (id: string) => [...queryKeys.semesters.all, 'detail', id] as const,
    
    /** Semester with all its subjects */
    withSubjects: (id: string) => [...queryKeys.semesters.all, 'withSubjects', id] as const,
  },

  // ============ SUBJECTS ============
  subjects: {
    /** All subjects queries - use for broad invalidation */
    all: ['subjects'] as const,
    
    /** Subjects for a specific semester */
    bySemester: (semesterId: string) => 
      [...queryKeys.subjects.all, 'semester', semesterId] as const,
    
    /** Single subject by ID */
    detail: (id: string) => [...queryKeys.subjects.all, 'detail', id] as const,
    
    /** Subject with all its topics */
    withTopics: (id: string) => [...queryKeys.subjects.all, 'withTopics', id] as const,
  },

  // ============ TOPICS ============
  topics: {
    /** All topics queries - use for broad invalidation */
    all: ['topics'] as const,
    
    /** Topics for a specific subject */
    bySubject: (subjectId: string) => 
      [...queryKeys.topics.all, 'subject', subjectId] as const,
    
    /** Single topic by ID */
    detail: (id: string) => [...queryKeys.topics.all, 'detail', id] as const,
  },

  // ============ ONBOARDING ============
  onboarding: {
    all: ['onboarding'] as const,
    status: () => [...queryKeys.onboarding.all, 'status'] as const,
  },
} as const;

/**
 * ============================================================
 * CACHE TAGS - For Next.js Server-Side Cache Revalidation
 * ============================================================
 * 
 * These tags are used with Next.js fetch cache and revalidateTag().
 * When data changes, we call revalidateTag(tag) to invalidate
 * the server-side cache for that data.
 * 
 * USAGE:
 * - In API routes: revalidateTag(cacheTags.semesters.all)
 * - In fetch: fetch(url, { next: { tags: [cacheTags.semesters.all] } })
 */

export const cacheTags = {
  semesters: {
    all: 'semesters',
    detail: (id: string) => `semester-${id}`,
  },
  subjects: {
    all: 'subjects',
    bySemester: (semesterId: string) => `subjects-semester-${semesterId}`,
    detail: (id: string) => `subject-${id}`,
  },
  topics: {
    all: 'topics',
    bySubject: (subjectId: string) => `topics-subject-${subjectId}`,
    detail: (id: string) => `topic-${id}`,
  },
} as const;
