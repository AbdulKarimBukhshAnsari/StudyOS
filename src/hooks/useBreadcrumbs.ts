'use client';

import type { BreadcrumbItem } from '@/components/dashboard/BreadcrumbNav';
import { ROUTES, routeHelpers } from '@/constants/routes';
import {
  useSemesters,
  useSemester,
  useSubjectsBySemester,
  useSubject,
  useTopic,
} from '@/hooks/useSemesterQueries';

export function useBreadcrumbs(
  semesterId?: string,
  subjectId?: string,
  topicId?: string
): BreadcrumbItem[] {
  const { data: semesters = [] } = useSemesters();
  const { data: semester } = useSemester(semesterId ?? '', {
    enabled: !!semesterId,
  });
  const { data: subjects = [] } = useSubjectsBySemester(semesterId ?? '', {
    enabled: !!semesterId,
  });
  const { data: subject } = useSubject(subjectId ?? '', { enabled: !!subjectId });
  const { data: topic } = useTopic(topicId ?? '', { enabled: !!topicId });

  const base: BreadcrumbItem[] = [
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

  if (!semesterId || !semester) return base;

  const semesterCrumb: BreadcrumbItem = {
    id: semesterId,
    label: semester.name,
    href: routeHelpers.semester(semesterId),
    options: subjects.map((s) => ({
      id: s.id,
      label: s.name,
      href: routeHelpers.subject(semesterId, s.id),
    })),
  };

  if (!subjectId || !subject) return [...base, semesterCrumb];

  const subjectCrumb: BreadcrumbItem = {
    id: subjectId,
    label: subject.name,
    href: routeHelpers.subject(semesterId, subjectId),
  };

  if (!topicId || !topic) return [...base, semesterCrumb, subjectCrumb];

  return [
    ...base,
    semesterCrumb,
    subjectCrumb,
    {
      id: topicId,
      label: topic.name,
      href: routeHelpers.topic(semesterId, subjectId, topicId),
    },
  ];
}
