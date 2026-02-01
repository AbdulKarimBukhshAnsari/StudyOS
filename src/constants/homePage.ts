import {
  BookOpen,
  Brain,
  Target,
  Zap,
  Calendar,
  FileText,
  Sparkles,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  BookMarked,
  Github,
  Twitter,
  Linkedin,
  Mail,
} from 'lucide-react';
import { ROUTES } from './routes';

export const HOMEPAGE = {
  header: {
    brand: {
      name: 'StudyOS',
      logo: 'S',
    },
    navigation: {
      login: {
        text: 'Login',
        href: ROUTES.public.login,
      },
      register: {
        text: 'Register',
        href: ROUTES.public.register,
      },
    },
  },
  hero: {
    title: {
      line1: 'Your Academic',
      line2: 'Operating System',
    },
    description:
      'Simplify semester management, track learning progress, and optimize study habits with AI-assisted tools designed for students.',
    features: [
      { icon: BookOpen, text: 'Organized Learning' },
      { icon: Brain, text: 'AI-Powered' },
      { icon: Target, text: 'Track Progress' },
      { icon: Zap, text: 'Smart Revision' },
    ],
    cta: {
      primary: {
        text: 'Get Started Free',
        href: ROUTES.public.register,
      },
      secondary: {
        text: 'Learn More',
        href: '#features',
      },
    },
    scrollIndicator: {
      text: 'Scroll to explore',
    },
  },
  problemStatement: {
    title: 'The Problem Students Face',
    description:
      "Across the world, students at every level face the same fundamental problem: information overload without clarity or structure. Most students struggle not because content is unavailable, but because they don't know what to study, how to revise, and how to track real understanding.",
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
          "AI tools generate content but don't understand your semester, subjects, progress, or revision needs.",
      },
      {
        icon: AlertCircle,
        title: 'Low Retention & Anxiety',
        description:
          'Without proper tracking and planning, students experience poor retention and exam anxiety.',
      },
    ],
    conclusion: {
      text: 'What students are missing is a single, intelligent workspace that adapts to their semester and supports daily learning in small, effective actions.',
    },
  },
  features: {
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
  },
  solutionOverview: {
    title: 'The StudyOS Solution',
    description:
      'StudyOS solves this problem by acting as an academic operating system for students. Instead of asking students to "learn more," StudyOS helps them organize, revise, test, and track learning continuously throughout the semester.',
    benefits: [
      'Organize learning with structured academic hierarchy',
      'Track progress with visual dashboards',
      'Generate flashcards and quizzes with AI assistance',
      'Plan revision strategically before exams',
      'Reduce cognitive load with minimalistic design',
      'Access everything in one unified workspace',
    ],
    cta: {
      text: 'Start Your Journey',
      href: ROUTES.public.register,
    },
  },
  footer: {
    brand: {
      name: 'StudyOS',
      logo: 'S',
      description:
        'Your academic operating system. Simplify learning, track progress, and optimize study habits.',
    },
    quickLinks: [
      { text: 'Features', href: '#features' },
      { text: 'Problem Statement', href: '#problem' },
      { text: 'Get Started', href: ROUTES.public.register },
    ],
    socialLinks: [
      { icon: Github, href: '#', label: 'GitHub' },
      { icon: Twitter, href: '#', label: 'Twitter' },
      { icon: Linkedin, href: '#', label: 'LinkedIn' },
      { icon: Mail, href: '#', label: 'Email' },
    ],
    copyright: {
      year: new Date().getFullYear(),
      text: 'StudyOS. All rights reserved.',
    },
    author: {
      name: 'Abdul Karim Bukhsh Ansari',
    },
  },
} as const;

// Export individual sections for backward compatibility (if needed)
export const HEADER = HOMEPAGE.header;
export const HERO = HOMEPAGE.hero;
export const PROBLEM_STATEMENT = HOMEPAGE.problemStatement;
export const FEATURES = HOMEPAGE.features;
export const SOLUTION_OVERVIEW = HOMEPAGE.solutionOverview;
export const FOOTER = HOMEPAGE.footer;

