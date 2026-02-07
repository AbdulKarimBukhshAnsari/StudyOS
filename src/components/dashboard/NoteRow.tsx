'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListRow } from '@/components/ui/list-row';
import type { Note } from '@/types/semester';

interface NoteRowProps {
  note: Note;
  index: number;
  totalCount: number;
  onSelect: (note: Note) => void;
  onDelete: (e: React.MouseEvent, note: Note) => void;
}

export function NoteRow({
  note,
  index,
  totalCount,
  onSelect,
  onDelete,
}: NoteRowProps) {
  return (
    <ListRow
      index={index}
      totalCount={totalCount}
      title={note.topic_name}
      onClick={() => onSelect(note)}
      right={
        <Button
          variant="ghost"
          size="icon"
          className="opacity-70 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
          onClick={(e) => onDelete(e, note)}
          aria-label="Delete note"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      }
    />
  );
}
