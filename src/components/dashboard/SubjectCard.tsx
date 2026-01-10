'use client';

import { BookOpen, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SubjectCardProps {
  id: string;
  name: string;
  description?: string | null;
  priority: number;
  topicCount: number;
  href: string;
}

export function SubjectCard({
  id,
  name,
  description,
  priority,
  topicCount,
  href,
}: SubjectCardProps) {
  return (
    <Link href={href}>
      <Card
        className={cn(
          'group relative overflow-hidden transition-all duration-300',
          'hover:shadow-lg hover:scale-[1.02] cursor-pointer',
          'bg-gradient-to-br from-card via-card to-card/95',
          'border-border hover:border-primary/50'
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:shadow-xl transition-all">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {name}
                </h3>
                {description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-foreground">
              {topicCount} {topicCount === 1 ? 'Topic' : 'Topics'}
            </span>
          </div>
        </CardContent>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:to-blue-600/5 transition-all duration-300 pointer-events-none" />
      </Card>
    </Link>
  );
}

