import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  title: string | ReactNode;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function DashboardHeader({ 
  title, 
  subtitle, 
  action,
  className 
}: DashboardHeaderProps) {
  return (
    <header className={cn(
      "border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10",
      className
    )}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            {typeof title === 'string' ? (
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {title}
              </h1>
            ) : (
              <h1 className="text-2xl font-bold">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && (
            <div>
              {action}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

