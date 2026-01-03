import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { ROUTES } from '@/constants/routes';
import { AuthCard } from '@/components/auth/AuthCard';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default async function RegisterPage() {
  // If user is already authenticated, redirect to dashboard
  const user = await getCurrentUser();
  if (user) {
    redirect(ROUTES.private.dashboard);
  }

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

