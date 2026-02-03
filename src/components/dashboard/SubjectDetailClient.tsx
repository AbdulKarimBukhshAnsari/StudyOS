'use client';

import { useEffect } from 'react';
import { notFound } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SemesterProvider } from '@/context/semesterContext';
import { SubjectTabs } from '@/components/dashboard/SubjectTabs';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import {
  useSemesters,
  useSemesterWithSubjects,
  useSubject,
  useTopicsBySubject,
} from '@/hooks/useSemesterQueries';

interface SubjectDetailClientProps {
  semesterId: string;
  subjectId: string;
}

export function SubjectDetailClient({ semesterId, subjectId }: SubjectDetailClientProps) {
  const { data: semesters = [] } = useSemesters();
  const { semester, subjects, isLoading: loadingSemester } = useSemesterWithSubjects(semesterId);
  const { data: subject, isLoading: loadingSubject } = useSubject(subjectId);
  const { data: topics = [], isLoading: loadingTopics } = useTopicsBySubject(subjectId);
  const breadcrumbs = useBreadcrumbs(semesterId, subjectId);

  const isLoading = loadingSemester || loadingSubject || loadingTopics;

  useEffect(() => {
    if (!isLoading && (!semester || !subject)) {
      notFound();
    }
  }, [isLoading, semester, subject]);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <DashboardHeader subtitle="Loading..." />
        <div className="flex-1 overflow-y-auto p-6 animate-pulse" />
      </div>
    );
  }

  if (!semester || !subject) {
    notFound();
  }

  return (
    <SemesterProvider
      semesters={semesters}
      currentSemesterId={semesterId}
      currentSubjects={subjects}
    >
      <div className="h-full flex flex-col">
        <DashboardHeader
          breadcrumbs={breadcrumbs}
          subtitle={subject.description || `Manage topics for ${subject.name}`}
        />
        <div className="flex-1 overflow-y-auto p-6">
          <SubjectTabs
            subject={subject}
            subjectId={subjectId}
            topics={topics}
          />
        </div>
      </div>
    </SemesterProvider>
  );
}
