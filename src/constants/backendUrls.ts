// API Endpoints for the application

export const API_URLS = {
  // Onboarding
  onboarding: {
    complete: '/onboarding',
  },

  // Semesters
  semesters: {
    list: '/semesters',
    create: '/semesters',
    getById: (id: string) => `/semesters/${id}`,
    getSubjects: (id: string) => `/semesters/${id}/subjects`,
    createSubject: (id: string) => `/semesters/${id}/subjects`,
  },

  // Subjects
  subjects: {
    getById: (id: string) => `/subjects/${id}`,
    delete: (id: string) => `/subjects/${id}`,
    getTopics: (id: string) => `/subjects/${id}/topics`,
    createTopic: (id: string) => `/subjects/${id}/topics`,
  },

  // Topics
  topics: {
    getById: (id: string) => `/topics/${id}`,
    updateStatus: (id: string) => `/topics/${id}/status`,
    getNotes: (topicId: string) => `/topics/${topicId}/notes`,
    createNote: (topicId: string) => `/topics/${topicId}/notes`,
  },

  // Notes
  notes: {
    getById: (id: string) => `/notes/${id}`,
    update: (id: string) => `/notes/${id}`,
    delete: (id: string) => `/notes/${id}`,
  },
} as const;
