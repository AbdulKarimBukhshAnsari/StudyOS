import {
  getSemesterWithSubjects,
  getUserSemesters,
  getSubjectById,
  getTopicById,
  getTopicsBySubjectId,
} from '@/apiService/semester.server';
import { notFound } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SemesterProvider } from '@/context/semesterContext';
import { getTopicBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { TopicWorkspace } from '@/components/dashboard/TopicWorkspace';

interface TopicPageProps {
  params: Promise<{ semesterId: string; subjectId: string; topicId: string }>;
}

export default async function TopicDetailPage({ params }: TopicPageProps) {
  const { semesterId, subjectId, topicId } = await params;
  
  // Fetch all data in parallel
  const [semesterData, allSemesters, breadcrumbs, subjectData, topic, allTopics] = await Promise.all([
    getSemesterWithSubjects(semesterId),
    getUserSemesters(),
    getTopicBreadcrumbs(semesterId, subjectId, topicId),
    getSubjectById(subjectId),
    getTopicById(topicId),
    getTopicsBySubjectId(subjectId),
  ]);

  if (!semesterData || !semesterData.semester) {
    notFound();
  }

  const { subjects } = semesterData;
  
  if (!subjectData || !topic) {
    notFound();
  }

  return (
    <SemesterProvider
      semesters={allSemesters}
      currentSemesterId={semesterId}
      currentSubjects={subjects}
    >
      <div className="h-full flex flex-col">
        <DashboardHeader
          breadcrumbs={breadcrumbs}
          subtitle={`${subjectData.name} • ${topic.status}`}
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

