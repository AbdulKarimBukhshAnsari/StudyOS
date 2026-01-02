import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const FOOTER = {
  brand: {
    name: 'StudyOS',
    logo: 'S',
    description:
      'Your academic operating system. Simplify learning, track progress, and optimize study habits.',
  },
  quickLinks: [
    { text: 'Features', href: '#features' },
    { text: 'Problem Statement', href: '#problem' },
    { text: 'Get Started', href: '/register' },
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
} as const;

