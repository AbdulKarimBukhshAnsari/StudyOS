import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { BreadcrumbNav, BreadcrumbItem } from './BreadcrumbNav';

interface DashboardHeaderProps {
  title?: string | ReactNode;
  subtitle?: string;
  action?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  onBreadcrumbClick?: (item: BreadcrumbItem) => void;
  className?: string;
}

export function DashboardHeader({ 
  title, 
  subtitle, 
  action,
  breadcrumbs,
  onBreadcrumbClick,
  className 
}: DashboardHeaderProps) {
  return (
    <header className={cn(
      "border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10",
      className
    )}>
      <div className="px-6 py-4">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <BreadcrumbNav 
                items={breadcrumbs} 
                onItemClick={onBreadcrumbClick}
                className="mb-2"
              />
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
        ) : (
          <div className="flex items-center justify-between">
            <div>
              {title && (
                typeof title === 'string' ? (
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {title}
                  </h1>
                ) : (
                  <h1 className="text-2xl font-bold">
                    {title}
                  </h1>
                )
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
        )}
      </div>
    </header>
  );
}

