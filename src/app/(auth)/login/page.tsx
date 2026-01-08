import { redirectBasedOnOnboardingStatus } from '@/utils/auth';
import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm } from '@/components/auth/LoginForm';

export default async function LoginPage() {
  // If user is already authenticated, redirect based on onboarding status
  await redirectBasedOnOnboardingStatus();

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

