import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { ROUTES } from '@/constants/routes';
import { checkOnBoardingStatus } from '@/serverActions/auth/action';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // This should be handled by middleware, but adding as a safety check
  if (!user) {
    redirect(ROUTES.public.login);
  }

  // Check if user is onboarded, if not redirect to onboarding
  const isOnboarded = await checkOnBoardingStatus();
  if (!isOnboarded) {
    redirect(`${ROUTES.private.onboarding}/step1`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

