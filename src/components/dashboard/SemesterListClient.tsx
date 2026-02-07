'use client';

import { GraduationCap, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SemesterCard } from '@/components/dashboard/SemesterCard';
import { EmptyStateCard } from '@/components/ui/empty-state-card';
import { Card, CardContent } from '@/components/ui/card';
import { routeHelpers } from '@/constants/routes';
import { useSemesters } from '@/hooks/useSemesterQueries';

export function SemesterListClient() {
  const { data: semesters, isLoading, isError, error } = useSemesters();

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <DashboardHeader
          title={
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              Semester Management
            </span>
          }
          subtitle="Organize and manage your academic semesters"
        />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 h-32" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex flex-col">
        <DashboardHeader
          title="Semester Management"
          subtitle={error?.message ?? 'Failed to load semesters'}
        />
        <div className="flex-1 overflow-y-auto p-6">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Something went wrong.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const list = semesters ?? [];

  return (
    <div className="h-full flex flex-col">
      <DashboardHeader
        title={
          <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Semester Management
          </span>
        }
        subtitle="Organize and manage your academic semesters"
        action={
          <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <Plus className="h-6 w-6" />
            New Semester
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        {list.length === 0 ? (
          <EmptyStateCard
            icon={GraduationCap}
            iconContainerClassName="w-20 h-20 mb-6 bg-gradient-to-br from-purple-500/20 to-purple-600/10"
            iconClassName="h-10 w-10 text-purple-600"
            title="No Semesters Yet"
            description="Get started by creating your first semester. Organize your courses, track your progress, and stay on top of your academic goals."
            actionLabel="Create Your First Semester"
            actionIcon={Plus}
            onAction={() => {}}
            actionClassName="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((semester) => (
              <SemesterCard
                key={semester.id}
                id={semester.id}
                name={semester.name}
                startDate={semester.start_date}
                endDate={semester.end_date}
                isActive={semester.is_active}
                subjectCount={semester.subject_count}
                href={routeHelpers.semester(semester.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
