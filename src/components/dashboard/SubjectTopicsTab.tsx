'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EmptyStateCard } from '@/components/ui/empty-state-card';
import { SectionHeader } from '@/components/ui/section-header';
import { CardList } from '@/components/ui/card-list';
import { ListRow } from '@/components/ui/list-row';
import { WarningBanner } from '@/components/ui/warning-banner';
import { AddTopicModal } from './AddTopicModal';
import { cn } from '@/lib/utils';
import { routeHelpers } from '@/constants/routes';
import type { Topic } from '@/types/semester';

interface SubjectTopicsTabProps {
  subjectId: string;
  semesterId: string;
  topics: Topic[];
}

const MAX_TOPICS = 50;

function getStatusColor(status: string) {
  switch (status) {
    case 'Clear':
      return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
    case 'Somewhat Clear':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'Clear':
      return '✓';
    case 'Somewhat Clear':
      return '~';
    default:
      return '○';
  }
}

export function SubjectTopicsTab({ subjectId, semesterId, topics }: SubjectTopicsTabProps) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const canAddMore = topics.length < MAX_TOPICS;
  const remainingSlots = MAX_TOPICS - topics.length;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={BookOpen}
        title="Topics"
        subtitle={`${topics.length} of ${MAX_TOPICS} topics${canAddMore ? ` • ${remainingSlots} slots remaining` : ''}`}
        actionLabel="Add Topic"
        onAction={() => setAddModalOpen(true)}
        actionDisabled={!canAddMore}
        actionIcon={Plus}
      />

      {!canAddMore && (
        <WarningBanner
          message={`Maximum limit of ${MAX_TOPICS} topics reached. Delete existing topics to add new ones.`}
        />
      )}

      {topics.length === 0 ? (
        <EmptyStateCard
          icon={BookOpen}
          title="No Topics Yet"
          description="Get started by creating your first topic. You can add notes, flashcards, and quizzes later."
          actionLabel="Create Your First Topic"
          actionIcon={Plus}
          onAction={() => setAddModalOpen(true)}
        />
      ) : (
        <CardList>
          {topics.map((topic, index) => (
            <Link
              key={topic.id}
              href={routeHelpers.topic(semesterId, subjectId, topic.id)}
              className="block"
            >
              <ListRow
                index={index}
                totalCount={topics.length}
                title={topic.name}
                right={
                  <Badge
                    variant="outline"
                    className={cn('text-xs font-medium px-3 py-1', getStatusColor(topic.status))}
                  >
                    <span className="mr-1.5">{getStatusIcon(topic.status)}</span>
                    {topic.status}
                  </Badge>
                }
              />
            </Link>
          ))}
        </CardList>
      )}

      <AddTopicModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        subjectId={subjectId}
        semesterId={semesterId}
        currentTopicCount={topics.length}
        maxTopics={MAX_TOPICS}
      />
    </div>
  );
}
