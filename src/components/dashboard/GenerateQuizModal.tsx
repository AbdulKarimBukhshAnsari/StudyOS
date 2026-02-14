'use client';

import { useState, useRef, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNotesByTopic } from '@/hooks/useNotesQueries';
import { useCreateQuiz } from '@/hooks/useQuizQueries';
import { useToast } from '@/context/toastContext';
import { cn } from '@/lib/utils';
import { FileText, ChevronDown, X } from 'lucide-react';
import { LoadingState } from '@/components/ui/loading-state';
import type { Note } from '@/types/semester';

const QUESTION_COUNTS = [5, 10, 15] as const;
const QUESTION_TYPES = ['MCQs', 'True or False', 'Both'] as const;
const COMPLEXITY_OPTIONS = ['Easy', 'Medium', 'Hard'] as const;

interface GenerateQuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicId: string;
}

export function GenerateQuizModal({
  open,
  onOpenChange,
  topicId,
}: GenerateQuizModalProps) {
  const toast = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const [selectedNoteIds, setSelectedNoteIds] = useState<Set<string>>(new Set());
  const [notesDropdownOpen, setNotesDropdownOpen] = useState(false);
  const [questionCount, setQuestionCount] = useState<string>('10');
  const [questionType, setQuestionType] = useState<string>('Both');
  const [complexity, setComplexity] = useState<string>('Medium');

  const { data: notes = [], isLoading: notesLoading } = useNotesByTopic(topicId, { enabled: open });
  const createQuizMutation = useCreateQuiz();

  const selectedNotes = notes.filter((n) => selectedNoteIds.has(n.id));
  const availableNotes = notes.filter((n) => !selectedNoteIds.has(n.id));

  useEffect(() => {
    if (!notesDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setNotesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notesDropdownOpen]);

  const resetForm = () => {
    setName('');
    setSelectedNoteIds(new Set());
    setQuestionCount('10');
    setQuestionType('Both');
    setComplexity('Medium');
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !createQuizMutation.isPending) {
      resetForm();
      setNotesDropdownOpen(false);
    }
    onOpenChange(nextOpen);
  };

  const addNote = (note: Note) => {
    setSelectedNoteIds((prev) => new Set(prev).add(note.id));
    setNotesDropdownOpen(false);
  };

  const removeNote = (id: string) => {
    setSelectedNoteIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Quiz name is required');
      return;
    }
    createQuizMutation.mutate(
      {
        topicId,
        name: name.trim(),
        notesIds: Array.from(selectedNoteIds),
        questionCount: Number(questionCount) || 10,
        questionType: questionType || 'Both',
        complexity: complexity || 'Medium',
      },
      {
        onSuccess: () => {
          toast.success('Quiz created');
          resetForm();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to create quiz');
        },
      }
    );
  };

  const handleClose = () => handleOpenChange(false);
  const loading = createQuizMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-violet-700 dark:text-violet-300">Generate Quiz</DialogTitle>
          <DialogDescription>
            Name your quiz, choose notes, and set options.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="quiz-name">Quiz name *</Label>
              <Input
                id="quiz-name"
                placeholder="e.g., Week 1 recap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="border-violet-200 dark:border-violet-800 focus-visible:ring-violet-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Notes to include</Label>
              {notesLoading ? (
                <LoadingState message="Loading notes..." />
              ) : notes.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center rounded-md bg-muted/50">
                  No notes in this topic yet. Add notes in the Notes tab first.
                </p>
              ) : (
                <div ref={dropdownRef} className="relative">
                  <div
                    className={cn(
                      'min-h-10 rounded-md border border-violet-200 dark:border-violet-800/50',
                      'bg-violet-50/30 dark:bg-violet-950/20 flex flex-wrap items-center gap-1.5 p-2'
                    )}
                  >
                    {selectedNotes.map((note) => (
                      <span
                        key={note.id}
                        className="inline-flex items-center gap-1 rounded-md bg-violet-200/80 dark:bg-violet-800/60 px-2 py-0.5 text-sm"
                      >
                        <span className="truncate max-w-[140px]">{note.topic_name}</span>
                        <button
                          type="button"
                          onClick={() => removeNote(note.id)}
                          className="shrink-0 rounded p-0.5 hover:bg-violet-300/80 dark:hover:bg-violet-700/80"
                          aria-label={`Remove ${note.topic_name}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                    <div className="flex-1 min-w-[80px]">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/40"
                        onClick={() => setNotesDropdownOpen((o) => !o)}
                      >
                        Add note
                        <ChevronDown
                          className={cn('h-4 w-4 transition-transform', notesDropdownOpen && 'rotate-180')}
                        />
                      </Button>
                    </div>
                  </div>
                  {notesDropdownOpen && availableNotes.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-48 overflow-y-auto rounded-md border border-violet-200 dark:border-violet-800/50 bg-popover shadow-md py-1">
                      {availableNotes.map((note) => (
                        <button
                          key={note.id}
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-violet-100 dark:hover:bg-violet-900/40"
                          onClick={() => addNote(note)}
                        >
                          <FileText className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                          <span className="truncate">{note.topic_name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {notesDropdownOpen && availableNotes.length === 0 && selectedNotes.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-md border bg-popover px-3 py-2 text-sm text-muted-foreground">
                      All notes selected
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Number of questions</Label>
              <Select value={questionCount} onValueChange={setQuestionCount} disabled={loading}>
                <SelectTrigger className="border-violet-200 dark:border-violet-800 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_COUNTS.map((n) => (
                    <SelectItem key={n} value={String(n)} className="w-full">
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Question type</Label>
              <Select value={questionType} onValueChange={setQuestionType} disabled={loading}>
                <SelectTrigger className="border-violet-200 dark:border-violet-800 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="w-full">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Complexity</Label>
              <Select value={complexity} onValueChange={setComplexity} disabled={loading}>
                <SelectTrigger className="border-violet-200 dark:border-violet-800 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPLEXITY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c} className="w-full">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !name.trim() || selectedNoteIds.size === 0 || !questionCount || !questionType || !complexity}
              className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700"
            >
              {loading ? 'Generating quiz...' : 'Create Quiz'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
