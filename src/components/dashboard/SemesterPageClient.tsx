'use client';

import { useState } from 'react';
import { SubjectCard } from './SubjectCard';
import { AddSubjectModal } from './AddSubjectModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';
import type { SubjectWithTopicCount } from '@/types/semester';
import { routeHelpers } from '@/constants/routes';

interface SemesterPageClientProps {
  semesterId: string;
  subjects: SubjectWithTopicCount[];
}

export function SemesterPageClient({
  semesterId,
  subjects,
}: SemesterPageClientProps) {
  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <>
      <div className="flex-1 overflow-y-auto p-6">
        {subjects.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">No Subjects Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by creating your first subject for this semester. Add topics, notes, and track your progress.
                </p>
                <Button
                  onClick={() => setAddModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Plus className="h-5 w-5" />
                  Create Your First Subject
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                id={subject.id}
                name={subject.name}
                description={subject.description}
                priority={subject.priority}
                topicCount={subject.topic_count}
                href={routeHelpers.subject(semesterId, subject.id)}
                semesterId={semesterId}
              />
            ))}
          </div>
        )}
      </div>

      <AddSubjectModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        semesterId={semesterId}
      />
    </>
  );
}

