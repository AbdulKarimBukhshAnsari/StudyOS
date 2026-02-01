import axiosInstance from '@/service/axiosService';
import { API_URLS } from '@/constants/backendUrls';
import type {
  Semester,
  SemesterWithSubjectCount,
  Subject,
  SubjectWithTopicCount,
  SubjectWithCounts,
  Topic,
  ApiResponse,
} from '@/types/semester';

// Re-export types for convenience
export type {
  Semester,
  SemesterWithSubjectCount,
  Subject,
  SubjectWithTopicCount,
  SubjectWithCounts,
  Topic,
  ApiResponse,
};


export const getUserSemesters = async (): Promise<ApiResponse<SemesterWithSubjectCount[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<SemesterWithSubjectCount[]>>(
      API_URLS.semesters.list
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching semesters:', error);
    return { success: false, error: 'Failed to fetch semesters' };
  }
};

/**
 * Get a single semester by ID
 */
export const getSemesterById = async (semesterId: string): Promise<ApiResponse<Semester>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Semester>>(
      API_URLS.semesters.getById(semesterId)
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching semester:', error);
    return { success: false, error: 'Failed to fetch semester' };
  }
};

/**
 * Create a new semester
 */
export const createSemester = async (data: {
  name: string;
  start_date: string;
  end_date: string;
  is_active?: boolean;
}): Promise<ApiResponse<Semester>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Semester>>(
      API_URLS.semesters.create,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error creating semester:', error);
    return { success: false, error: 'Failed to create semester' };
  }
};


/**
 * Get all subjects for a semester with topic count
 */
export const getSubjectsBySemesterId = async (
  semesterId: string
): Promise<ApiResponse<SubjectWithTopicCount[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<SubjectWithTopicCount[]>>(
      API_URLS.semesters.getSubjects(semesterId)
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return { success: false, error: 'Failed to fetch subjects' };
  }
};

/**
 * Get a subject by ID with topic and quiz counts
 */
export const getSubjectById = async (subjectId: string): Promise<ApiResponse<SubjectWithCounts>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<SubjectWithCounts>>(
      API_URLS.subjects.getById(subjectId)
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching subject:', error);
    return { success: false, error: 'Failed to fetch subject' };
  }
};

/**
 * Create a new subject for a semester
 */
export const createSubject = async (
  semesterId: string,
  data: { name: string; description?: string; priority?: number }
): Promise<ApiResponse<Subject>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Subject>>(
      API_URLS.semesters.createSubject(semesterId),
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error creating subject:', error);
    return { success: false, error: 'Failed to create subject' };
  }
};

/**
 * Delete a subject
 */
export const deleteSubject = async (subjectId: string): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<void>>(
      API_URLS.subjects.delete(subjectId)
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting subject:', error);
    return { success: false, error: 'Failed to delete subject' };
  }
};
/**
 * Get all topics for a subject
 */
export const getTopicsBySubjectId = async (subjectId: string): Promise<ApiResponse<Topic[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Topic[]>>(
      API_URLS.subjects.getTopics(subjectId)
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    return { success: false, error: 'Failed to fetch topics' };
  }
};

/**
 * Get a topic by ID
 */
export const getTopicById = async (topicId: string): Promise<ApiResponse<Topic>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Topic>>(
      API_URLS.topics.getById(topicId)
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching topic:', error);
    return { success: false, error: 'Failed to fetch topic' };
  }
};

/**
 * Create a new topic for a subject
 */
export const createTopic = async (
  subjectId: string,
  data: { name: string }
): Promise<ApiResponse<Topic>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Topic>>(
      API_URLS.subjects.createTopic(subjectId),
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error creating topic:', error);
    return { success: false, error: 'Failed to create topic' };
  }
};

/**
 * Update topic status
 */
export const updateTopicStatus = async (
  topicId: string,
  status: 'Not Clear' | 'Somewhat Clear' | 'Clear'
): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosInstance.patch<ApiResponse<void>>(
      API_URLS.topics.updateStatus(topicId),
      { status }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating topic status:', error);
    return { success: false, error: 'Failed to update topic status' };
  }
};
