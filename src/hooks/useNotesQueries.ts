'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/service/queryKeys';
import * as notesApi from '@/apiService/notes';
import type { Note } from '@/types/semester';

export function useNotesByTopic(topicId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.notes.byTopic(topicId),
    queryFn: async (): Promise<Note[]> => {
      const response = await notesApi.getNotesByTopicId(topicId);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch notes');
      }
      return response.data;
    },
    enabled: (options?.enabled ?? true) && !!topicId,
  });
}

export function useNote(noteId: string | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.notes.detail(noteId ?? ''),
    queryFn: async (): Promise<Note> => {
      if (!noteId) throw new Error('No note id');
      const response = await notesApi.getNoteById(noteId);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch note');
      }
      return response.data;
    },
    enabled: (options?.enabled ?? true) && !!noteId,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      topicId,
      name,
      content,
    }: {
      topicId: string;
      name: string;
      content?: string;
    }) => {
      const response = await notesApi.createNote(topicId, name, content);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create note');
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.byTopic(data.topic_id) });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ noteId, topicId }: { noteId: string; topicId: string }) => {
      const response = await notesApi.deleteNote(noteId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete note');
      }
      return { noteId, topicId };
    },
    onSuccess: (_, { topicId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.byTopic(topicId) });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ noteId, content }: { noteId: string; content: string }) => {
      const response = await notesApi.updateNote(noteId, content);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to update note');
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.byTopic(data.topic_id) });
    },
  });
}
