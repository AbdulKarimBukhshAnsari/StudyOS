
export const queryKeys = {
  semesters: {
    all: ['semesters'] as const,
    
    /** List of all semesters */
    list: () => [...queryKeys.semesters.all, 'list'] as const,
    
    /** Single semester by ID */
    detail: (id: string) => [...queryKeys.semesters.all, 'detail', id] as const,
    
    /** Semester with all its subjects */
    withSubjects: (id: string) => [...queryKeys.semesters.all, 'withSubjects', id] as const,
  },

  subjects: {
    all: ['subjects'] as const,
    
    /** Subjects for a specific semester */
    bySemester: (semesterId: string) => 
      [...queryKeys.subjects.all, 'semester', semesterId] as const,
    
    /** Single subject by ID */
    detail: (id: string) => [...queryKeys.subjects.all, 'detail', id] as const,
    
    /** Subject with all its topics */
    withTopics: (id: string) => [...queryKeys.subjects.all, 'withTopics', id] as const,
  },

  topics: {
    /** All topics queries - use for broad invalidation */
    all: ['topics'] as const,

    /** Topics for a specific subject */
    bySubject: (subjectId: string) =>
      [...queryKeys.topics.all, 'subject', subjectId] as const,

    /** Single topic by ID */
    detail: (id: string) => [...queryKeys.topics.all, 'detail', id] as const,
  },

  notes: {
    all: ['notes'] as const,
    byTopic: (topicId: string) => [...queryKeys.notes.all, 'topic', topicId] as const,
    detail: (id: string) => [...queryKeys.notes.all, 'detail', id] as const,
  },

  onboarding: {
    all: ['onboarding'] as const,
    status: () => [...queryKeys.onboarding.all, 'status'] as const,
  },
} as const;


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
