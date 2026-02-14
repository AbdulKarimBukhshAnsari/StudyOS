'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNotesByTopic } from '@/hooks/useNotesQueries';
import { useQuizResults, useSaveQuizResult } from '@/hooks/useQuizQueries';
import { QuizRunner } from '@/components/dashboard/QuizRunner';
import { FileText, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Quiz } from '@/types/semester';

interface QuizDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicId: string;
  quiz: Quiz | null;
}

type View = 'detail' | 'runner' | 'result';

export function QuizDetailModal({
  open,
  onOpenChange,
  topicId,
  quiz,
}: QuizDetailModalProps) {
  const [view, setView] = useState<View>('detail');
  const [lastScore, setLastScore] = useState<{ score: number; total: number } | null>(null);

  const { data: notes = [] } = useNotesByTopic(topicId, { enabled: open && !!quiz });
  const { data: results = [] } = useQuizResults(
    topicId,
    quiz?.id ?? '',
    { enabled: open && !!quiz?.id }
  );
  const saveResultMutation = useSaveQuizResult();

  const noteNames =
    quiz?.notes_ids?.map(
      (id) => notes.find((n) => n.id === id)?.topic_name ?? id.slice(0, 8)
    ) ?? [];
  const totalQuestions = quiz?.questions?.length ?? 0;
  const canStart = totalQuestions > 0;

  const handleStart = () => {
    setView('runner');
    setLastScore(null);
  };

  const handleComplete = (score: number, answers: Array<{ questionId: string; selectedAnswer: number }>) => {
    if (!quiz) return;
    setLastScore({ score, total: totalQuestions });
    saveResultMutation.mutate(
      { topicId, quizId: quiz.id, score, answers },
      { onSettled: () => setView('result') }
    );
  };

  const handleRetake = () => {
    setView('runner');
    setLastScore(null);
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) setView('detail');
    onOpenChange(nextOpen);
  };

  if (!quiz) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          'sm:max-w-[520px]',
          (view === 'runner' || view === 'result') && 'sm:max-w-[560px]'
        )}
      >
        {view === 'detail' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-violet-700 dark:text-violet-300">
                {quiz.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {noteNames.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Notes included
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {noteNames.map((name, i) => (
                      <li
                        key={i}
                        className="inline-flex items-center gap-1 rounded-md bg-violet-100 dark:bg-violet-900/30 px-2 py-0.5 text-sm"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {results.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    Previous attempts
                  </p>
                  <ul className="space-y-1 text-sm">
                    {results.slice(0, 5).map((r) => (
                      <li key={r.id}>
                        Score: {r.score} / {quiz.questions?.length ?? 0} —{' '}
                        {new Date(r.created_at).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Button
                className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700"
                onClick={handleStart}
                disabled={!canStart}
              >
                {results.length > 0 ? 'Retake Quiz' : 'Start Quiz'}
              </Button>
            </div>
          </>
        )}

        {view === 'runner' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-violet-700 dark:text-violet-300">
                {quiz.name}
              </DialogTitle>
            </DialogHeader>
            <QuizRunner
              quiz={quiz}
              topicId={topicId}
              onComplete={handleComplete}
            />
          </>
        )}

        {view === 'result' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-violet-700 dark:text-violet-300">
                Quiz complete
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {lastScore && (
                <p className="text-center text-2xl font-semibold">
                  Score: {lastScore.score} / {lastScore.total}
                </p>
              )}
              {saveResultMutation.isError && (
                <p className="text-sm text-destructive">
                  Result could not be saved. You can retake the quiz.
                </p>
              )}
              <Button
                className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700"
                onClick={handleRetake}
              >
                Retake Quiz
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleClose(false)}
              >
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
