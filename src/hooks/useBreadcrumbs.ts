'use server';

import type { BreadcrumbItem } from '@/components/dashboard/BreadcrumbNav';
import { getUserSemesters } from '@/serverActions/semester/action';
import { getSemesterWithSubjects } from '@/serverActions/semester/action';
import { cache } from 'react';

/**
 * Generate breadcrumbs for the semesters list page
 */
export const getSemestersBreadcrumbs = cache(async (): Promise<BreadcrumbItem[]> => {
  const semesters = await getUserSemesters();
  
  return [
    {
      id: 'semesters',
      label: 'Semesters',
      href: '/dashboard/semester',
      options: semesters.map((s) => ({
        id: s.id,
        label: s.name,
        href: `/dashboard/semester/${s.id}`,
      })),
    },
  ];
});

/**
 * Generate breadcrumbs for a semester detail page
 */
export const getSemesterBreadcrumbs = cache(async (
  semesterId: string
): Promise<BreadcrumbItem[]> => {
  const [semesters, semesterData] = await Promise.all([
    getUserSemesters(),
    getSemesterWithSubjects(semesterId),
  ]);

  if (!semesterData) {
    return getSemestersBreadcrumbs();
  }

  const { subjects } = semesterData;

  return [
    {
      id: 'semesters',
      label: 'Semesters',
      href: '/dashboard/semester',
      options: semesters.map((s) => ({
        id: s.id,
        label: s.name,
        href: `/dashboard/semester/${s.id}`,
      })),
    },
    {
      id: semesterId,
      label: semesterData.semester.name,
      href: `/dashboard/semester/${semesterId}`,
      options: subjects.map((s) => ({
        id: s.id,
        label: s.name,
        href: `/dashboard/semester/${semesterId}/${s.id}`,
      })),
    },
  ];
});

/**
 * Generate breadcrumbs for a subject detail page
 */
export const getSubjectBreadcrumbs = cache(async (
  semesterId: string,
  subjectId: string
): Promise<BreadcrumbItem[]> => {
  const [semesters, semesterData] = await Promise.all([
    getUserSemesters(),
    getSemesterWithSubjects(semesterId),
  ]);

  if (!semesterData) {
    return getSemestersBreadcrumbs();
  }

  const { semester, subjects } = semesterData;
  const subject = subjects.find((s) => s.id === subjectId);

  if (!subject) {
    return getSemesterBreadcrumbs(semesterId);
  }

  return [
    {
      id: 'semesters',
      label: 'Semesters',
      href: '/dashboard/semester',
      options: semesters.map((s) => ({
        id: s.id,
        label: s.name,
        href: `/dashboard/semester/${s.id}`,
      })),
    },
    {
      id: semesterId,
      label: semester.name,
      href: `/dashboard/semester/${semesterId}`,
      options: subjects.map((s) => ({
        id: s.id,
        label: s.name,
        href: `/dashboard/semester/${semesterId}/${s.id}`,
      })),
    },
    {
      id: subjectId,
      label: subject.name,
      href: `/dashboard/semester/${semesterId}/${subjectId}`,
    },
  ];
});

