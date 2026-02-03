import { SubjectDetailClient } from '@/components/dashboard/SubjectDetailClient';

interface SubjectPageProps {
  params: Promise<{ semesterId: string; subjectId: string }>;
}

export default async function SubjectDetailPage({ params }: SubjectPageProps) {
  const { semesterId, subjectId } = await params;
  return <SubjectDetailClient semesterId={semesterId} subjectId={subjectId} />;
}
