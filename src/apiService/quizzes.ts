import axiosInstance from '@/service/axiosService';
import { API_URLS } from '@/constants/backendUrls';
import type { Quiz, QuizResult, ApiResponse } from '@/types/semester';

export async function getQuizzesByTopicId(topicId: string): Promise<ApiResponse<Quiz[]>> {
  try {
    const response = await axiosInstance.get<ApiResponse<Quiz[]>>(
      API_URLS.topics.getQuizzes(topicId)
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return { success: false, error: 'Failed to fetch quizzes' };
  }
}

export async function createQuiz(
  topicId: string,
  payload: {
    name: string;
    notesIds: string[];
    questionCount: number;
    questionType: string;
    complexity: string;
  }
): Promise<ApiResponse<Quiz>> {
  try {
    const response = await axiosInstance.post<ApiResponse<Quiz>>(
      API_URLS.topics.createQuiz(topicId),
      {
        name: payload.name.trim(),
        notes_ids: payload.notesIds,
        question_count: payload.questionCount,
        question_type: payload.questionType,
        complexity: payload.complexity,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error);
    return { success: false, error: 'Failed to create quiz' };
  }
}

export async function getQuizResults(
  topicId: string,
  quizId: string
): Promise<ApiResponse<QuizResult[]>> {
  try {
    const response = await axiosInstance.get<ApiResponse<QuizResult[]>>(
      API_URLS.topics.getQuizResults(topicId, quizId)
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return { success: false, error: 'Failed to fetch results' };
  }
}

export async function saveQuizResult(
  topicId: string,
  quizId: string,
  score: number,
  answers: Array<{ questionId: string; selectedAnswer: number }>
): Promise<ApiResponse<QuizResult>> {
  try {
    const response = await axiosInstance.post<ApiResponse<QuizResult>>(
      API_URLS.topics.saveQuizResult(topicId, quizId),
      { score, answers }
    );
    return response.data;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return { success: false, error: 'Failed to save result' };
  }
}

export async function deleteQuiz(
  topicId: string,
  quizId: string
): Promise<ApiResponse<void>> {
  try {
    const response = await axiosInstance.delete<ApiResponse<void>>(
      API_URLS.topics.deleteQuiz(topicId),
      { data: { quizId } }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return { success: false, error: 'Failed to delete quiz' };
  }
}
