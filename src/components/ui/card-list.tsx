'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface CardListProps {
  children: React.ReactNode;
  className?: string;
}

export function CardList({ children, className }: CardListProps) {
  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="divide-y">{children}</div>
      </CardContent>
    </Card>
  );
}
