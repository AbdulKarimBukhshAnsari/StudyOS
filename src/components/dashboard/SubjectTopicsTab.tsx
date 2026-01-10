'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AddTopicModal } from './AddTopicModal';
import { cn } from '@/lib/utils';
import { routeHelpers } from '@/constants/routes';

interface Topic {
  id: string;
  name: string;
  status: 'Not Clear' | 'Somewhat Clear' | 'Clear';
  order_index: number;
  created_at: Date;
}

interface SubjectTopicsTabProps {
  subjectId: string;
  semesterId: string;
  topics: Topic[];
}

const MAX_TOPICS = 50;

export function SubjectTopicsTab({ subjectId, semesterId, topics }: SubjectTopicsTabProps) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const canAddMore = topics.length < MAX_TOPICS;
  const remainingSlots = MAX_TOPICS - topics.length;

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Clear':
        return '✓';
      case 'Somewhat Clear':
        return '~';
      default:
        return '○';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Topics
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {topics.length} of {MAX_TOPICS} topics
            {canAddMore && ` • ${remainingSlots} slots remaining`}
          </p>
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          disabled={!canAddMore}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
          Add Topic
        </Button>
      </div>

      {/* Limit Warning */}
      {!canAddMore && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm font-medium">
            Maximum limit of {MAX_TOPICS} topics reached. Delete existing topics to add new ones.
          </p>
        </div>
      )}

      {/* Topics List */}
      {topics.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Topics Yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Get started by creating your first topic. You can add notes, flashcards, and quizzes later.
              </p>
              <Button
                onClick={() => setAddModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Topic
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {topics.map((topic, index) => (
                <Link
                  key={topic.id}
                  href={routeHelpers.topic(semesterId, subjectId, topic.id)}
                  className={cn(
                    'flex items-center justify-between px-6 py-4 hover:bg-accent/50 transition-colors cursor-pointer block',
                    index === 0 && 'rounded-t-lg',
                    index === topics.length - 1 && 'rounded-b-lg'
                  )}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-sm font-semibold text-blue-600">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {topic.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs font-medium px-3 py-1',
                        getStatusColor(topic.status)
                      )}
                    >
                      <span className="mr-1.5">{getStatusIcon(topic.status)}</span>
                      {topic.status}
                    </Badge>
                  </div>
                  </div>
                  
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <AddTopicModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        subjectId={subjectId}
        currentTopicCount={topics.length}
        maxTopics={MAX_TOPICS}
      />
    </div>
  );
}

