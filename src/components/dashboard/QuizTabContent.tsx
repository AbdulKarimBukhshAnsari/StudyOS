'use client';

import { useState } from 'react';
import { HelpCircle, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { SectionHeader } from '@/components/ui/section-header';
import { EmptyStateCard } from '@/components/ui/empty-state-card';
import { CardList } from '@/components/ui/card-list';
import { LoadingState } from '@/components/ui/loading-state';
import { useQuizzesByTopic, useDeleteQuiz } from '@/hooks/useQuizQueries';
import { GenerateQuizModal } from '@/components/dashboard/GenerateQuizModal';
import { QuizDetailModal } from '@/components/dashboard/QuizDetailModal';
import { useToast } from '@/context/toastContext';
import { cn } from '@/lib/utils';
import type { Quiz } from '@/types/semester';

const quizEmptyIconClass = 'bg-violet-500/10';
const quizEmptyIconColor = 'text-violet-600';
const quizActionGradient =
  'bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700';

interface QuizTabContentProps {
  topicId: string;
}

function QuizRow({
  quiz,
  index,
  totalCount,
  onSelect,
  onDelete,
}: {
  quiz: Quiz;
  index: number;
  totalCount: number;
  onSelect: (quiz: Quiz) => void;
  onDelete: (e: React.MouseEvent, quiz: Quiz) => void;
}) {
  const qCount = quiz.questions?.length ?? 0;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(quiz)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(quiz)}
      className={cn(
        'flex items-center gap-4 px-6 py-4 hover:bg-accent/50 transition-colors cursor-pointer',
        index === 0 && 'rounded-t-lg',
        index === totalCount - 1 && 'rounded-b-lg'
      )}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-sm font-semibold text-violet-600 dark:text-violet-400">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">{quiz.name}</h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          {qCount} question{qCount !== 1 ? 's' : ''}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="opacity-70 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(e, quiz);
        }}
        aria-label="Delete quiz"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function QuizTabContent({ topicId }: QuizTabContentProps) {
  const toast = useToast();
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
  const { data: quizzes = [], isLoading } = useQuizzesByTopic(topicId);
  const deleteQuizMutation = useDeleteQuiz();

  const handleDeleteConfirm = () => {
    if (!quizToDelete) return;
    deleteQuizMutation.mutate(
      { topicId, quizId: quizToDelete.id },
      {
        onSuccess: () => {
          toast.success('Quiz deleted');
          setQuizToDelete(null);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to delete quiz');
        },
      }
    );
  };

  if (isLoading) {
    return <LoadingState message="Loading quizzes..." />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={HelpCircle}
        iconClassName={quizEmptyIconColor}
        title="Quiz"
        subtitle={`${quizzes.length} quiz${quizzes.length !== 1 ? 'zes' : ''}`}
        actionLabel="Generate Quiz"
        onAction={() => setGenerateModalOpen(true)}
        actionIcon={Plus}
        actionClassName={quizActionGradient}
      />

      {quizzes.length === 0 ? (
        <EmptyStateCard
          icon={HelpCircle}
          iconContainerClassName={quizEmptyIconClass}
          iconClassName={quizEmptyIconColor}
          title="No Quizzes Yet"
          description="Generate a quiz from your notes. Choose a name and which notes to include."
          actionLabel="Generate Quiz"
          actionIcon={Plus}
          onAction={() => setGenerateModalOpen(true)}
          actionClassName={quizActionGradient}
        />
      ) : (
        <CardList>
          {quizzes.map((quiz, index) => (
            <QuizRow
              key={quiz.id}
              quiz={quiz}
              index={index}
              totalCount={quizzes.length}
              onSelect={(q) => {
                setSelectedQuiz(q);
                setDetailModalOpen(true);
              }}
              onDelete={(e) => {
                e.stopPropagation();
                setQuizToDelete(quiz);
              }}
            />
          ))}
        </CardList>
      )}

      <ConfirmDeleteDialog
        open={!!quizToDelete}
        onOpenChange={(open) => !open && setQuizToDelete(null)}
        title="Delete quiz"
        itemName={quizToDelete?.name ?? ''}
        onConfirm={handleDeleteConfirm}
        loading={deleteQuizMutation.isPending}
      />

      <QuizDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        topicId={topicId}
        quiz={selectedQuiz}
      />

      <GenerateQuizModal
        open={generateModalOpen}
        onOpenChange={setGenerateModalOpen}
        topicId={topicId}
      />
    </div>
  );
}
