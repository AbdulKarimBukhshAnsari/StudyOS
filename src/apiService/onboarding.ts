import axiosInstance from '@/service/axiosService';
import { API_URLS } from '@/constants/backendUrls';

export type OnboardingData = {
  semesterName: string;
  semesterStartDate: Date | string;
  semesterEndDate: Date | string;
  subjectName: string;
  subjectDescription: string;
  subjectPriority: number;
};

export type OnboardingResponse = {
  success: boolean;
  data?: {
    semester: {
      id: string;
      name: string;
      start_date: string;
      end_date: string;
      is_active: boolean;
    };
    subject: {
      id: string;
      name: string;
      description: string | null;
      priority: number;
    };
  };
  error?: string;
};

/**
 * Complete the onboarding process by creating a semester and subject
 * @param data - Onboarding data containing semester and subject information
 * @returns Promise with the onboarding result
 */
export const completeOnboarding = async (
  data: OnboardingData
): Promise<OnboardingResponse> => {
  try {
    const payload = {
      semesterName: data.semesterName,
      semesterStartDate:
        data.semesterStartDate instanceof Date
          ? data.semesterStartDate.toISOString()
          : data.semesterStartDate,
      semesterEndDate:
        data.semesterEndDate instanceof Date
          ? data.semesterEndDate.toISOString()
          : data.semesterEndDate,
      subjectName: data.subjectName,
      subjectDescription: data.subjectDescription,
      subjectPriority: data.subjectPriority,
    };

    const response = await axiosInstance.post<OnboardingResponse>(
      API_URLS.onboarding.complete,
      payload
    );

    return response.data;
  } catch (error) {
    console.error('Onboarding API call failed:', error);
    
    // Handle axios error response
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: OnboardingResponse } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
};
