'use server';

import type { BreadcrumbItem } from '@/components/dashboard/BreadcrumbNav';
import { getUserSemesters, getSemesterWithSubjects, getSubjectById, getTopicById } from '@/apiService/semester.server';
import { cache } from 'react';
import { ROUTES, routeHelpers } from '@/constants/routes';

/**
 * Generate breadcrumbs for the semesters list page
 */
export const getSemestersBreadcrumbs = cache(async (): Promise<BreadcrumbItem[]> => {
  const semesters = await getUserSemesters();
  
  return [
    {
      id: 'semesters',
      label: 'Semesters',
      href: ROUTES.private.dashboardSemester,
      options: semesters.map((s) => ({
        id: s.id,
        label: s.name,
        href: routeHelpers.semester(s.id),
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
      href: ROUTES.private.dashboardSemester,
      options: semesters.map((s) => ({
        id: s.id,
        label: s.name,
        href: routeHelpers.semester(s.id),
      })),
    },
    {
      id: semesterId,
      label: semesterData.semester.name,
      href: routeHelpers.semester(semesterId),
      options: subjects.map((s) => ({
        id: s.id,
        label: s.name,
        href: routeHelpers.subject(semesterId, s.id),
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
      href: ROUTES.private.dashboardSemester,
      options: semesters.map((s) => ({
        id: s.id,
        label: s.name,
        href: routeHelpers.semester(s.id),
      })),
    },
    {
      id: semesterId,
      label: semester.name,
      href: routeHelpers.semester(semesterId),
      options: subjects.map((s) => ({
        id: s.id,
        label: s.name,
        href: routeHelpers.subject(semesterId, s.id),
      })),
    },
    {
      id: subjectId,
      label: subject.name,
      href: routeHelpers.subject(semesterId, subjectId),
    },
  ];
});

/**
 * Generate breadcrumbs for a topic detail page
 */
export const getTopicBreadcrumbs = cache(async (
  semesterId: string,
  subjectId: string,
  topicId: string
): Promise<BreadcrumbItem[]> => {
  const [semesters, semesterData, subjectData, topic] = await Promise.all([
    getUserSemesters(),
    getSemesterWithSubjects(semesterId),
    getSubjectById(subjectId),
    getTopicById(topicId),
  ]);

  if (!semesterData || !subjectData || !topic) {
    return getSubjectBreadcrumbs(semesterId, subjectId);
  }

  const { semester, subjects } = semesterData;

  return [
    {
      id: 'semesters',
      label: 'Semesters',
      href: ROUTES.private.dashboardSemester,
      options: semesters.map((s) => ({
        id: s.id,
        label: s.name,
        href: routeHelpers.semester(s.id),
      })),
    },
    {
      id: semesterId,
      label: semester.name,
      href: routeHelpers.semester(semesterId),
      options: subjects.map((s) => ({
        id: s.id,
        label: s.name,
        href: routeHelpers.subject(semesterId, s.id),
      })),
    },
    {
      id: subjectId,
      label: subjectData.name,
      href: routeHelpers.subject(semesterId, subjectId),
    },
    {
      id: topicId,
      label: topic.name,
      href: routeHelpers.topic(semesterId, subjectId, topicId),
    },
  ];
});
