import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm } from '@/components/auth/LoginForm';

export default async function LoginPage() {
  // If user is already authenticated, redirect to dashboard
  const user = await getCurrentUser();
  if (user) {
    redirect('/dashboard');
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

