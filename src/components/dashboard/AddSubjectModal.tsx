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
import { Textarea } from '@/components/ui/textarea';
import { useCreateSubject } from '@/hooks/useSemesterQueries';
import { useToast } from '@/context/toastContext';

interface AddSubjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  semesterId: string;
}

export function AddSubjectModal({
  open,
  onOpenChange,
  semesterId,
}: AddSubjectModalProps) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 1,
  });

  // TanStack Query mutation - handles loading state and cache invalidation automatically
  const createSubjectMutation = useCreateSubject();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Subject name is required');
      return;
    }

    createSubjectMutation.mutate(
      {
        semesterId,
        data: {
          name: formData.name,
          description: formData.description || undefined,
          priority: formData.priority,
        },
      },
      {
        onSuccess: () => {
          toast.success('Subject created successfully');
          setFormData({ name: '', description: '', priority: 1 });
          onOpenChange(false);
          // No need for router.refresh() - TanStack Query invalidates the cache automatically!
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to create subject');
        },
      }
    );
  };

  const handleClose = () => {
    if (!createSubjectMutation.isPending) {
      setFormData({ name: '', description: '', priority: 1 });
      onOpenChange(false);
    }
  };

  const loading = createSubjectMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Create a new subject for this semester. You can add topics and track your progress later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Subject Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Mathematics, Physics"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add a description for this subject (optional)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={loading}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                min="1"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: parseInt(e.target.value) || 1,
                  })
                }
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Higher priority subjects appear first (default: 1)
              </p>
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
              {loading ? 'Creating...' : 'Create Subject'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

