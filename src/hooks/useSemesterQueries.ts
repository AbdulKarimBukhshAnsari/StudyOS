'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/service/queryKeys';
import * as semesterApi from '@/apiService/semester';
import type {
  SemesterWithSubjectCount,
  Semester,
  SubjectWithTopicCount,
  SubjectWithCounts,
  Subject,
  Topic,
} from '@/types/semester';

export function useSemesters() {
  return useQuery({
    queryKey: queryKeys.semesters.list(),
    queryFn: async (): Promise<SemesterWithSubjectCount[]> => {
      const response = await semesterApi.getUserSemesters();
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch semesters');
      }
      return response.data;
    },
  });
}


export function useSemester(
  semesterId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.semesters.detail(semesterId),
    queryFn: async (): Promise<Semester> => {
      const response = await semesterApi.getSemesterById(semesterId);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch semester');
      }
      return response.data;
    },
    enabled: options?.enabled ?? !!semesterId,
  });
}

export function useCreateSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      start_date: string;
      end_date: string;
      is_active?: boolean;
    }) => {
      const response = await semesterApi.createSemester(data);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create semester');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate semesters list so it refetches
      queryClient.invalidateQueries({ queryKey: queryKeys.semesters.all });
    },
  });
}

export function useSubjectsBySemester(
  semesterId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.subjects.bySemester(semesterId),
    queryFn: async (): Promise<SubjectWithTopicCount[]> => {
      const response = await semesterApi.getSubjectsBySemesterId(semesterId);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch subjects');
      }
      return response.data;
    },
    enabled: options?.enabled ?? !!semesterId,
  });
}


export function useSubject(
  subjectId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.subjects.detail(subjectId),
    queryFn: async (): Promise<SubjectWithCounts> => {
      const response = await semesterApi.getSubjectById(subjectId);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch subject');
      }
      return response.data;
    },
    enabled: options?.enabled ?? !!subjectId,
  });
}


export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      semesterId,
      data,
    }: {
      semesterId: string;
      data: { name: string; description?: string; priority?: number };
    }) => {
      const response = await semesterApi.createSubject(semesterId, data);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create subject');
      }
      return { subject: response.data, semesterId };
    },
    onSuccess: ({ semesterId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subjects.bySemester(semesterId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.semesters.all });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subjectId,
      semesterId,
    }: {
      subjectId: string;
      semesterId: string;
    }) => {
      const response = await semesterApi.deleteSubject(subjectId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete subject');
      }
      return { subjectId, semesterId };
    },
    onSuccess: ({ semesterId }) => {
      // Invalidate subjects for this semester
      queryClient.invalidateQueries({
        queryKey: queryKeys.subjects.bySemester(semesterId),
      });
      // Invalidate semesters to update subject count
      queryClient.invalidateQueries({ queryKey: queryKeys.semesters.all });
      // Invalidate all topics (cascade delete)
      queryClient.invalidateQueries({ queryKey: queryKeys.topics.all });
    },
  });
}


export function useTopicsBySubject(
  subjectId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.topics.bySubject(subjectId),
    queryFn: async (): Promise<Topic[]> => {
      const response = await semesterApi.getTopicsBySubjectId(subjectId);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch topics');
      }
      return response.data;
    },
    enabled: options?.enabled ?? !!subjectId,
  });
}


export function useTopic(
  topicId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.topics.detail(topicId),
    queryFn: async (): Promise<Topic> => {
      const response = await semesterApi.getTopicById(topicId);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch topic');
      }
      return response.data;
    },
    enabled: options?.enabled ?? !!topicId,
  });
}


export function useCreateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subjectId,
      semesterId,
      data,
    }: {
      subjectId: string;
      semesterId: string;
      data: { name: string };
    }) => {
      const response = await semesterApi.createTopic(subjectId, data);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create topic');
      }
      return { topic: response.data, subjectId, semesterId };
    },
    onSuccess: ({ subjectId, semesterId }) => {
      // Invalidate topics for this subject
      queryClient.invalidateQueries({
        queryKey: queryKeys.topics.bySubject(subjectId),
      });
      // Invalidate subject detail (topic count)
      queryClient.invalidateQueries({
        queryKey: queryKeys.subjects.detail(subjectId),
      });
      // Invalidate subjects list for semester (topic count in cards)
      queryClient.invalidateQueries({
        queryKey: queryKeys.subjects.bySemester(semesterId),
      });
    },
  });
}


export function useUpdateTopicStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      topicId,
      subjectId,
      status,
    }: {
      topicId: string;
      subjectId: string;
      status: 'Not Clear' | 'Somewhat Clear' | 'Clear';
    }) => {
      const response = await semesterApi.updateTopicStatus(topicId, status);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update topic status');
      }
      return { topicId, subjectId, status };
    },
    onSuccess: ({ topicId, subjectId }) => {
      // Invalidate this topic
      queryClient.invalidateQueries({
        queryKey: queryKeys.topics.detail(topicId),
      });
      // Invalidate topics list for the subject
      queryClient.invalidateQueries({
        queryKey: queryKeys.topics.bySubject(subjectId),
      });
    },
  });
}


export function useSemesterWithSubjects(semesterId: string) {
  const semesterQuery = useSemester(semesterId);
  const subjectsQuery = useSubjectsBySemester(semesterId);

  return {
    semester: semesterQuery.data,
    subjects: subjectsQuery.data ?? [],
    isLoading: semesterQuery.isLoading || subjectsQuery.isLoading,
    isError: semesterQuery.isError || subjectsQuery.isError,
    error: semesterQuery.error || subjectsQuery.error,
  };
}


export function usePrefetchSemester() {
  const queryClient = useQueryClient();

  return (semesterId: string) => {
    // Prefetch semester details
    queryClient.prefetchQuery({
      queryKey: queryKeys.semesters.detail(semesterId),
      queryFn: async () => {
        const response = await semesterApi.getSemesterById(semesterId);
        if (!response.success || !response.data) {
          throw new Error(response.error);
        }
        return response.data;
      },
    });

    // Prefetch subjects for this semester
    queryClient.prefetchQuery({
      queryKey: queryKeys.subjects.bySemester(semesterId),
      queryFn: async () => {
        const response = await semesterApi.getSubjectsBySemesterId(semesterId);
        if (!response.success || !response.data) {
          throw new Error(response.error);
        }
        return response.data;
      },
    });
  };
}
