'use client';

import { useRouter } from 'next/navigation';
import { Rocket, BookOpen, Target, Zap, Sparkles } from 'lucide-react';
import { OnboardingCard } from '@/components/OnBoarding/OnboardingCard';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export default function OnboardingStep1() {
  const router = useRouter();

  const handleNext = () => {
    router.push(ROUTES.private.onboarding.step2);
  };

  return (
    <OnboardingCard
      icon={Rocket}
      title="Welcome to Study OS!"
      subtitle="Let's set up your study journey in just a few steps"
      stepNumber={1}
      totalSteps={3}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 hover:border-primary/30 transition-colors">
            <div className="p-2.5 rounded-lg bg-primary/20 backdrop-blur-sm shrink-0">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 pt-0.5">
              <h3 className="font-semibold text-base mb-1.5">Organize Your Studies</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create semesters, add subjects, and track your progress all in one place.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 hover:border-primary/30 transition-colors">
            <div className="p-2.5 rounded-lg bg-primary/20 backdrop-blur-sm shrink-0">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 pt-0.5">
              <h3 className="font-semibold text-base mb-1.5">Stay on Track</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Set priorities, manage topics, and never miss an important deadline.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 hover:border-primary/30 transition-colors">
            <div className="p-2.5 rounded-lg bg-primary/20 backdrop-blur-sm shrink-0">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 pt-0.5">
              <h3 className="font-semibold text-base mb-1.5">Boost Your Learning</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create notes, flashcards, and quizzes to enhance your understanding.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <Button
            onClick={handleNext}
            className="w-full group"
            size="lg"
          >
            <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            Let&apos;s Get Started!
          </Button>
        </div>
      </div>
    </OnboardingCard>
  );
}

