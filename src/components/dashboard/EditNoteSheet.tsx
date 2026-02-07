'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { useNote, useCreateNote, useUpdateNote } from '@/hooks/useNotesQueries';
import { useToast } from '@/context/toastContext';
import type { JSONContent } from '@tiptap/core';

const defaultContent: JSONContent = { type: 'doc', content: [] };

function parseContent(s: string): JSONContent {
  try {
    const v = JSON.parse(s);
    return v && typeof v === 'object' && v.type === 'doc' ? v : defaultContent;
  } catch {
    return defaultContent;
  }
}

interface EditNoteFormInnerProps {
  initialContent: JSONContent;
  topicId: string;
  noteId: string | null;
  onDirtyChange: (dirty: boolean) => void;
  onSavingChange: (saving: boolean) => void;
  saveRequestRef: React.MutableRefObject<(() => void) | null>;
  onClose: () => void;
}

function EditNoteFormInner({
  initialContent,
  topicId,
  noteId,
  onDirtyChange,
  onSavingChange,
  saveRequestRef,
  onClose,
}: EditNoteFormInnerProps) {
  const [currentContent, setCurrentContent] = useState<JSONContent>(initialContent);
  const [savedContent, setSavedContent] = useState<JSONContent>(initialContent);

  const isDirty =
    JSON.stringify(currentContent) !== JSON.stringify(savedContent);

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleContentChange = useCallback((json: JSONContent) => {
    setCurrentContent(json);
  }, []);

  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const toast = useToast();

  const handleSave = useCallback(async () => {
    const contentStr = JSON.stringify(currentContent);
    if (noteId) {
      updateNote.mutate(
        { noteId, content: contentStr },
        {
          onSuccess: () => {
            setSavedContent(currentContent);
            toast.success('Note saved');
            onClose();
          },
          onError: (e: unknown) => toast.error(e instanceof Error ? e.message : 'Failed to save note'),
        }
      );
    } else {
      createNote.mutate(
        { topicId, name: 'Untitled Note', content: contentStr },
        {
          onSuccess: () => {
            setSavedContent(currentContent);
            toast.success('Note created');
            onClose();
          },
          onError: (e: unknown) => toast.error(e instanceof Error ? e.message : 'Failed to create note'),
        }
      );
    }
  }, [currentContent, noteId, topicId, updateNote, createNote, toast, onClose]);

  useEffect(() => {
    saveRequestRef.current = handleSave;
    return () => {
      saveRequestRef.current = null;
    };
  }, [handleSave, saveRequestRef]);

  useEffect(() => {
    onSavingChange(createNote.isPending || updateNote.isPending);
    return () => onSavingChange(false);
  }, [createNote.isPending, updateNote.isPending, onSavingChange]);

  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <SimpleEditor
        initialContent={initialContent}
        onContentChange={handleContentChange}
        showThemeToggle={false}
      />
    </div>
  );
}

interface EditNoteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicId: string;
  noteId: string | null;
}

export function EditNoteSheet({
  open,
  onOpenChange,
  topicId,
  noteId,
}: EditNoteSheetProps) {
  const { data: note, isLoading: loadingNote } = useNote(open && noteId ? noteId : null);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const saveRequestRef = useRef<(() => void) | null>(null);

  const initialContent = noteId && note
    ? parseContent(note.content)
    : noteId
      ? null
      : defaultContent;

  const formKey = noteId ? (note?.id ?? 'loading') : 'new';
  const resolvedContent = initialContent ?? defaultContent;

  const doClose = useCallback(() => {
    onOpenChange(false);
    setConfirmCloseOpen(false);
  }, [onOpenChange]);

  const handleSheetOpenChange = useCallback(
    (next: boolean) => {
      if (next) {
        onOpenChange(true);
        setIsDirty(false);
        return;
      }
      if (isDirty) {
        setConfirmCloseOpen(true);
      } else {
        onOpenChange(false);
      }
    },
    [onOpenChange, isDirty]
  );

  const handleConfirmSave = () => {
    setConfirmCloseOpen(false);
    saveRequestRef.current?.();
  };

  return (
    <>
      <Sheet open={open} onOpenChange={handleSheetOpenChange}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>
              {noteId ? (note?.topic_name ?? (loadingNote ? 'Loading...' : 'Note')) : 'New Note'}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-hidden flex flex-col min-h-0 py-4">
            {loadingNote && noteId ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Loading...
              </div>
            ) : (
              <EditNoteFormInner
                key={formKey}
                initialContent={resolvedContent}
                topicId={topicId}
                noteId={noteId}
                onDirtyChange={setIsDirty}
                onSavingChange={setSaving}
                saveRequestRef={saveRequestRef}
                onClose={doClose}
              />
            )}
          </div>
          <SheetFooter className="border-t pt-4">
            <Button
              onClick={() => saveRequestRef.current?.()}
              disabled={saving || loadingNote}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={confirmCloseOpen} onOpenChange={setConfirmCloseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved changes</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Do you want to save your changes before closing?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmCloseOpen(false)}>
              Cancel
            </Button>
            <Button variant="ghost" onClick={() => { setConfirmCloseOpen(false); onOpenChange(false); }}>
              Don&apos;t save
            </Button>
            <Button onClick={handleConfirmSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
