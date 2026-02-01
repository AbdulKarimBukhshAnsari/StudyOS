import { serverApiFetch } from '@/lib/serverFetch';
import { API_URLS } from '@/constants/backendUrls';
import type {
  Semester,
  SemesterWithSubjectCount,
  SubjectWithTopicCount,
  SubjectWithCounts,
  Topic,
} from '@/types/semester';


export async function getUserSemesters(): Promise<SemesterWithSubjectCount[]> {
  const data = await serverApiFetch<SemesterWithSubjectCount[]>(API_URLS.semesters.list);
  return data || [];
}


export async function getSemesterById(semesterId: string): Promise<Semester | null> {
  return serverApiFetch<Semester>(API_URLS.semesters.getById(semesterId));
}


export async function getSubjectsBySemesterId(
  semesterId: string
): Promise<SubjectWithTopicCount[]> {
  const data = await serverApiFetch<SubjectWithTopicCount[]>(
    API_URLS.semesters.getSubjects(semesterId)
  );
  return data || [];
}


export async function getSubjectById(subjectId: string): Promise<SubjectWithCounts | null> {
  return serverApiFetch<SubjectWithCounts>(API_URLS.subjects.getById(subjectId));
}


 // Get semester with subjects in a combined call
 
export async function getSemesterWithSubjects(semesterId: string): Promise<{
  semester: Semester;
  subjects: SubjectWithTopicCount[];
} | null> {
  const [semester, subjects] = await Promise.all([
    getSemesterById(semesterId),
    getSubjectsBySemesterId(semesterId),
  ]);

  if (!semester) {
    return null;
  }

  return { semester, subjects };
}

/**
 * Get all topics for a subject
 */
export async function getTopicsBySubjectId(subjectId: string): Promise<Topic[]> {
  const data = await serverApiFetch<Topic[]>(API_URLS.subjects.getTopics(subjectId));
  return data || [];
}

/**
 * Get a topic by ID
 */
export async function getTopicById(topicId: string): Promise<Topic | null> {
  return serverApiFetch<Topic>(API_URLS.topics.getById(topicId));
}
