import { AlertCircle, FileText, MessageSquare, BookMarked } from 'lucide-react';

export const PROBLEM_STATEMENT = {
  title: 'The Problem Students Face',
  description:
    'Across the world, students at every level face the same fundamental problem: information overload without clarity or structure. Most students struggle not because content is unavailable, but because they don&apos;t know what to study, how to revise, and how to track real understanding.',
  problems: [
    {
      icon: FileText,
      title: 'Information Overload',
      description:
        'Students face vast syllabi without clarity or structure, struggling to know what to study and how to revise.',
    },
    {
      icon: MessageSquare,
      title: 'Fragmented Tools',
      description:
        'Notes in one app, quizzes in another, flashcards elsewhere—leading to poor revision and last-minute cramming.',
    },
    {
      icon: BookMarked,
      title: 'No Academic Context',
      description:
        'AI tools generate content but don&apos;t understand your semester, subjects, progress, or revision needs.',
    },
    {
      icon: AlertCircle,
      title: 'Low Retention & Anxiety',
      description:
        'Without proper tracking and planning, students experience poor retention and exam anxiety.',
    },
  ],
  conclusion: {
    highlight: 'What students are missing',
    text: 'is a single, intelligent workspace that adapts to their semester and supports daily learning in small, effective actions.',
  },
} as const;

