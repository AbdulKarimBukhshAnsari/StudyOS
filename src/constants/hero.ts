import { BookOpen, Brain, Target, Zap } from 'lucide-react';

export const HERO = {
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
      href: '/register',
    },
    secondary: {
      text: 'Learn More',
      href: '#features',
    },
  },
  scrollIndicator: {
    text: 'Scroll to explore',
  },
} as const;

