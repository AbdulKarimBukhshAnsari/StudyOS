'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateNote } from '@/hooks/useNotesQueries';
import { useToast } from '@/context/toastContext';

interface AddNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicId: string;
}

export function AddNoteModal({
  open,
  onOpenChange,
  topicId,
}: AddNoteModalProps) {
  const toast = useToast();
  const [name, setName] = useState('');
  const createNoteMutation = useCreateNote();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Note name is required');
      return;
    }
    createNoteMutation.mutate(
      { topicId, name: name.trim() },
      {
        onSuccess: () => {
          toast.success('Note created');
          setName('');
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to create note');
        },
      }
    );
  };

  const handleClose = () => {
    if (!createNoteMutation.isPending) {
      setName('');
      onOpenChange(false);
    }
  };

  const loading = createNoteMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Note</DialogTitle>
          <DialogDescription>
            Enter a name for your note. You can add content after creating it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note-name">Note Name *</Label>
              <Input
                id="note-name"
                placeholder="e.g., Lecture 1 - Introduction"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Creating...' : 'Create Note'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
