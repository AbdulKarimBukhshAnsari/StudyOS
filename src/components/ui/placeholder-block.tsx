'use client';

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PlaceholderBlockProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  iconClassName?: string;
  className?: string;
}

export function PlaceholderBlock({
  icon: Icon,
  title,
  description,
  iconClassName = 'text-muted-foreground',
  className,
}: PlaceholderBlockProps) {
  return (
    <div
      className={cn(
        'min-h-[400px] flex items-center justify-center border border-dashed rounded-lg bg-muted/20',
        className
      )}
    >
      <div className="text-center">
        <Icon className={cn('h-12 w-12 mx-auto mb-4', iconClassName)} />
        <p className="font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
