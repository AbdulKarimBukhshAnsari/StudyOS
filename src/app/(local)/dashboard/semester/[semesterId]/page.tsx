import { getSemesterById, getSubjectsBySemesterId } from '@/serverActions/semester/action';
import { notFound } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SubjectCard } from '@/components/dashboard/SubjectCard';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem } from '@/components/dashboard/BreadcrumbNav';
import { getUserSemesters } from '@/serverActions/semester/action';

interface SemesterPageProps {
  params: Promise<{ semesterId: string }>;
}

export default async function SemesterDetailPage({ params }: SemesterPageProps) {
  const { semesterId } = await params;
  const semester = await getSemesterById(semesterId);
  const subjects = await getSubjectsBySemesterId(semesterId);
  const allSemesters = await getUserSemesters();

  if (!semester) {
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
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <DashboardHeader
        breadcrumbs={breadcrumbs}
        subtitle={`Manage subjects and topics for ${semester.name}`}
        action={
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <Plus className="h-4 w-4" />
            New Subject
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        {subjects.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">No Subjects Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by creating your first subject for this semester. Add topics, notes, and track your progress.
                </p>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <Plus className="h-5 w-5" />
                  Create Your First Subject
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                id={subject.id}
                name={subject.name}
                description={subject.description}
                priority={subject.priority}
                topicCount={subject.topic_count}
                href={`/dashboard/semester/${semesterId}/${subject.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

