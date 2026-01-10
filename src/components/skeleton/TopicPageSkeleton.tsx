import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TopicPageSkeleton() {
  return (
    <div className="h-full flex flex-col">
      <DashboardHeader
        breadcrumbs={[
          { id: 'loading', label: 'Loading...' },
        ]}
        subtitle="Loading..."
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Topic Navigation and Status */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="w-48">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Topic Info */}
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="flex-1">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="notes" className="w-full">
            <div className="border-b">
              <TabsList className="w-fit bg-transparent border-0 rounded-none h-auto p-0 gap-0">
                {['Notes', 'FlashCard', 'Quiz'].map((tab) => (
                  <TabsTrigger key={tab} value={tab.toLowerCase()} disabled>
                    <Skeleton className="h-4 w-16" />
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="notes" className="mt-6">
              <Card>
                <CardContent className="p-12">
                  <div className="text-center space-y-4">
                    <Skeleton className="h-12 w-12 mx-auto rounded-full" />
                    <Skeleton className="h-6 w-48 mx-auto" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="flashcard" className="mt-6">
              <Card>
                <CardContent className="p-12">
                  <div className="text-center space-y-4">
                    <Skeleton className="h-12 w-12 mx-auto rounded-full" />
                    <Skeleton className="h-6 w-48 mx-auto" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quiz" className="mt-6">
              <Card>
                <CardContent className="p-12">
                  <div className="text-center space-y-4">
                    <Skeleton className="h-12 w-12 mx-auto rounded-full" />
                    <Skeleton className="h-6 w-48 mx-auto" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

