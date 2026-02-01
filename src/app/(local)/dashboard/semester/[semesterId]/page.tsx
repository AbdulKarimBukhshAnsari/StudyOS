import { getSemesterWithSubjects, getUserSemesters } from '@/apiService/semester.server';
import { notFound } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SemesterPageClient } from '@/components/dashboard/SemesterPageClient';
import { AddSubjectButton } from '@/components/dashboard/AddSubjectButton';
import { SemesterProvider } from '@/context/semesterContext';
import { getSemesterBreadcrumbs } from '@/hooks/useBreadcrumbs';

interface SemesterPageProps {
  params: Promise<{ semesterId: string }>;
}

export default async function SemesterDetailPage({ params }: SemesterPageProps) {
  const { semesterId } = await params;
  
  // Fetch all data in parallel - React cache() ensures no duplicate queries
  const [semesterData, allSemesters, breadcrumbs] = await Promise.all([
    getSemesterWithSubjects(semesterId),
    getUserSemesters(),
    getSemesterBreadcrumbs(semesterId),
  ]);

  if (!semesterData || !semesterData.semester) {
    notFound();
  }

  const { semester, subjects } = semesterData;

  return (
    <SemesterProvider
      semesters={allSemesters}
      currentSemesterId={semesterId}
      currentSubjects={subjects}
    >
      <div className="h-full flex flex-col">
        <DashboardHeader
          breadcrumbs={breadcrumbs}
          subtitle={`Manage subjects and topics for ${semester.name}`}
          action={
            <AddSubjectButton semesterId={semesterId} />
          }
        />

        <SemesterPageClient semesterId={semesterId} subjects={subjects} />
      </div>
    </SemesterProvider>
  );
}

