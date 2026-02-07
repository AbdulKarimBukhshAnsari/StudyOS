'use client';

import type { LucideIcon } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WarningBannerProps {
  message: string;
  icon?: LucideIcon;
  className?: string;
}

export function WarningBanner({
  message,
  icon: Icon = AlertCircle,
  className,
}: WarningBannerProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400',
        className
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
