'use client';

import {useState , useEffect} from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BookOpen, ArrowLeft, Check, Loader2, Plus, Library } from 'lucide-react';
import { OnboardingCard } from '@/components/OnBoarding/OnboardingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOnboarding } from '@/context/onboardingContext';
import { completeOnboarding } from '@/serverActions/onboarding/action';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

export default function OnboardingStep3() {
  const router = useRouter();
  const { onboardingDetails, setOnboardingDetails } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    subjectName?: string;
  }>({});

  const [formData, setFormData] = useState({
    subjectName: onboardingDetails?.subjectName || '',
    subjectDescription: onboardingDetails?.subjectDescription || '',
  });

  // Redirect if semester data is missing
  useEffect(() => {
    if (!onboardingDetails?.semesterName || !onboardingDetails?.semesterStartDate || !onboardingDetails?.semesterEndDate) {
      router.push(`${ROUTES.private.onboarding}/step2`);
    }
  }, [onboardingDetails, router]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.subjectName.trim()) {
      newErrors.subjectName = 'Subject name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplete = async () => {
    if (!validateForm()) {
      return;
    }

    if (!onboardingDetails?.semesterName || !onboardingDetails?.semesterStartDate || !onboardingDetails?.semesterEndDate) {
      setError('Please complete the previous steps');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Update context with subject data
    if (!onboardingDetails) {
      setError('Please complete the previous steps');
      setIsLoading(false);
      return;
    }

    const updatedDetails: typeof onboardingDetails = {
      ...onboardingDetails,
      subjectName: formData.subjectName.trim(),
      subjectDescription: formData.subjectDescription.trim(),
      subjectPriority: 1,
    };

    setOnboardingDetails(updatedDetails);

    try {
      const result = await completeOnboarding({
        semesterName: updatedDetails.semesterName,
        semesterStartDate: new Date(updatedDetails.semesterStartDate),
        semesterEndDate: new Date(updatedDetails.semesterEndDate),
        subjectName: updatedDetails.subjectName,
        subjectDescription: updatedDetails.subjectDescription,
        subjectPriority: updatedDetails.subjectPriority,
      });

      if (result.success) {
        window.location.href = ROUTES.private.dashboard;
      } else {
        setError(result.error || 'Failed to complete onboarding. Please try again.');
        setIsLoading(false);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    // Update context before going back
    if (onboardingDetails) {
      setOnboardingDetails({
        ...onboardingDetails,
        subjectName: formData.subjectName,
        subjectDescription: formData.subjectDescription,
      });
    }
    router.push(`${ROUTES.private.onboarding}/step2`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (error) {
      setError(null);
    }
  };

  return (
    <OnboardingCard
      icon={Library}
      title="Add Your First Subject"
      subtitle="Let's start with one subject. You can add more later!"
      stepNumber={3}
      totalSteps={3}
    >
      <div className="space-y-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-start gap-3">
            <Plus className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Don&apos;t worry! You can add more subjects later from your dashboard. This is just to get you started.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subjectName">Subject Name</Label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="subjectName"
              name="subjectName"
              type="text"
              placeholder="e.g., Mathematics, Computer Science"
              value={formData.subjectName}
              onChange={handleChange}
              className={cn("pl-10", errors.subjectName && "border-destructive")}
              disabled={isLoading}
              required
            />
          </div>
          {errors.subjectName && (
            <p className="text-sm text-destructive">{errors.subjectName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subjectDescription">Description (Optional)</Label>
          <textarea
            id="subjectDescription"
            name="subjectDescription"
            placeholder="Add a brief description about this subject..."
            value={formData.subjectDescription}
            onChange={handleChange}
            rows={4}
            className={cn(
              "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              "placeholder:text-muted-foreground"
            )}
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="flex-1"
            size="lg"
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            type="button"
            onClick={handleComplete}
            className="flex-1"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Complete Setup
              </>
            )}
          </Button>
        </div>
      </div>
    </OnboardingCard>
  );
}

