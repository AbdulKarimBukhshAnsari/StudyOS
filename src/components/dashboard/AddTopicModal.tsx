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
import { useCreateTopic } from '@/hooks/useSemesterQueries';
import { useToast } from '@/context/toastContext';

interface AddTopicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectId: string;
  semesterId: string;
  currentTopicCount?: number;
  maxTopics?: number;
}

export function AddTopicModal({
  open,
  onOpenChange,
  subjectId,
  semesterId,
  currentTopicCount = 0,
  maxTopics = 50,
}: AddTopicModalProps) {
  const toast = useToast();
  const [name, setName] = useState('');

  const canAddMore = currentTopicCount < maxTopics;

  // TanStack Query mutation - handles loading state and cache invalidation automatically
  const createTopicMutation = useCreateTopic();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Topic name is required');
      return;
    }

    if (!canAddMore) {
      toast.error(`Maximum limit of ${maxTopics} topics reached`);
      return;
    }

    createTopicMutation.mutate(
      {
        subjectId,
        semesterId,
        data: { name },
      },
      {
        onSuccess: () => {
          toast.success('Topic created successfully');
          setName('');
          onOpenChange(false);
          // No need for router.refresh() - TanStack Query invalidates the cache automatically!
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to create topic');
        },
      }
    );
  };

  const handleClose = () => {
    if (!createTopicMutation.isPending) {
      setName('');
      onOpenChange(false);
    }
  };

  const loading = createTopicMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Topic</DialogTitle>
          <DialogDescription>
            Create a new topic for this subject. You can add notes and flashcards later.
            {!canAddMore && (
              <span className="block mt-2 text-destructive font-medium">
                Maximum limit of {maxTopics} topics reached.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="topic-name">Topic Name *</Label>
              <Input
                id="topic-name"
                placeholder="e.g., Introduction to Algebra"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !canAddMore}>
              {loading ? 'Creating...' : 'Create Topic'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

