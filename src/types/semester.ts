// Shared types for semester-related entities
// Used across API routes, services, and components

export interface Semester {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  user_id: string;
}

export interface SemesterWithSubjectCount extends Omit<Semester, 'user_id'> {
  subject_count: number;
}

export interface Subject {
  id: string;
  name: string;
  description: string | null;
  priority: number;
  semester_id: string;
  created_at: string;
}

export interface SubjectWithTopicCount extends Subject {
  topic_count: number;
}

export interface SubjectWithCounts extends Subject {
  topic_count: number;
  quiz_count: number;
}

export interface Topic {
  id: string;
  name: string;
  status: 'Not Clear' | 'Somewhat Clear' | 'Clear';
  order_index: number;
  subject_id: string;
  created_at: string;
}

export type TopicStatus = Topic['status'];

export interface Note {
  id: string;
  topic_id: string;
  topic_name: string;
  content: string;
  ai_refined: boolean;
  created_at: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  topic_id: string;
  name: string;
  notes_ids: string[];
  questions: QuizQuestion[];
  created_at: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
}

export interface QuizResult {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  answers: QuizAnswer[];
  created_at: string;
}

// API Response wrapper
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
