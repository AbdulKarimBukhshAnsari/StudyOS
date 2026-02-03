import { TopicDetailClient } from '@/components/dashboard/TopicDetailClient';

interface TopicPageProps {
  params: Promise<{
    semesterId: string;
    subjectId: string;
    topicId: string;
  }>;
}

export default async function TopicDetailPage({ params }: TopicPageProps) {
  const { semesterId, subjectId, topicId } = await params;
  return (
    <TopicDetailClient
      semesterId={semesterId}
      subjectId={subjectId}
      topicId={topicId}
    />
  );
}
