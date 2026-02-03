'use client';

import { useEffect } from 'react';
import { notFound } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SemesterProvider } from '@/context/semesterContext';
import { TopicWorkspace } from '@/components/dashboard/TopicWorkspace';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import {
  useSemesters,
  useSemesterWithSubjects,
  useSubject,
  useTopic,
  useTopicsBySubject,
} from '@/hooks/useSemesterQueries';

interface TopicDetailClientProps {
  semesterId: string;
  subjectId: string;
  topicId: string;
}

export function TopicDetailClient({
  semesterId,
  subjectId,
  topicId,
}: TopicDetailClientProps) {
  const { data: semesters = [] } = useSemesters();
  const { semester, subjects, isLoading: loadingSemester } = useSemesterWithSubjects(semesterId);
  const { data: subject, isLoading: loadingSubject } = useSubject(subjectId);
  const { data: topic, isLoading: loadingTopic } = useTopic(topicId);
  const { data: allTopics = [], isLoading: loadingTopics } = useTopicsBySubject(subjectId);
  const breadcrumbs = useBreadcrumbs(semesterId, subjectId, topicId);

  const isLoading =
    loadingSemester || loadingSubject || loadingTopic || loadingTopics;

  useEffect(() => {
    if (!isLoading && (!semester || !subject || !topic)) {
      notFound();
    }
  }, [isLoading, semester, subject, topic]);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <DashboardHeader subtitle="Loading..." />
        <div className="flex-1 overflow-y-auto p-6 animate-pulse" />
      </div>
    );
  }

  if (!semester || !subject || !topic) {
    notFound();
  }

  return (
    <SemesterProvider
      semesters={semesters}
      currentSemesterId={semesterId}
      currentSubjects={subjects}
    >
      <div className="h-full flex flex-col">
        <DashboardHeader
          breadcrumbs={breadcrumbs}
          subtitle={`${subject.name} • ${topic.status}`}
        />
        <div className="flex-1 overflow-y-auto p-6">
          <TopicWorkspace
            topic={topic}
            topicId={topicId}
            semesterId={semesterId}
            subjectId={subjectId}
            allTopics={allTopics}
          />
        </div>
      </div>
    </SemesterProvider>
  );
}
