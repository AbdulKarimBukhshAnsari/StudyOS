'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateCardProps {
  icon: LucideIcon;
  iconContainerClassName?: string;
  iconClassName?: string;
  title: string;
  description: string;
  actionLabel: string;
  /** Optional icon shown before the label, e.g. Plus */
  actionIcon?: LucideIcon;
  onAction: () => void;
  actionClassName?: string;
  className?: string;
}

export function EmptyStateCard({
  icon: Icon,
  iconContainerClassName = 'bg-blue-500/10',
  iconClassName = 'text-blue-600',
  title,
  description,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  actionClassName = 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
  className,
}: EmptyStateCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-12 text-center">
        <div className="max-w-md mx-auto">
          <div
            className={cn(
              'w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center',
              iconContainerClassName
            )}
          >
            <Icon className={cn('h-8 w-8', iconClassName)} />
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-6">{description}</p>
          <Button onClick={onAction} className={actionClassName}>
            {ActionIcon && <ActionIcon className="h-4 w-4 mr-2" />}
            {actionLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
