'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlaceholderBlock } from '@/components/ui/placeholder-block';
import { SubjectOverviewTab } from './SubjectOverviewTab';
import { SubjectTopicsTab } from './SubjectTopicsTab';
import { LayoutDashboard, HelpCircle, BookOpen } from 'lucide-react';
import type { Topic } from '@/types/semester';
import { useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();
  const isTopic = searchParams.get('isTopic') === 'true';
  const [activeTab, setActiveTab] = useState(isTopic ? 'topics' : 'overview');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
        <PlaceholderBlock
          icon={HelpCircle}
          title="Quiz Coming Soon"
          description="Quiz functionality will be available here soon. You'll be able to test your knowledge and track your progress."
          iconClassName="text-purple-600"
        />
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

