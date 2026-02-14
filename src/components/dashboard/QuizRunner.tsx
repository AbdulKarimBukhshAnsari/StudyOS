'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Quiz, QuizQuestion } from '@/types/semester';

const TIMER_SECONDS = 30;

type AnswerEntry = { questionId: string; selectedAnswer: number };

interface QuizRunnerProps {
  quiz: Quiz;
  topicId: string;
  onComplete: (score: number, answers: AnswerEntry[]) => void;
}

export function QuizRunner({ quiz, onComplete }: QuizRunnerProps) {
  const questions = useMemo(() => quiz.questions ?? [], [quiz.questions]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerEntry[]>([]);
  const answersRef = useRef<AnswerEntry[]>([]);
  const [phase, setPhase] = useState<'answering' | 'revealed'>('answering');
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const q = questions[currentIndex] as QuizQuestion | undefined;
  const isLast = currentIndex === questions.length - 1;

  useEffect(() => {
    if (phase !== 'answering' || !q) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          setPhase('revealed');
          setSelectedOption(-1);
          setAnswers((prev) => [
            ...prev,
            { questionId: String(currentIndex), selectedAnswer: -1 },
          ]);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, currentIndex, q]);

  const handleNext = () => {
    if (isLast) {
      const finalAnswers = answersRef.current;
      const score = finalAnswers.filter(
        (a, i) => questions[i]?.correctAnswer === a.selectedAnswer
      ).length;
      onComplete(score, finalAnswers);
    } else {
      setCurrentIndex((i) => i + 1);
      setPhase('answering');
      setTimeLeft(TIMER_SECONDS);
      setSelectedOption(null);
    }
  };

  const handleSelect = (optionIndex: number) => {
    if (phase !== 'answering') return;
    setSelectedOption(optionIndex);
    setAnswers((prev) => [
      ...prev,
      { questionId: String(currentIndex), selectedAnswer: optionIndex },
    ]);
    setPhase('revealed');
  };

  if (!q) {
    return (
      <p className="text-sm text-muted-foreground py-4">No questions in this quiz.</p>
    );
  }

  const correctIndex = q.correctAnswer;
  const showResult = phase === 'revealed';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-sm">
        <span className="text-violet-600 dark:text-violet-400 font-medium">
          Question {currentIndex + 1} of {questions.length}
        </span>
        {phase === 'answering' && (
          <span
            className={cn(
              'font-mono font-semibold',
              timeLeft <= 10 ? 'text-red-600' : 'text-foreground'
            )}
          >
            {timeLeft}s
          </span>
        )}
      </div>

      <p className="text-lg font-medium">{q.question}</p>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const isSelected = selectedOption === i;
          const isCorrect = i === correctIndex;
          const showGreen = showResult && isCorrect;
          const showRed = showResult && isSelected && !isCorrect;
          return (
            <Button
              key={i}
              variant="outline"
              className={cn(
                'w-full justify-start h-auto py-3 px-4 text-left',
                showGreen && 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400',
                showRed && 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400'
              )}
              disabled={phase === 'revealed'}
              onClick={() => handleSelect(i)}
            >
              {opt}
            </Button>
          );
        })}
      </div>

      {showResult && (
        <>
          <div className="rounded-lg border border-violet-200 dark:border-violet-800/50 bg-violet-50/50 dark:bg-violet-950/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400 mb-2">
              Explanation
            </p>
            {q.explanation ? (
              <p className="text-sm text-foreground">{q.explanation}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No explanation provided.</p>
            )}
          </div>
          <Button
            className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700"
            onClick={handleNext}
          >
            {isLast ? 'See results' : 'Next question'}
          </Button>
        </>
      )}
    </div>
  );
}
