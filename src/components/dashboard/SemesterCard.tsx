'use client';

import { GraduationCap, BookOpen, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SemesterCardProps {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  subjectCount: number;
  href: string;
}

export function SemesterCard({
  id,
  name,
  startDate,
  endDate,
  isActive,
  subjectCount,
  href,
}: SemesterCardProps) {
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
              <div
                className={cn(
                  'p-3 rounded-lg transition-all duration-300',
                  isActive
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg group-hover:shadow-xl'
                    : 'bg-gradient-to-br from-muted to-muted/50'
                )}
              >
                <GraduationCap
                  className={cn(
                    'h-6 w-6 transition-colors',
                    isActive ? 'text-white' : 'text-muted-foreground'
                  )}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={isActive ? 'default' : 'secondary'}
                    className={cn(
                      isActive &&
                        'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0'
                    )}
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-foreground">
                {subjectCount} {subjectCount === 1 ? 'Subject' : 'Subjects'}
              </span>
            </div>
          </div>
        </CardContent>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-purple-600/0 group-hover:from-purple-500/5 group-hover:to-purple-600/5 transition-all duration-300 pointer-events-none" />
      </Card>
    </Link>
  );
}

