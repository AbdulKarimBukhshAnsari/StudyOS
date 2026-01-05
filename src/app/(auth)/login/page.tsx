import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { ROUTES } from '@/constants/routes';
import { checkOnBoardingStatus } from '@/serverActions/auth/action';
import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm } from '@/components/auth/LoginForm';

export default async function LoginPage() {
  // If user is already authenticated, redirect based on onboarding status
  const user = await getCurrentUser();
  if (user) {
    const isOnboarded = await checkOnBoardingStatus();
    if (isOnboarded) {
      redirect(ROUTES.private.dashboard);
    } else {
      redirect(`${ROUTES.private.onboarding}/step1`);
    }
  }

  return (
    <AuthCard
      svgPath="/assets/auth/login.svg"
      title="LOGIN"
      subtitle="Welcome back! Please enter your details."
    >
      <LoginForm />
    </AuthCard>
  );
}

