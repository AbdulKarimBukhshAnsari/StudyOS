import { getSemesterWithSubjects, getUserSemesters } from '@/serverActions/semester/action';
import { notFound } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { SemesterProvider } from '@/context/semesterContext';
import { getSubjectBreadcrumbs } from '@/hooks/useBreadcrumbs';

interface SubjectPageProps {
  params: Promise<{ semesterId: string; subjectId: string }>;
}

export default async function SubjectDetailPage({ params }: SubjectPageProps) {
  const { semesterId, subjectId } = await params;
  
  // Fetch all data in parallel - React cache() ensures no duplicate queries
  const [semesterData, allSemesters, breadcrumbs] = await Promise.all([
    getSemesterWithSubjects(semesterId),
    getUserSemesters(),
    getSubjectBreadcrumbs(semesterId, subjectId),
  ]);

  if (!semesterData || !semesterData.semester) {
    notFound();
  }

  const { subjects } = semesterData;
  const subject = subjects.find((s) => s.id === subjectId);
  
  if (!subject) {
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
          subtitle={subject.description || `Manage topics for ${subject.name}`}
        />

        <div className="flex-1 overflow-y-auto p-6">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-semibold mb-2">Topics Coming Soon</h3>
                <p className="text-muted-foreground">
                  Topic management will be available here. You will be able to add, organize, and track your learning progress.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SemesterProvider>
  );
}

