import axiosInstance from '@/service/axiosService';
import { API_URLS } from '@/constants/backendUrls';
import type { Note, ApiResponse } from '@/types/semester';

export async function getNotesByTopicId(topicId: string): Promise<ApiResponse<Note[]>> {
  try {
    const response = await axiosInstance.get<ApiResponse<Note[]>>(
      API_URLS.topics.getNotes(topicId)
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    return { success: false, error: 'Failed to fetch notes' };
  }
}

export async function getNoteById(noteId: string): Promise<ApiResponse<Note>> {
  try {
    const response = await axiosInstance.get<ApiResponse<Note>>(
      API_URLS.notes.getById(noteId)
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching note:', error);
    return { success: false, error: 'Failed to fetch note' };
  }
}

export async function createNote(
  topicId: string,
  name: string,
  content?: string
): Promise<ApiResponse<Note>> {
  try {
    const defaultContent = JSON.stringify({ type: 'doc', content: [] });
    const response = await axiosInstance.post<ApiResponse<Note>>(
      API_URLS.topics.createNote(topicId),
      { name: name.trim(), content: content ?? defaultContent }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error);
    return { success: false, error: 'Failed to create note' };
  }
}

export async function deleteNote(noteId: string): Promise<ApiResponse<void>> {
  try {
    const response = await axiosInstance.delete<ApiResponse<void>>(
      API_URLS.notes.delete(noteId)
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting note:', error);
    return { success: false, error: 'Failed to delete note' };
  }
}

export async function updateNote(noteId: string, content: string): Promise<ApiResponse<Note>> {
  try {
    const response = await axiosInstance.patch<ApiResponse<Note>>(
      API_URLS.notes.update(noteId),
      { content }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating note:', error);
    return { success: false, error: 'Failed to update note' };
  }
}
