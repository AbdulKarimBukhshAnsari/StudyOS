import {
  Calendar,
  FileText,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Target,
} from 'lucide-react';

export const FEATURES = {
  title: 'Core Features',
  description:
    'StudyOS combines semester tracking, notes, flashcards, and quizzes into one unified system. AI is used selectively, only where it genuinely reduces effort.',
  items: [
    {
      icon: Calendar,
      title: 'Semester & Subject Tracking',
      description:
        'Create semesters and add subjects. Each subject contains topics that can be marked based on confidence level (understood, needs revision, not started). A visual dashboard provides an overview of progress and weak areas.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: FileText,
      title: 'Notes System',
      description:
        'Write and organize notes per topic. Notes act as the base content from which flashcards and quizzes can be generated. Notes remain fully editable and user-owned.',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Sparkles,
      title: 'Flashcard Generator',
      description:
        'Generate concise flashcards from a topic or notes. Flashcards focus on key concepts and quick recall. Generated flashcards can be saved and reused for revision.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: HelpCircle,
      title: 'Quiz Generator',
      description:
        'Generate short quizzes (3–5 questions) per topic. Quizzes provide instant feedback and explanations, helping students identify gaps in understanding.',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description:
        'Visual dashboards showing weak/strong topics. Track your learning progress continuously throughout the semester with clear metrics and insights.',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    },
    {
      icon: Target,
      title: 'Exam Preparation Planning',
      description:
        'Schedule tests and link topics automatically. Plan your revision strategically with AI-assisted recommendations based on your progress and upcoming exams.',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
  ],
} as const;

