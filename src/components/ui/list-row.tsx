'use client';

import { cn } from '@/lib/utils';

export interface ListRowProps {
  index: number;
  totalCount: number;
  title: string;
  right?: React.ReactNode;
  /** When provided, row is clickable (button). */
  onClick?: () => void;
  /** When provided, row renders as link (use with Next.js Link or pass href). */
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export function ListRow({
  index,
  totalCount,
  title,
  right,
  onClick,
  href,
  className,
  children,
}: ListRowProps) {
  const baseClass = cn(
    'flex items-center justify-between px-6 py-4 hover:bg-accent/50 transition-colors cursor-pointer',
    index === 0 && 'rounded-t-lg',
    index === totalCount - 1 && 'rounded-b-lg',
    className
  );

  const content = (
    <>
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-sm font-semibold text-blue-600">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">{title}</h4>
        </div>
        {right != null && (
          <div className="flex items-center gap-3 flex-shrink-0">{right}</div>
        )}
      </div>
      {children}
    </>
  );

  if (href != null) {
    return (
      <a href={href} className={cn(baseClass, 'block')}>
        {content}
      </a>
    );
  }

  if (onClick != null) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        className={baseClass}
      >
        {content}
      </div>
    );
  }

  return <div className={baseClass}>{content}</div>;
}
