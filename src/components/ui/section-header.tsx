'use client';

import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  icon: LucideIcon;
  iconClassName?: string;
  title: string;
  subtitle?: string;
  actionLabel: string;
  actionIcon?: LucideIcon;
  onAction: () => void;
  actionDisabled?: boolean;
  actionClassName?: string;
  className?: string;
}

export function SectionHeader({
  icon: Icon,
  iconClassName = 'text-blue-600',
  title,
  subtitle,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  actionDisabled = false,
  actionClassName = 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Icon className={cn('h-5 w-5', iconClassName)} />
          {title}
        </h3>
        {subtitle != null && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      <Button
        onClick={onAction}
        disabled={actionDisabled}
        className={actionClassName}
      >
        {ActionIcon && <ActionIcon className="h-4 w-4 mr-2" />}
        {actionLabel}
      </Button>
    </div>
  );
}
