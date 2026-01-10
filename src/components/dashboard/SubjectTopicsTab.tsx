'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AddTopicModal } from './AddTopicModal';

interface Topic {
  id: string;
  name: string;
  status: 'Not Clear' | 'Somewhat Clear' | 'Clear';
  order_index: number;
  created_at: Date;
}

interface SubjectTopicsTabProps {
  subjectId: string;
  topics: Topic[];
}

export function SubjectTopicsTab({ subjectId, topics }: SubjectTopicsTabProps) {
  const [addModalOpen, setAddModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Clear':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'Somewhat Clear':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Topics</h3>
          <p className="text-sm text-muted-foreground">
            Manage and organize your learning topics
          </p>
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Topic
        </Button>
      </div>

      {topics.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No topics yet</p>
          <Button
            variant="outline"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Topic
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <span className="font-medium text-sm">{topic.name}</span>
              <Badge
                variant="outline"
                className={`text-xs ${getStatusColor(topic.status)}`}
              >
                {topic.status}
              </Badge>
            </div>
          ))}
        </div>
      )}

      <AddTopicModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        subjectId={subjectId}
      />
    </div>
  );
}

