import { getSemesterById, getSubjectsBySemesterId } from '@/serverActions/semester/action';
import { notFound } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { BreadcrumbItem } from '@/components/dashboard/BreadcrumbNav';
import { getUserSemesters } from '@/serverActions/semester/action';
import { Card, CardContent } from '@/components/ui/card';

interface SubjectPageProps {
  params: Promise<{ semesterId: string; subjectId: string }>;
}

export default async function SubjectDetailPage({ params }: SubjectPageProps) {
  const { semesterId, subjectId } = await params;
  const semester = await getSemesterById(semesterId);
  const subjects = await getSubjectsBySemesterId(semesterId);
  const allSemesters = await getUserSemesters();

  if (!semester) {
    notFound();
  }

  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) {
    notFound();
  }

  const breadcrumbs: BreadcrumbItem[] = [
    {
      id: 'semesters',
      label: 'Semesters',
      href: '/dashboard/semester',
      options: allSemesters.map((s) => ({
        id: s.id,
        label: s.name,
        href: `/dashboard/semester/${s.id}`,
      })),
    },
    {
      id: semester.id,
      label: semester.name,
      href: `/dashboard/semester/${semester.id}`,
      options: subjects.map((s) => ({
        id: s.id,
        label: s.name,
        href: `/dashboard/semester/${semesterId}/${s.id}`,
      })),
    },
    {
      id: subject.id,
      label: subject.name,
      href: `/dashboard/semester/${semesterId}/${subjectId}`,
    },
  ];

  return (
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
  );
}

