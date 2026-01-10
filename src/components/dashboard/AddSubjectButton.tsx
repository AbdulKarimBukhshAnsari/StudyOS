'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddSubjectModal } from './AddSubjectModal';

interface AddSubjectButtonProps {
  semesterId: string;
}

export function AddSubjectButton({ semesterId }: AddSubjectButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        <Plus className="h-4 w-4" />
        New Subject
      </Button>
      <AddSubjectModal
        open={open}
        onOpenChange={setOpen}
        semesterId={semesterId}
      />
    </>
  );
}

