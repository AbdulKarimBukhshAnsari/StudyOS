'use client';

import { useState } from 'react';
import { BookOpen, FileText, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useDeleteSubject } from '@/hooks/useSemesterQueries';
import { useToast } from '@/context/toastContext';

interface SubjectCardProps {
  id: string;
  name: string;
  description?: string | null;
  priority: number;
  topicCount: number;
  href: string;
  semesterId: string;
}

export function SubjectCard({
  id,
  name,
  description,
  priority, // eslint-disable-line @typescript-eslint/no-unused-vars
  topicCount,
  href,
  semesterId,
}: SubjectCardProps) {
  const toast = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const progress = 50;
  const deleteSubjectMutation = useDeleteSubject();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteSubjectMutation.mutate(
      { subjectId: id, semesterId },
      {
        onSuccess: () => {
          toast.success('Subject deleted successfully');
          setDeleteDialogOpen(false);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to delete subject');
        },
      }
    );
  };

  const loading = deleteSubjectMutation.isPending;

  return (
    <>
      <Card
        className={cn(
          'group relative overflow-hidden transition-all duration-300',
          'hover:shadow-lg hover:scale-[1.02]',
          'bg-gradient-to-br from-card via-card to-card/95',
          'border-border hover:border-primary/50'
        )}
      >
        <Link href={href} className="block">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:shadow-xl transition-all shrink-0">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {name}
                  </h3>
                  {description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {description}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                onClick={handleDeleteClick}
                disabled={loading}
                aria-label={`Delete ${name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-foreground">
                  {topicCount} {topicCount === 1 ? 'Topic' : 'Topics'}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Link>

        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:to-blue-600/5 transition-all duration-300 pointer-events-none" />
      </Card>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete subject"
        itemName={name}
        onConfirm={handleDeleteConfirm}
        loading={loading}
      />
    </>
  );
}
