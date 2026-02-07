'use client';

import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = 'Loading...',
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'min-h-[400px] flex items-center justify-center border border-dashed rounded-lg bg-muted/20',
        className
      )}
    >
      <div className="text-center text-muted-foreground">{message}</div>
    </div>
  );
}
