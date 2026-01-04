import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { ROUTES } from '@/constants/routes';
import { checkOnBoardingStatus } from '@/serverActions/auth/action';
import { Header } from "@/components/HomePage/Header";
import { Hero } from "@/components/HomePage/Hero";
import { ProblemStatement } from "@/components/HomePage/ProblemStatement";
import { Features } from "@/components/HomePage/Features";
import { SolutionOverview } from "@/components/HomePage/SolutionOverview";
import { Footer } from "@/components/HomePage/Footer";

export default async function Home() {
  // If user is authenticated, redirect based on onboarding status
  // This is handled by middleware, but adding as a safety check
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
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ProblemStatement />
      <Features />
      <SolutionOverview />
      <Footer />
    </div>
  );
}
