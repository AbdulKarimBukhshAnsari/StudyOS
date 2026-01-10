'use client';

import { ChevronRight, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  options?: Array<{ id: string; label: string; href: string }>;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  onItemClick?: (item: BreadcrumbItem) => void;
  className?: string;
}

export function BreadcrumbNav({ items, onItemClick, className }: BreadcrumbNavProps) {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      dropdownRefs.current.forEach((ref) => {
        if (ref && !ref.contains(event.target as Node)) {
          setExpandedIndex(null);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item: BreadcrumbItem, index: number) => {
    if (item.options && item.options.length > 0) {
      setExpandedIndex(expandedIndex === index ? null : index);
    } else {
      if (onItemClick) {
        onItemClick(item);
      } else if (item.href) {
        router.push(item.href);
      }
    }
  };

  return (
    <nav
      className={cn(
        'flex items-center gap-1 text-sm text-muted-foreground',
        className
      )}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isExpanded = expandedIndex === index;
        const hasOptions = item.options && item.options.length > 0;

        return (
          <div key={item.id} className="flex items-center gap-1 relative">
            <button
              onClick={() => handleItemClick(item, index)}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-md transition-colors',
                'hover:bg-accent hover:text-foreground',
                isLast && 'text-foreground font-medium',
                hasOptions && 'cursor-pointer'
              )}
            >
              <span>{item.label}</span>
              {hasOptions && (
                <ChevronDown
                  className={cn(
                    'h-3 w-3 transition-transform',
                    isExpanded && 'rotate-180'
                  )}
                />
              )}
            </button>

            {hasOptions && isExpanded && (
              <div
                ref={(el) => {
                  dropdownRefs.current[index] = el;
                }}
                className="absolute top-full left-0 mt-1 z-50 min-w-[200px] bg-popover border border-border rounded-lg shadow-lg py-1"
              >
                {item.options?.map((option) => (
                  <button
                    key={option.id}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
                    onClick={() => {
                      if (onItemClick) {
                        onItemClick({ ...item, ...option });
                      } else if (option.href) {
                        router.push(option.href);
                      }
                      setExpandedIndex(null);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {!isLast && (
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 mx-1" />
            )}
          </div>
        );
      })}
    </nav>
  );
}

