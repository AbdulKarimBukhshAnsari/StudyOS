import { redirectBasedOnOnboardingStatus } from '@/utils/auth';
import { AuthCard } from '@/components/auth/AuthCard';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default async function RegisterPage() {
  // If user is already authenticated, redirect based on onboarding status
  await redirectBasedOnOnboardingStatus();

  return (
    <AuthCard
      svgPath="/assets/auth/register.svg"
      title="REGISTER"
      subtitle="Create your account to get started with StudyOS"
    >
      <RegisterForm />
    </AuthCard>
  );
}

