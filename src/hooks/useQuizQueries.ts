'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/service/queryKeys';
import * as quizzesApi from '@/apiService/quizzes';
import type { Quiz, QuizResult } from '@/types/semester';

export function useQuizzesByTopic(topicId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.quizzes.byTopic(topicId),
    queryFn: async (): Promise<Quiz[]> => {
      const response = await quizzesApi.getQuizzesByTopicId(topicId);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch quizzes');
      }
      return response.data;
    },
    enabled: (options?.enabled ?? true) && !!topicId,
  });
}
export function useCreateQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      topicId: string;
      name: string;
      notesIds: string[];
      questionCount: number;
      questionType: string;
      complexity: string;
    }) => {
      const response = await quizzesApi.createQuiz(payload.topicId, {
        name: payload.name,
        notesIds: payload.notesIds,
        questionCount: payload.questionCount,
        questionType: payload.questionType,
        complexity: payload.complexity,
      });
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create quiz');
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quizzes.byTopic(data.topic_id) });
    },
  });
}

export function useQuizResults(
  topicId: string,
  quizId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.quizzes.results(topicId, quizId),
    queryFn: async (): Promise<QuizResult[]> => {
      const response = await quizzesApi.getQuizResults(topicId, quizId);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch results');
      }
      return response.data;
    },
    enabled: (options?.enabled ?? true) && !!topicId && !!quizId,
  });
}

export function useSaveQuizResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      topicId: string;
      quizId: string;
      score: number;
      answers: Array<{ questionId: string; selectedAnswer: number }>;
    }) => {
      const response = await quizzesApi.saveQuizResult(
        payload.topicId,
        payload.quizId,
        payload.score,
        payload.answers
      );
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to save result');
      }
      return response.data;
    },
    onSuccess: (_, { topicId, quizId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.quizzes.results(topicId, quizId),
      });
    },
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ topicId, quizId }: { topicId: string; quizId: string }) => {
      const response = await quizzesApi.deleteQuiz(topicId, quizId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete quiz');
      }
    },
    onSuccess: (_, { topicId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quizzes.byTopic(topicId) });
    },
  });
}
