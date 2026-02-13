import { requireAuthAndOnboarding } from '@/utils/auth';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { TopProgressBar } from '@/components/dashboard/TopProgressBar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cached per request (userContext); avoids duplicate auth/DB calls in same render
  await requireAuthAndOnboarding();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <TopProgressBar />
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

