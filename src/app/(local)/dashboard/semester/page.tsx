import { GraduationCap, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { getUserSemesters } from '@/serverActions/semester/action';
import { SemesterCard } from '@/components/dashboard/SemesterCard';
import { Card, CardContent } from '@/components/ui/card';
import { routeHelpers } from '@/constants/routes';

export default async function SemesterPage() {
  const semesters = await getUserSemesters();

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
            <Plus className="h-4 w-4" />
            New Semester
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        {semesters.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center">
                  <GraduationCap className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">No Semesters Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by creating your first semester. Organize your courses, track your progress, and stay on top of your academic goals.
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <Plus className="h-5 w-5" />
                  Create Your First Semester
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {semesters.map((semester) => (
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

