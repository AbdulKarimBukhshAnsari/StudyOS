import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export function ProfileSkeleton() {
  return (
    <div className="h-full">
      <DashboardHeader
        title={
          <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent flex items-center gap-2">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-20" />
          </span>
        }
        subtitle="Loading..."
      />

      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <Skeleton className="w-24 h-24 rounded-full" />

                {/* User Info */}
                <div className="flex-1 text-center md:text-left space-y-3">
                  <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
                  <Skeleton className="h-4 w-64 mx-auto md:mx-0" />
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-11 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sign Out Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

