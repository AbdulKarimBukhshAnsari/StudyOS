import { Skeleton } from '@/components/ui/skeleton';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { BreadcrumbItem } from '@/components/dashboard/BreadcrumbNav';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SubjectCardSkeleton } from '@/components/skeleton/SubjectCardSkeleton';
import { ROUTES } from '@/constants/routes';

export default function SemesterDetailLoading() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      id: 'semesters',
      label: 'Semesters',
      href: ROUTES.private.dashboardSemester,
    },
    {
      id: 'loading',
      label: 'Loading...',
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <DashboardHeader
        breadcrumbs={breadcrumbs}
        subtitle="Loading subjects..."
        action={
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <Plus className="h-4 w-4" />
            New Subject
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SubjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

