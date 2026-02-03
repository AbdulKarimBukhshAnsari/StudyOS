import { SemesterDetailClient } from '@/components/dashboard/SemesterDetailClient';

interface SemesterPageProps {
  params: Promise<{ semesterId: string }>;
}

export default async function SemesterDetailPage({ params }: SemesterPageProps) {
  const { semesterId } = await params;
  return <SemesterDetailClient semesterId={semesterId} />;
}
