'use client';

import {useState} from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ArrowLeft, ArrowRight, Loader2, GraduationCap } from 'lucide-react';
import { OnboardingCard } from '@/components/OnBoarding/OnboardingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOnboarding } from '@/context/onboardingContext';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { formatDateForInput, getTodayDateString, resetTimeToMidnight, getDaysDifference } from '@/utils/date';
import { isNotEmpty, validateSemesterDateRange } from '@/utils/validation';

export default function OnboardingStep2() {
  const router = useRouter();
  const { onboardingDetails, setOnboardingDetails } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    semesterName?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  const [formData, setFormData] = useState({
    semesterName: onboardingDetails?.semesterName || '',
    startDate: onboardingDetails?.semesterStartDate 
      ? formatDateForInput(onboardingDetails.semesterStartDate)
      : '',
    endDate: onboardingDetails?.semesterEndDate
      ? formatDateForInput(onboardingDetails.semesterEndDate)
      : '',
  });

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!isNotEmpty(formData.semesterName)) {
      newErrors.semesterName = 'Semester name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      const dateValidation = validateSemesterDateRange(start, end);
      if (!dateValidation.isValid) {
        if (dateValidation.error?.includes('past')) {
          newErrors.startDate = dateValidation.error;
        } else {
          newErrors.endDate = dateValidation.error || 'Invalid date range';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Update context with semester data
    setOnboardingDetails((prev) => ({
      ...prev,
      semesterName: formData.semesterName.trim(),
      semesterStartDate: new Date(formData.startDate),
      semesterEndDate: new Date(formData.endDate),
      subjectName: prev?.subjectName || '',
      subjectDescription: prev?.subjectDescription || '',
      subjectPriority: prev?.subjectPriority || 1,
    }));

    setTimeout(() => {
      router.push(ROUTES.private.onboarding.step3);
      setIsLoading(false);
    }, 100);
  };

  const handleBack = () => {
    router.push(ROUTES.private.onboarding.step1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <OnboardingCard
      icon={GraduationCap}
      title="Set Up Your Semester"
      subtitle="Tell us about your current semester"
      stepNumber={2}
      totalSteps={3}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleNext();
        }}
        className="space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="semesterName">Semester Name</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="semesterName"
              name="semesterName"
              type="text"
              placeholder="e.g., Fall 2024, Spring 2025"
              value={formData.semesterName}
              onChange={handleChange}
              className={cn("pl-10", errors.semesterName && "border-destructive")}
              disabled={isLoading}
            />
          </div>
          {errors.semesterName && (
            <p className="text-sm text-destructive">{errors.semesterName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className={cn("pl-10", errors.startDate && "border-destructive")}
              disabled={isLoading}
              // min={getTodayDateString()}
            />
          </div>
          {errors.startDate && (
            <p className="text-sm text-destructive">{errors.startDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              className={cn("pl-10", errors.endDate && "border-destructive")}
              disabled={isLoading}
              min={formData.startDate ? new Date(new Date(formData.startDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : getTodayDateString()}
            />
          </div>
          {errors.endDate && (
            <p className="text-sm text-destructive">{errors.endDate}</p>
          )}
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
            type="submit"
            className="flex-1"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </OnboardingCard>
  );
}

