'use client';

import { useEffect } from 'react';
import { notFound } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SemesterPageClient } from '@/components/dashboard/SemesterPageClient';
import { AddSubjectButton } from '@/components/dashboard/AddSubjectButton';
import { SemesterProvider } from '@/context/semesterContext';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { useSemesterWithSubjects, useSemesters } from '@/hooks/useSemesterQueries';

interface SemesterDetailClientProps {
  semesterId: string;
}

export function SemesterDetailClient({ semesterId }: SemesterDetailClientProps) {
  const { data: semesters = [] } = useSemesters();
  const { semester, subjects, isLoading, isError } = useSemesterWithSubjects(semesterId);
  const breadcrumbs = useBreadcrumbs(semesterId);

  useEffect(() => {
    if (!isLoading && !isError && !semester) {
      notFound();
    }
  }, [isLoading, isError, semester]);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <DashboardHeader subtitle="Loading..." />
        <div className="flex-1 overflow-y-auto p-6 animate-pulse" />
      </div>
    );
  }

  if (isError || !semester) {
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
          subtitle={`Manage subjects and topics for ${semester.name}`}
          action={<AddSubjectButton semesterId={semesterId} />}
        />
        <SemesterPageClient semesterId={semesterId} subjects={subjects} />
      </div>
    </SemesterProvider>
  );
}
