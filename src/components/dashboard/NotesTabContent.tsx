'use client';

import { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { EmptyStateCard } from '@/components/ui/empty-state-card';
import { SectionHeader } from '@/components/ui/section-header';
import { CardList } from '@/components/ui/card-list';
import { LoadingState } from '@/components/ui/loading-state';
import { NoteRow } from '@/components/dashboard/NoteRow';
import { useNotesByTopic, useDeleteNote } from '@/hooks/useNotesQueries';
import { EditNoteSheet } from '@/components/dashboard/EditNoteSheet';
import { AddNoteModal } from '@/components/dashboard/AddNoteModal';
import { useToast } from '@/context/toastContext';
import type { Note } from '@/types/semester';

interface NotesTabContentProps {
  topicId: string;
}

export function NotesTabContent({ topicId }: NotesTabContentProps) {
  const toast = useToast();
  const { data: notes = [], isLoading } = useNotesByTopic(topicId);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const deleteNoteMutation = useDeleteNote();

  const openNote = (note: Note) => {
    setEditingNoteId(note.id);
    setSheetOpen(true);
  };

  const handleSheetClose = (open: boolean) => {
    setSheetOpen(open);
    if (!open) setEditingNoteId(null);
  };

  const handleDeleteConfirm = () => {
    if (!noteToDelete) return;
    deleteNoteMutation.mutate(
      { noteId: noteToDelete.id, topicId: noteToDelete.topic_id },
      {
        onSuccess: () => {
          toast.success('Note deleted');
          setNoteToDelete(null);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to delete note');
        },
      }
    );
  };

  if (isLoading) {
    return <LoadingState message="Loading notes..." />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={FileText}
        title="Notes"
        subtitle={`${notes.length} note${notes.length !== 1 ? 's' : ''}`}
        actionLabel="Add Note"
        onAction={() => setAddModalOpen(true)}
        actionIcon={Plus}
      />

      {notes.length === 0 ? (
        <EmptyStateCard
          icon={FileText}
          title="No Notes Yet"
          description="Create a note to start writing. Click Add Note and enter a name."
          actionLabel="Add Your First Note"
          actionIcon={Plus}
          onAction={() => setAddModalOpen(true)}
        />
      ) : (
        <CardList>
          {notes.map((note, index) => (
            <NoteRow
              key={note.id}
              note={note}
              index={index}
              totalCount={notes.length}
              onSelect={openNote}
              onDelete={(e) => {
                e.stopPropagation();
                setNoteToDelete(note);
              }}
            />
          ))}
        </CardList>
      )}

      <AddNoteModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        topicId={topicId}
      />

      <EditNoteSheet
        open={sheetOpen}
        onOpenChange={handleSheetClose}
        topicId={topicId}
        noteId={editingNoteId}
      />

      <ConfirmDeleteDialog
        open={!!noteToDelete}
        onOpenChange={(open) => !open && setNoteToDelete(null)}
        title="Delete note"
        itemName={noteToDelete?.topic_name ?? ''}
        onConfirm={handleDeleteConfirm}
        loading={deleteNoteMutation.isPending}
      />
    </div>
  );
}
