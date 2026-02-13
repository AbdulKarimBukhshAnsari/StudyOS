import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { GraduationCap, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SemesterCardSkeleton } from '@/components/skeleton/SemesterCardSkeleton';

/** Shared skeleton for semester list: used by route loading.tsx and client isLoading so UI stays consistent. */
export function SemesterListSkeleton() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SemesterCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
