import {
  getSemesterWithSubjects,
  getUserSemesters,
  getSubjectById,
  getTopicsBySubjectId,
} from '@/apiService/semester.server';
import { notFound } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SemesterProvider } from '@/context/semesterContext';
import { getSubjectBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { SubjectTabs } from '@/components/dashboard/SubjectTabs';

interface SubjectPageProps {
  params: Promise<{ semesterId: string; subjectId: string }>;
}

export default async function SubjectDetailPage({ params }: SubjectPageProps) {
  const { semesterId, subjectId } = await params;
  
  // Fetch all data in parallel - React cache() ensures no duplicate queries
  const [semesterData, allSemesters, breadcrumbs, subjectData, topicsPromise] = await Promise.all([
    getSemesterWithSubjects(semesterId),
    getUserSemesters(),
    getSubjectBreadcrumbs(semesterId, subjectId),
    getSubjectById(subjectId),
    getTopicsBySubjectId(subjectId),
  ]);

  if (!semesterData || !semesterData.semester) {
    notFound();
  }

  const { subjects } = semesterData;
  
  if (!subjectData) {
    notFound();
  }

  return (
    <SemesterProvider
      semesters={allSemesters}
      currentSemesterId={semesterId}
      currentSubjects={subjects}
    >
      <div className="h-full flex flex-col">
        <DashboardHeader
          breadcrumbs={breadcrumbs}
          subtitle={subjectData.description || `Manage topics for ${subjectData.name}`}
        />

        <div className="flex-1 overflow-y-auto p-6">
          <SubjectTabs
            subject={subjectData}
            subjectId={subjectId}
            topics={topicsPromise}
          />
        </div>
      </div>
    </SemesterProvider>
  );
}

