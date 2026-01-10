'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { createTopic } from '@/serverActions/semester/action';
import { useToast } from '@/context/toastContext';

interface AddTopicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectId: string;
}

export function AddTopicModal({
  open,
  onOpenChange,
  subjectId,
}: AddTopicModalProps) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Topic name is required');
      return;
    }

    setLoading(true);
    const result = await createTopic(subjectId, { name });

    setLoading(false);

    if (result.success) {
      toast.success('Topic created successfully');
      setName('');
      onOpenChange(false);
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to create topic');
    }
  };

  const handleClose = () => {
    if (!loading) {
      setName('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Topic</DialogTitle>
          <DialogDescription>
            Create a new topic for this subject. You can add notes and flashcards later.
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Topic'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

