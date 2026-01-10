import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function SubjectPageSkeleton() {
  return (
    <div className="h-full flex flex-col">
      <DashboardHeader
        breadcrumbs={[
          { id: 'loading', label: 'Loading...' },
        ]}
        subtitle="Loading..."
      />

      <div className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start bg-muted/50 p-1 h-auto rounded-lg border">
            <TabsTrigger value="overview" disabled>
              <Skeleton className="h-4 w-16" />
            </TabsTrigger>
            <TabsTrigger value="quiz" disabled>
              <Skeleton className="h-4 w-12" />
            </TabsTrigger>
            <TabsTrigger value="topics" disabled>
              <Skeleton className="h-4 w-16" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="space-y-6">
              {/* Hero Section */}
              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <div className="space-y-2">
                          <Skeleton className="h-7 w-48" />
                          <Skeleton className="h-5 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full max-w-2xl" />
                      <Skeleton className="h-4 w-3/4 max-w-2xl mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Section */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-3 w-full rounded-full" />
                  <Skeleton className="h-3 w-48 mt-2" />
                </CardContent>
              </Card>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Skeleton className="h-5 w-5 rounded-lg" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <Skeleton className="h-10 w-16 mt-2" />
                          <Skeleton className="h-3 w-32 mt-2" />
                        </div>
                        <Skeleton className="h-16 w-16 rounded-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 text-center">
                      <Skeleton className="h-8 w-12 mx-auto" />
                      <Skeleton className="h-3 w-16 mx-auto mt-1" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="topics" className="mt-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-28" />
              </div>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4 flex-1">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-5 w-48" />
                        </div>
                        <Skeleton className="h-6 w-20" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

