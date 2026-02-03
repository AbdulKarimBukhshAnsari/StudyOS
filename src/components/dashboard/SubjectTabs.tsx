'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubjectOverviewTab } from './SubjectOverviewTab';
import { SubjectTopicsTab } from './SubjectTopicsTab';
import { LayoutDashboard, HelpCircle, BookOpen } from 'lucide-react';
import type { Topic } from '@/types/semester';

interface SubjectTabsProps {
  subject: {
    id: string;
    name: string;
    description: string | null;
    priority: number;
    topic_count: number;
    quiz_count: number;
    semester_id: string;
  };
  subjectId: string;
  topics: Topic[];
}

export function SubjectTabs({ subject, subjectId, topics }: SubjectTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="w-full justify-start bg-muted/50 p-1 h-auto rounded-lg border">
        <TabsTrigger 
          value="overview" 
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Overview</span>
        </TabsTrigger>
        <TabsTrigger 
          value="quiz"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Quiz</span>
        </TabsTrigger>
        <TabsTrigger 
          value="topics"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          <BookOpen className="h-4 w-4" />
          <span>Topics</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-8">
        <SubjectOverviewTab subject={subject} />
      </TabsContent>
      
      <TabsContent value="quiz" className="mt-8">
        <div className="text-center py-16 border border-dashed rounded-xl bg-muted/30">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
              <HelpCircle className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Quiz Coming Soon</h3>
            <p className="text-sm text-muted-foreground">
              Quiz functionality will be available here soon. You&apos;ll be able to test your knowledge and track your progress.
            </p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="topics" className="mt-8">
        <SubjectTopicsTab 
          subjectId={subjectId} 
          semesterId={subject.semester_id}
          topics={topics} 
        />
      </TabsContent>
    </Tabs>
  );
}

